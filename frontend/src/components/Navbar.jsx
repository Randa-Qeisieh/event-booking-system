import React from 'react';

const Navbar = ({ setView, currentView }) => {
    const navItems = [
        { id: 'events', label: 'Browse Events' },
        { id: 'bookings', label: 'My Bookings' },
        { id: 'attendees', label: 'Attendee Directory' }
    ];

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-black text-xl">E</span>
                        </div>
                        <span className="text-xl font-black tracking-tight text-gray-900">EVENTLY</span>
                    </div>
                    <div className="hidden md:flex space-x-8">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setView(item.id)}
                                className={`text-sm font-semibold transition-colors ${
                                currentView === item.id ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}>
                                    {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;