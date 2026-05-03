import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAttendees } from '../store/attendeeSlice';

const AttendeeList = () => {
    const dispatch = useDispatch();
    const { items, status } = useSelector((state) => state.attendees);

    useEffect(() => {
        dispatch(fetchAttendees());
    }, [dispatch]);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50">
                <h2 className="text-lg font-bold text-gray-900">System Attendees</h2>
                <p className="text-sm text-gray-500">List of users currently registered for events.</p>
            </div>
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">ID</th>
                        <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</th>
                        <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Contact Info</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {items.map((person) => (
                        <tr key={person.id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4 text-sm text-gray-400 text-center">#{person.id}</td>
                            <td className="p-4 text-sm font-bold text-gray-900">{person.full_name}</td>
                            <td className="p-4">
                                <div className="text-sm text-gray-900">{person.email}</div>
                                <div className="text-xs text-gray-400">{person.phone_number}</div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AttendeeList;