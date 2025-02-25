import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Calendar from '../components/Calendar';
import LessonDetailsModal from '../components/LessonDetailsModal';
import { format } from 'date-fns';

function AdminCalendar() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [bookings, setBookings] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // Fetch bookings from the backend
  useEffect(() => {
    fetch('/api/bookings')
      .then((response) => response.json())
      .then((data) => {
        const formattedBookings = data.map((lesson) => ({
          id: lesson.id,
          title: `${lesson.instrument} Lesson - ${lesson.student_name}`,
          start: `${lesson.requested_date}T${lesson.requested_time}`,
          end: new Date(
            new Date(`${lesson.requested_date}T${lesson.requested_time}`).getTime() + lesson.duration_minutes * 60000
          ).toISOString(),
          extendedProps: {
            student: lesson.student_name,
            instrument: lesson.instrument,
            location: lesson.location,
            status: lesson.status,
          },
        }));
        setBookings(formattedBookings);
      })
      .catch((error) => console.error('Error fetching bookings:', error));
  }, []);

  
  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

  // Handle clicking on an event (lesson) in the calendar
  const handleEventClick = (info) => {
    setSelectedEvent({
      date: format(info.event.start, 'yyyy-MM-dd'),
      time: format(info.event.start, 'HH:mm'),
      instrument: info.event.extendedProps.instrument,
      duration: '60 min',
      location: info.event.extendedProps.location,
      student: info.event.extendedProps.student,
      status: info.event.extendedProps.status,
      price: 65,
    });
  };

  // Handle selecting a date on the calendar to add a lesson
  const handleDateSelect = (info) => {
    setSelectedDate(info);
    setShowAddEventModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lesson Calendar</h1>
            <p className="mt-2 text-gray-600">Manage all your scheduled lessons</p>
          </div>
          <button
            onClick={() => setShowAddEventModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Add Lesson
          </button>
        </div>

        <Calendar events={bookings} onEventClick={handleEventClick} onDateSelect={handleDateSelect} isAdmin={true} />

        {selectedEvent && (
          <LessonDetailsModal isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} lesson={selectedEvent} />
        )}

        {/* Add Lesson Modal */}
        {showAddEventModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[calc(100vh-40px)]">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Add New Lesson</h2>
                <button
                  onClick={() => setShowAddEventModal(false)}
                  className="text-gray-400 hover:text-gray-500 transition"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                      <select className="w-full px-3 py-2 border rounded-md">
                        <option>John Doe</option>
                        <option>Jane Smith</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Instrument</label>
                      <select className="w-full px-3 py-2 border rounded-md">
                        <option>Piano</option>
                        <option>Guitar</option>
                        <option>Drums</option>
                        <option>Voice</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border rounded-md"
                          defaultValue={selectedDate ? format(selectedDate.start, 'yyyy-MM-dd') : undefined}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                        <input
                          type="time"
                          className="w-full px-3 py-2 border rounded-md"
                          defaultValue={selectedDate ? format(selectedDate.start, 'HH:mm') : undefined}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                      <select className="w-full px-3 py-2 border rounded-md">
                        <option>30 minutes</option>
                        <option>45 minutes</option>
                        <option>60 minutes</option>
                        <option>90 minutes</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="Enter lesson location"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                      <textarea
                        className="w-full px-3 py-2 border rounded-md"
                        rows={3}
                        placeholder="Add any notes about the lesson"
                      />
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowAddEventModal(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
                      >
                        Add Lesson
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminCalendar;
