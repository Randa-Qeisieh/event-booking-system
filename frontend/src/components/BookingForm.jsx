import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createAttendee } from '../store/attendeeSlice';
import { createBooking } from '../store/bookingSlice';

const BookingForm = ({ eventId, onSuccess }) => {
    const dispatch = useDispatch();
    const bookingError = useSelector(state => state.bookings.error);
    const bookingStatus = useSelector(state => state.bookings.status);

    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone_number: ''
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        try {
            // Step 1 — create the attendee first
            const attendeeResult = await dispatch(createAttendee(formData)).unwrap();

            // Step 2 — create the booking using the new attendee ID
            await dispatch(createBooking({
                event: eventId,
                attendee: attendeeResult.id
            })).unwrap();

            setSuccess(true);
            setFormData({ full_name: '', email: '', phone_number: '' });

            // call parent callback if provided
            if (onSuccess) onSuccess();

        } catch (err) {
            // show error message from Django
            if (err.non_field_errors) {
                setError(err.non_field_errors[0]);
            } else if (err.email) {
                setError('This email is already registered.');
            } else {
                setError('Something went wrong. Please try again.');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-4 rounded-lg">

            {/* success message */}
            {success && (
                <div className="bg-green-100 text-green-700 p-3 rounded">
                    Booking confirmed successfully!
                </div>
            )}

            {/* error message */}
            {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded">
                    {error}
                </div>
            )}

            <input
                type="text"
                placeholder="Full Name"
                required
                value={formData.full_name}
                className="w-full p-2 border rounded"
                onChange={e => setFormData({ ...formData, full_name: e.target.value })}
            />
            <input
                type="email"
                placeholder="Email"
                required
                value={formData.email}
                className="w-full p-2 border rounded"
                onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
            <input
                type="text"
                placeholder="Phone (10 digits)"
                required
                value={formData.phone_number}
                className="w-full p-2 border rounded"
                onChange={e => setFormData({ ...formData, phone_number: e.target.value })}
            />

            <button
                type="submit"
                disabled={bookingStatus === 'loading'}
                className="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700 disabled:opacity-50"
            >
                {bookingStatus === 'loading' ? 'Processing...' : 'Confirm Booking'}
            </button>
        </form>
    );
};

export default BookingForm;