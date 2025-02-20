import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, Clock, MapPin } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

function BookLessons() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  React.useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/book' } });
    }
  }, [user, navigate]);

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
              {['Piano', 'Guitar', 'Drums', 'Voice', 'Bass', 'Violin'].map((instrument) => (
                <label key={instrument} className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:border-indigo-600 transition">
                  <input type="radio" name="instrument" className="h-4 w-4 text-indigo-600" />
                  <span className="text-gray-700">{instrument}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Lesson Duration */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Duration</h2>
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
                    <input type="radio" name="duration" className="h-4 w-4 text-indigo-600" />
                    <span className="text-gray-700">{option.duration}</span>
                  </div>
                  <span className="text-indigo-600 font-semibold">{option.price}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Student Information */}
        <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Information</h2>
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  placeholder="Enter your name"
                  defaultValue={user.name}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  placeholder="Enter your email"
                  defaultValue={user.email}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Contact Method</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent">
                  <option>Phone</option>
                  <option>Email</option>
                  <option>Text</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                placeholder="Enter your address"
              />
            </div>

            {/* Multiple Students Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Students</h3>
                <button
                  type="button"
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                  + Add Another Student
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    placeholder="Student name"
                  />
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    placeholder="Student age"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
              <textarea
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                placeholder="Any specific requirements or questions?"
              />
            </div>
          </form>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="flex items-center space-x-4">
            <Music className="h-8 w-8 text-indigo-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Professional Teachers</h3>
              <p className="text-sm text-gray-600">Experienced music educators</p>
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

        <button className="w-full bg-indigo-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-indigo-700 transition">
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