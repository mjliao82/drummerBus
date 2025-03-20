import React from 'react';
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Calendar, CreditCard, Clock, Music } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import LessonDetailsModal from '../components/LessonDetailsModal';
import PaymentDetailsModal from '../components/PaymentDetailsModal';


interface Booking {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  instrument: string;
  duration: string;
  day: string;
  time: string;
  status: string;
}


function StudentDashboard() {
  let URL: string;
  if (window.location.host === "https://lidrummerbus.web.app/") {
    URL = "https://drummerbus.onrender.com";
  } else {
    URL = "http://localhost:5001/";
  }
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [selectedLesson, setSelectedLesson] = React.useState<any>(null);
  const [selectedPayment, setSelectedPayment] = React.useState<any>(null);
  const [subscribed, setSubscribed] = React.useState<Booking[]>([]); // State for fetched bookings


  if (!user || user.role !== 'client') {
    navigate('/login');
    return null;
  }
  const fetch_lessons = async () => {
    try {
      const response = await fetch(`${URL}fetch/bookings`, {
        method: "GET"
      });
      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
    }
      const data = await response.json();
      const userBookings = data.filter((booking: { name: string; }) => booking.name === user.name);
      setSubscribed(userBookings);
    } catch(err) {
      console.error('Error: ', err)
    }
  };
  useEffect(() => {
    fetch_lessons();
  }, []); 



  const upcomingLessons: any[] = [

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
            <h2 className="text-xl font-bold text-gray-900">Lesson Timeslot</h2>
          </div>
          <div className="p-6">
            <div className="divide-y">
              {subscribed.map((lesson, index) => (
                <div key={index} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {lesson.instrument} Lesson
                      </p>
                      <p className="text-sm text-gray-600">
                        {lesson.day} at {lesson.time} ({lesson.duration})
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          lesson.status === 'Confirmed' 
                            ? 'bg-green-100 text-green-800'
                            : lesson.status === "Declined"
                            ? "bg-red-100 text-red-800"
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {lesson.status}
                        </span>

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