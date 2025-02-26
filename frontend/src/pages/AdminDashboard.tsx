import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, DollarSign, Clock, Bell, Search } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import LessonDetailsModal from '../components/LessonDetailsModal';
import StudentDetailsModal from '../components/StudentDetailsModal';
import PaymentDetailsModal from '../components/PaymentDetailsModal';
import socket from '../utils/socket';

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

function AdminDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [selectedLesson, setSelectedLesson] = React.useState<any>(null);
  const [selectedStudent, setSelectedStudent] = React.useState<any>(null);
  const [selectedPayment, setSelectedPayment] = React.useState<any>(null);
  const [bookings, setBookings] = React.useState<Booking[]>([]); // State for fetched bookings
  useEffect(() =>{
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    const fetch_bookings = async () => {
      try {
        const response = await fetch("http://localhost:5001/fetch/bookings", {
          method: "GET"
        });
        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
      }
        const data = await response.json();
        setBookings(data);
      } catch(err) {
        console.error('Error: ', err)
      }
    };
    fetch_bookings();

    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type === "Ack Booking request") {
        //add to set bookings
      } else if (data.type == "Booking result") {
        console.log("updating booking with new status")
        setBookings((prevBookings) =>
        prevBookings.map((booking) =>
              booking.name === data.payload.name &&
              booking.day === data.payload.day &&
              booking.time === data.payload.time
                ? { ...booking, status: data.payload.status }
                : booking
          )
        );
      };
    };
    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [navigate, user])

  if (!user) return null;

  const notifications = [
    {
      id: '1',
      type: 'booking',
      message: 'New booking request from John Doe',
      time: '5 minutes ago'
    },
    {
      id: '2',
      type: 'payment',
      message: 'Payment received from Jane Smith',
      time: '1 hour ago'
    },
  ];

  const studentDetails = {
    name: 'John Doe',
    age: 15,
    instruments: ['Piano', 'Guitar'],
    totalLessons: 24,
    nextLesson: {
      date: '2024-03-20',
      time: '15:00',
      instrument: 'Piano'
    },
    address: '123 Music St, Harmony City',
    notes: 'Shows great potential in piano. Consider advanced repertoire.',
    progress: [
      {
        instrument: 'Piano',
        level: 'Intermediate',
        lastAssessment: '2024-02-15'
      },
      {
        instrument: 'Guitar',
        level: 'Beginner',
        lastAssessment: '2024-02-20'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage bookings, students, and more</p>
          </div>
          <div className="flex space-x-4">
            <button className="bg-white p-2 rounded-full text-gray-600 hover:text-indigo-600 relative">
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
              </div>
              <Users className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Lessons</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <Calendar className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">$8,540</p>
              </div>
              <DollarSign className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Teaching Hours</p>
                <p className="text-2xl font-bold text-gray-900">245</p>
              </div>
              <Clock className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search bookings..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                />
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
            <div className="p-6">
              <div className="divide-y">
                {bookings.map((booking) => (
                  <div key={booking.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{booking.name}</p>
                        <p className="text-sm text-gray-600">
                          {booking.instrument} - {booking.day} at {booking.time}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          booking.status === 'Confirmed' 
                            ? 'bg-green-100 text-green-800'
                            : booking.status === "Declined"
                            ? "bg-red-100 text-red-800"
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status}
                        </span>
                        <button
                          onClick={() => setSelectedLesson(booking)}
                          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
            </div>
            <div className="p-6">
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div key={notification.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${
                        notification.type === 'booking' 
                          ? 'bg-indigo-100 text-indigo-600'
                          : 'bg-green-100 text-green-600'
                      }`}>
                        {notification.type === 'booking' ? <Calendar className="h-5 w-5" /> : <DollarSign className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">{notification.message}</p>
                        <p className="text-xs text-gray-500">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <LessonDetailsModal
        isOpen={!!selectedLesson}
        onClose={() => setSelectedLesson(null)}
        lesson={selectedLesson || {}}
      />
      <StudentDetailsModal
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        student={studentDetails}
      />
      <PaymentDetailsModal
        isOpen={!!selectedPayment}
        onClose={() => setSelectedPayment(null)}
        payment={selectedPayment || {}}
      />
    </div>
  );
}

export default AdminDashboard;