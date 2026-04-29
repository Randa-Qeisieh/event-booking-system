# Event Booking System

A Django REST API for managing events and bookings.

## Setup
1. Clone the repo
   git clone https://github.com/Randa-Qeisieh/event-booking-system.git

2. Create and activate virtual environment
   python -m venv env
   source env/bin/activate  # Mac/Linux
   env\Scripts\activate     # Windows

3. Install dependencies
   pip install -r requirements.txt

4. Run migrations
   python manage.py migrate

5. Create superuser
   python manage.py createsuperuser

6. Run the server
   python manage.py runserver

## API Endpoints
- GET    /api/events/               → list all events
- POST   /api/events/               → create event
- GET    /api/attendees/            → list all attendees
- POST   /api/attendees/            → create attendee
- POST   /api/bookings/             → create booking
- POST   /api/bookings/{id}/cancel/ → cancel booking

## Admin Panel
http://127.0.0.1:8000/admin/

## Postman Documentation
https://documenter.getpostman.com/view/54137576/2sBXqJL1ao
