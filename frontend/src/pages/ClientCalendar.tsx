import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Calendar from '../components/Calendar';
import LessonDetailsModal from '../components/LessonDetailsModal';
import { format } from 'date-fns';

function ClientCalendar() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [selectedEvent, setSelectedEvent] = React.useState<any>(null);

  if (!user || user.role !== 'client') {
    navigate('/login');
    return null;
  }

  // Sample events - in a real app, these would come from your backend
  const events = [
    {
      id: '1',
      title: 'Piano Lesson',
      start: '2024-03-20T15:00:00',
      end: '2024-03-20T16:00:00',
      extendedProps: {
        instrument: 'Piano',
        location: '123 Music St',
        status: 'confirmed'
      }
    },
    {
      id: '2',
      title: 'Guitar Lesson',
      start: '2024-03-21T14:00:00',
      end: '2024-03-21T15:00:00',
      extendedProps: {
        instrument: 'Guitar',
        location: '456 Melody Ave',
        status: 'pending'
      }
    }
  ];

  const handleEventClick = (info: any) => {
    setSelectedEvent({
      date: format(info.event.start, 'yyyy-MM-dd'),
      time: format(info.event.start, 'HH:mm'),
      instrument: info.event.extendedProps.instrument,
      duration: '60 min',
      location: info.event.extendedProps.location,
      student: user.name,
      status: info.event.extendedProps.status,
      price: 65,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Schedule</h1>
          <p className="mt-2 text-gray-600">View your upcoming lessons</p>
        </div>

        <Calendar
          events={events}
          onEventClick={handleEventClick}
        />

        {selectedEvent && (
          <LessonDetailsModal
            isOpen={!!selectedEvent}
            onClose={() => setSelectedEvent(null)}
            lesson={selectedEvent}
          />
        )}
      </div>
    </div>
  );
}

export default ClientCalendar;