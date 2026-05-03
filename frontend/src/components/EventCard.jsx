import React, { useState } from 'react';
import BookingForm from './BookingForm';

const EventCard = ({ event }) => {
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col">
            <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                        event.is_past 
                            ? 'bg-red-100 text-red-600' 
                            : 'bg-green-100 text-green-600'
                    }`}>
                        {event.is_past ? 'Past' : 'Active'}
                    </span>
                </div>

                <p className="text-gray-500 text-sm mb-4 italic">📍 {event.location}</p>
                <p className="text-gray-600 text-sm line-clamp-3">{event.description}</p>

                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className={`text-sm font-semibold ${
                        event.available_seats === 0 
                            ? 'text-red-500' 
                            : 'text-indigo-600'
                    }`}>
                        {event.available_seats} / {event.capacity} seats left
                    </span>
                </div>
            </div>

            <div className="p-6 pt-0">
                {!showForm ? (
                    <button
                        disabled={event.is_full || event.is_past}
                        onClick={() => setShowForm(true)}
                        className={`w-full py-2 rounded-lg font-bold transition ${
                            event.is_full || event.is_past
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100'
                        }`}
                    >
                        {event.is_past ? 'Event Ended' : event.is_full ? 'Sold Out' : 'Book Ticket'}
                    </button>
                ) : (
                    <div className="mt-2">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-bold text-gray-700">Quick Registration</span>
                            <button
                                onClick={() => setShowForm(false)}
                                className="text-xs text-red-500 underline"
                            >
                                Cancel
                            </button>
                        </div>
                        <BookingForm eventId={event.id} onSuccess={() => setShowForm(false)} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventCard;