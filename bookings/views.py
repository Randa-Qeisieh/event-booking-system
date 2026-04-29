from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly

from .models import Event, Attendee, Booking
from .serializers import EventSerializer, AttendeeSerializer, BookingSerializer

class EventViewSet(viewsets.ModelViewSet) :
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    # anyone can view events, but only logged-in users can create or edit
    permission_classes = [IsAuthenticatedOrReadOnly] 
    
    
class AttendeeViewSet(viewsets.ModelViewSet) :
    queryset = Attendee.objects.all()
    serializer_class = AttendeeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    
class BookingViewSet(viewsets.ModelViewSet) :
    # select_related loads event and attendee in the same SQL query (performance)
    queryset = Booking.objects.select_related('event', 'attendee').all()
    serializer_class = BookingSerializer
    # all booking actions require authentication
    permission_classes = [IsAuthenticated] 
    
    def create(self, request, *args, **kwargs) :
        # loading incoming JSON data into the serializer
        serializer = self.get_serializer(data=request.data)
        # run all validation
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'], url_path='cancel')
    def cancel_booking(self, request, pk=None) :
        # creates endpoint : POST /api/bookings/{id}/cancel/ - cancels a booking safely
        booking = self.get_object()
        if booking.status == 'cancelled' :
            return Response(
                {'detail' : 'Booking is already cancelled'},
                status = status.HTTP_400_BAD_REQUEST
            )
        booking.status = 'cancelled'
        # use direct DB update to bypass clean() since this is an update not a create
        Booking.objects.filter(pk=booking.pk).update(status='cancelled')
        return Response({'detail' : 'Booking cancelled successfully.'})