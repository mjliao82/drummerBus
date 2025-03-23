import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, Clock, MapPin, Phone, Home, Calendar, Watch } from 'lucide-react';
import socket from '../utils/socket';

// Establish WebSocket connection

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: string;
}

function BookLessons() {
  let URL: string;
  if (window.location.host === "https://lidrummerbus.web.app/") {
    URL = "https://drummerbus.onrender.com";
  } else {
    URL = "http://localhost:5001/";
  }
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [instrument, setInstrument] = useState('');
  const [duration, setDuration] = useState('');
  const [day, setDay] = useState('');
  const [time, setTime] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  //Fetch user info from backend, cookie isn't accessible on frontend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${URL}auth/me`, {
          method: 'GET',
          credentials: 'include', // ✅ Send cookies with request
        });

        if (!response.ok) {
          navigate('/login', { replace: true });
          return;
        }

        const data = await response.json();
        setUser(data.user); 
      } catch (error) {
        console.error('Error fetching user:', error);
        navigate('/login', { replace: true });
      }
    };

    fetchUser();
  }, [navigate]);

  // Send booking data via WebSocket
  const handleBookingSubmit = () => {
    if (!instrument || !duration || !day || !time) {
      alert("Please select a lesson type, duration, day, and time before submitting!");
      return;
    }

    const bookingData = {
      type: "Booking request",
      userId: user?.id,
      name: user?.name,
      email: user?.email,
      phone: user?.phone || "Not provided",
      address: user?.address || "Not provided",
      instrument,
      duration,
      day,
      time,
      additionalNotes: additionalNotes.trim() || "No additional notes",
    };

    console.log("📡 Sending booking data via WebSocket:", bookingData);
    socket.send(JSON.stringify(bookingData));
    alert("Booking request sent!");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Book Your Music Lessons</h1>
          <p className="text-xl text-gray-600">Choose your preferred lesson type and schedule</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Lesson Types */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Lesson Type</h2>
            <div className="space-y-4">
              {['Piano', 'Guitar', 'Drums', 'Voice', 'Bass', 'Violin'].map((instr) => (
                <label key={instr} className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:border-indigo-600 transition">
                  <input
                    type="radio"
                    name="instrument"
                    className="h-4 w-4 text-indigo-600"
                    onChange={() => setInstrument(instr)}
                  />
                  <span className="text-gray-700">{instr}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Lesson Duration */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Duration</h2>
            <div className="space-y-4">
              {['30 minutes', '1 hour', '1.5 hours', '2 hours', '3+ hours'].map((dur) => (
                <label key={dur} className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:border-indigo-600 transition">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="duration"
                      className="h-4 w-4 text-indigo-600"
                      onChange={() => setDuration(dur)}
                    />
                    <span className="text-gray-700">{dur}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Day and Time Selection */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Day</h2>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              onChange={(e) => setDay(e.target.value)}
            >
              <option value="">Select a day</option>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Time</h2>
            <input
              type="time"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>

        {/* Student Information */}
        <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Information</h2>
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                <input type="text" name="name" value={user.name} readOnly className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Email</label>
                <input type="email" name="email" value={user.email} readOnly className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Address</label>
                <input type="text" name="email" value={user.address} readOnly className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Phone Number</label>
                <input type="text" name="email" value={user.phone} readOnly className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100" />
              </div>
            </div>
          </form>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleBookingSubmit}
          className="w-full bg-indigo-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-indigo-700 transition"
        >
          Submit Booking Request
        </button>
      </div>
    </div>
  );
}

export default BookLessons;