from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError

# Models for this systems : Event, Attendee and Booking

class Event(models.Model) :
    title = models.CharField(max_length=200)
    description = models.TextField() 
    location = models.CharField(max_length=300)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    capacity = models.PositiveIntegerField() # validation that it must be greater than 0
    created_at = models.DateTimeField(auto_now_add=True) # to be set automatically when created
    
    # inner class where we put table-level settings
    class Meta :
        ordering = ['start_date'] # events returned sorted by date
        
    def __str__(self) :
        # how it's shown in the admin panel
        return f"{self.title} ({self.start_date.strftime('%Y-%m-%d')})"
    
    def available_seats(self) : 
        # if the booking is cancelled, it does'nt count toward capacity
        active_bookings = self.bookings.exclude(status='cancelled').count()
        return self.capacity - active_bookings
    
    def is_full(self) :
        # if no seats remain, return true
        return self.available_seats() <= 0
    
    def is_past(self) :
        # if the starting date has already passed, return true
        return self.start_date < timezone.now()
    

class Attendee(models.Model) :
    full_name = models.CharField(max_length=200)
    email = models.EmailField(unique=True) #each attendee to have a special email
    phone_number = models.CharField(max_length=10) 
    
    def __str__(self) :
        return f"{self.full_name} <{self.email}>"
    

class Booking(models.Model) :
    STATUS_CHOICES = [
        # two-value tuple — the first value is what gets stored in the database, 
        # and the second is what gets displayed to humans
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    ]
    
    # many bookings can belong to one event
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="bookings")
    # also many bookings can belong to the one attendee
    attendee = models.ForeignKey(Attendee, on_delete=models.CASCADE, related_name="bookings")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='confirmed')
    booking_date = models.DateTimeField(auto_now_add=True)
    
    class Meta :
        # preventing the same attendee from booking the same event twice at DB level 
        unique_together = ('event', 'attendee') 
        
    def __str__(self) :
        return f"{self.attendee.full_name} -> {self.event.title} [{self.status}]"
    
    # django's built-in method, runs before saving to the DB and raises
    # errors if something is wrong, save() calls it automatically
    def clean(self) :
        # if the pk exists = the booking already exists in the DB so no need to check the creating steps
        if self.pk :
            return 
        
        # checking if the event is in the past or not
        if self.event.is_past():
            raise ValidationError("Cannot book a past event.")
        
        # checking if the event is actually full or not
        if self.event.is_full():
            raise ValidationError("This event is fully booked.")
        
        # checking if the booking already exists with the same event and attendee
        duplicate = Booking.objects.filter(
            event=self.event,
            attendee=self.attendee
        ).exists()
        if duplicate:
            raise ValidationError("This attendee has already booked this event.")
        
    def save(self, *args, **kwargs):
        self.full_clean()       # runs clean() before anything - always validate before saving 
        super().save(*args, **kwargs)  # actually saves to DB