import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookings, cancelBooking } from '../store/bookingSlice';

const BookingList = () => {
    const dispatch = useDispatch();
    const bookings = useSelector(state => state.bookings.items);
    const status = useSelector(state => state.bookings.status);
    const error = useSelector(state => state.bookings.error);

    // fetch all bookings when the component loads
    useEffect(() => {
        dispatch(fetchBookings());
    }, [dispatch]);

    if (status === 'loading') {
        return (
            <div className="p-6 text-center text-gray-500">
                Loading bookings...
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className="p-6 text-center text-red-500">
                Failed to load bookings. Please make sure you are logged in.
            </div>
        );
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">My Bookings</h2>

            {bookings.length === 0 ? (
                <p className="text-gray-500">No bookings yet.</p>
            ) : (
                <div className="space-y-4">
                    {bookings.map(booking => (
                        <div
                            key={booking.id}
                            className="flex justify-between items-center bg-white p-4 shadow rounded-lg"
                        >
                            <div>
                                <p className="font-bold">Booking #{booking.id}</p>
                                <p className="text-sm text-gray-500">
                                    Event ID: {booking.event}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Status:
                                    <span className={
                                        booking.status === 'cancelled'
                                            ? 'text-red-500 ml-1'
                                            : 'text-green-500 ml-1'
                                    }>
                                        {booking.status}
                                    </span>
                                </p>
                            </div>

                            {booking.status !== 'cancelled' && (
                                <button
                                    onClick={() => dispatch(cancelBooking(booking.id))}
                                    className="text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-50"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BookingList;