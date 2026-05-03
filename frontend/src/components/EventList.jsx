import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents } from '../store/eventSlice';
import EventCard from './EventCard';

const EventList = () => {
    const dispatch = useDispatch();
    const { items, status } = useSelector((state) => state.events);

    useEffect(() => {
        if (status === 'idle') dispatch(fetchEvents());
    }, [status, dispatch]);

    if (status === 'loading') {
        return (
            <div className="text-center text-gray-500 py-10">
                Loading events...
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="text-center text-gray-500 py-10">
                No events available.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map(event => (
                <EventCard key={event.id} event={event} />
            ))}
        </div>
    );
};

export default EventList;