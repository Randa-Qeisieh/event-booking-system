# registering all viewsets with a DRF ( django rest framework ) router
# this automatically generates all standard REST endpoints

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, AttendeeViewSet, BookingViewSet

# DefaultRouter auto-generates all CRUD endpoints from a single register() call
router = DefaultRouter()
router.register(r'events', EventViewSet)
router.register(r'attendees', AttendeeViewSet)
router.register(r'bookings', BookingViewSet)

urlpatterns = [
    path('', include(router.urls))
]
