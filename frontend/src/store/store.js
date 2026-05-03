import { configureStore } from '@reduxjs/toolkit';
import eventReducer from './eventSlice';
import bookingReducer from './bookingSlice';
import attendeeReducer from './attendeeSlice';

export const store = configureStore({
    reducer: {
        events: eventReducer,
        bookings: bookingReducer,
        attendees: attendeeReducer,
    },
});