import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CreditCard, Clock, Music } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import LessonDetailsModal from '../components/LessonDetailsModal';
import PaymentDetailsModal from '../components/PaymentDetailsModal';

function StudentDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [selectedLesson, setSelectedLesson] = React.useState<any>(null);
  const [selectedPayment, setSelectedPayment] = React.useState<any>(null);

  if (!user || user.role !== 'client') {
    navigate('/login');
    return null;
  }

  const upcomingLessons = [
    {
      date: '2024-03-20',
      time: '15:00',
      instrument: 'Rock Drums',
      duration: '45 min',
      location: '123 Music St, Harmony City',
      student: user.name,
      status: 'Confirmed',
      price: 65,
      notes: 'Please practice the basic rock beats we covered last time'
    },
    {
      date: '2024-03-23',
      time: '14:30',
      instrument: 'Jazz Drums',
      duration: '60 min',
      location: '123 Music St, Harmony City',
      student: user.name,
      status: 'Pending',
      price: 85
    },
  ];

  const lessonHistory = [
    {
      date: '2024-03-15',
      instrument: 'Rock Drums',
      duration: '45 min',
      status: 'Completed',
      location: '123 Music St, Harmony City',
      student: user.name,
      price: 65,
      notes: 'Excellent progress on the drum fills'
    },
    {
      date: '2024-03-10',
      instrument: 'Beginner Drums',
      duration: '45 min',
      status: 'Completed',
      location: '123 Music St, Harmony City',
      student: user.name,
      price: 65
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
          <p className="mt-2 text-gray-600">Manage your drum lessons and account details</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Lesson Credits</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
              <CreditCard className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Next Lesson</p>
                <p className="text-2xl font-bold text-gray-900">Mar 20</p>
              </div>
              <Calendar className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Hours</p>
                <p className="text-2xl font-bold text-gray-900">24.5</p>
              </div>
              <Clock className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Drum Styles</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
              <Music className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Upcoming Lessons */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Upcoming Lessons</h2>
          </div>
          <div className="p-6">
            <div className="divide-y">
              {upcomingLessons.map((lesson, index) => (
                <div key={index} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {lesson.instrument} Lesson
                      </p>
                      <p className="text-sm text-gray-600">
                        {lesson.date} at {lesson.time} ({lesson.duration})
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedLesson(lesson)}
                      className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lesson History */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Lesson History</h2>
          </div>
          <div className="p-6">
            <div className="divide-y">
              {lessonHistory.map((lesson, index) => (
                <div key={index} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {lesson.instrument} Lesson
                      </p>
                      <p className="text-sm text-gray-600">
                        {lesson.date} ({lesson.duration}) - {lesson.status}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedLesson(lesson)}
                      className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedLesson && (
        <LessonDetailsModal
          isOpen={!!selectedLesson}
          onClose={() => setSelectedLesson(null)}
          lesson={selectedLesson}
        />
      )}
      {selectedPayment && (
        <PaymentDetailsModal
          isOpen={!!selectedPayment}
          onClose={() => setSelectedPayment(null)}
          payment={selectedPayment}
        />
      )}
    </div>
  );
}

export default StudentDashboard;