# converting model instances to/from JSON for the API

from rest_framework import serializers
from .models import Event, Booking, Attendee

class EventSerializer(serializers.ModelSerializer) :
    # these 3 field do not exist as DB columns, they're calculated by 
    # calling methods on the Event model
    available_seats = serializers.SerializerMethodField()
    is_full = serializers.SerializerMethodField()
    is_past = serializers.SerializerMethodField()
    
    class Meta : 
        model = Event
        fields = '__all__'
        
    # these 3 methods are called automatically by SerializerMethodField
    # obj is the Event instance that is being serialized now
    def get_available_seats(self, obj) :
        return obj.available_seats()
    
    def get_is_full(self, obj) :
        return obj.is_full()
    
    def get_is_past(self, obj) :
        return obj.is_past()
    
    
class AttendeeSerializer(serializers.ModelSerializer) :
    # mapping every attendee model field directly to JSON
    class Meta : 
        model = Attendee
        fields = '__all__'
        
        
class BookingSerializer(serializers.ModelSerializer) :
    # status is set by the system not the client
    status = serializers.CharField(read_only=True)
    
    class Meta :
        model = Booking
        fields = '__all__'
        # these fields are read-only cause they're controlled by the system only
        read_only_fields = ['booking_date', 'status']
        
    def validate(self, data):
        # this method receives all incoming field values as a dictionary
        # runs after individual field validation but before saving
        event = data['event']
        attendee = data['attendee']
        
        if event.is_past() :
            raise serializers.ValidationError("Cannot book a past event")
        if event.is_full() :
            raise serializers.ValidationError("This event is full already")
        if Booking.objects.filter(event=event, attendee=attendee).exists() :
            raise serializers.ValidationError("This attendee already has a booking for this event")
        
        return data