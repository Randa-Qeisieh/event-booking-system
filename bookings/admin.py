from django.contrib import admin
from .models import Event, Attendee, Booking

@admin.register(Event)
class EventAdmin(admin.ModelAdmin) :
    # columns shown in the admin list view
    list_display = ['title', 'location', 'start_date', 'end_date', 'capacity','get_available_seats']
    # to be able to search across these fields
    search_fields = ['title', 'location']
    # a filter sidebar for these fields
    list_filter = ['start_date', 'location']
    
    def get_available_seats(self, obj) :
        # calls the model helper to calculate the available seats
        return obj.available_seats()
    
    # to set the column header in the admin list view
    get_available_seats.short_description = 'Available Seats'
    
    
@admin.register(Attendee)
class AttendeeAdmin(admin.ModelAdmin) :
    list_display = ['full_name', 'email', 'phone_number']
    search_fields = ['full_name', 'email']
    

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin) :
    list_display = ['attendee', 'event', 'status', 'booking_date']
    list_filter = ['status', 'event']
    search_fields = ['attendee__full_name', 'attendee__email', 'event__title']
    # booking date cannot be edited
    readonly_fields = ['booking_date']