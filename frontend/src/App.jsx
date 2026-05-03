import React, { useState } from 'react';
import Navbar from './components/Navbar';
import EventList from './components/EventList';
import BookingList from './components/BookingList';
import AttendeeList from './components/AttendeeList';

function App() {
  const [view, setView] = useState('events');

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar setView={setView} currentView={view} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {view === 'events' && (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-black text-slate-900">Discover Events</h1>
              <p className="text-slate-500">Find and book your next experience.</p>
            </div>
            <EventList />
          </div>
        )}

        {view === 'bookings' && <BookingList />}
        {view === 'attendees' && <AttendeeList />}
      </main>
    </div>
  );
}

export default App;