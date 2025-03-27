import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, Clock, MapPin } from 'lucide-react';
import socket from '../utils/socket';

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${URL}auth/me`, {
          method: 'GET',
          credentials: 'include',
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
  }, [navigate, URL]);

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
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Book Your Drum Lessons</h1>
          <p className="text-xl text-gray-600">Choose your preferred lesson type and schedule</p>
        </div>

        {/* Lesson Types and Duration */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Lesson Types */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <label htmlFor="instrument" className="block text-2xl font-bold text-gray-900 mb-6">
              Select Lesson Type
            </label>
            <div className="space-y-4">
              {['Beginner Drums', 'Intermediate Drums', 'Advanced Drums', 'Rock Drumming', 'Jazz Drumming', 'Electronic Drums'].map((style) => (
                <label key={style} className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:border-indigo-600 transition">
                  <input
                    type="radio"
                    name="instrument"
                    id={`instrument-${style}`}
                    className="h-4 w-4 text-indigo-600"
                    onChange={() => setInstrument(style)}
                    checked={instrument === style}
                    title={`Select ${style}`}
                  />
                  <span className="text-gray-700">{style}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Lesson Duration */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <label htmlFor="duration" className="block text-2xl font-bold text-gray-900 mb-6">
              Choose Duration
            </label>
            <div className="space-y-4">
              {[
                { duration: '30 minutes', price: 'Request Quote' },
                { duration: '1 hour', price: 'Request Quote' },
                { duration: '1.5 hours', price: 'Request Quote' },
                { duration: '2 hours', price: 'Request Quote' },
                { duration: '3+ hours', price: 'Request Quote' }
              ].map((option) => (
                <label key={option.duration} className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:border-indigo-600 transition">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="duration"
                      id={`duration-${option.duration}`}
                      className="h-4 w-4 text-indigo-600"
                      onChange={() => setDuration(option.duration)}
                      checked={duration === option.duration}
                      title={`Select ${option.duration}`}
                    />
                    <span className="text-gray-700">{option.duration}</span>
                  </div>
                  <span className="text-indigo-600 font-semibold">{option.price}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Day and Time Selection */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Select Day */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <label htmlFor="daySelect" className="block text-2xl font-bold text-gray-900 mb-6">
              Select Day
            </label>
            <select
              id="daySelect"
              title="Select Day"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              onChange={(e) => setDay(e.target.value)}
              value={day}
            >
              <option value="">Select a day</option>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Select Time */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <label htmlFor="timeSelect" className="block text-2xl font-bold text-gray-900 mb-6">
              Select Time
            </label>
            <input
              id="timeSelect"
              type="time"
              title="Select Time"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              onChange={(e) => setTime(e.target.value)}
              value={time}
            />
          </div>
        </div>

        {/* Student Information */}
        <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Information</h2>
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  id="userName"
                  type="text"
                  title="Your Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
                  defaultValue={user.name}
                  readOnly
                />
              </div>
              <div>
                <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Email
                </label>
                <input
                  id="userEmail"
                  type="email"
                  title="Your Email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
                  defaultValue={user.email}
                  readOnly
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="userPhone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  id="userPhone"
                  type="tel"
                  title="Phone Number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
                  defaultValue={user.phone}
                  readOnly
                />
              </div>
              <div>
                <label htmlFor="userAddress" className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  id="userAddress"
                  type="text"
                  title="Address"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
                  defaultValue={user.address}
                  readOnly
                />
              </div>
            </div>

            <div>
              <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                id="additionalNotes"
                rows={4}
                title="Additional Notes"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                placeholder="Any specific requirements or questions?"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
              />
            </div>
          </form>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="flex items-center space-x-4">
            <Music className="h-8 w-8 text-indigo-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Professional Teacher</h3>
              <p className="text-sm text-gray-600">Experienced drum educator</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Clock className="h-8 w-8 text-indigo-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Flexible Scheduling</h3>
              <p className="text-sm text-gray-600">Choose your preferred time</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <MapPin className="h-8 w-8 text-indigo-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Mobile Studio</h3>
              <p className="text-sm text-gray-600">We come to you</p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleBookingSubmit}
          className="w-full bg-indigo-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-indigo-700 transition"
          title="Submit Booking Request"
        >
          Request Quote
        </button>

        <div className="mt-8 text-center text-gray-600">
          <p>After submitting your request, we'll review your information and contact you with a personalized quote.</p>
          <p className="mt-2">First-time students can book a single trial lesson. Returning students must purchase lesson packages.</p>
        </div>
      </div>
    </div>
  );
}

export default BookLessons;
