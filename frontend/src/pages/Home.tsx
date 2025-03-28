import React from 'react';
import { useNavigate } from 'react-router-dom';
import VideoBackground from '../components/VideoBackground';
import ImageCarousel from '../components/ImageCarousel';
import { Calendar, Phone, Mail, Music } from 'lucide-react';

const demoImages = [
  {
    url: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0',
    alt: 'Drum set in studio'
  },
  {
    url: 'https://images.unsplash.com/photo-1543443258-92b04ad5ec4b',
    alt: 'Drummer performing'
  },
  {
    url: 'https://images.unsplash.com/photo-1457523054379-8d03ab9fc2aa',
    alt: 'Drum lesson'
  }
];

function Home() {
  const navigate = useNavigate();
  const promoText = "Special Offer: Book your first drum lesson today and get 20% off!";
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Video Background */}
      <VideoBackground 
        videoUrl="background-video.mp4"
        fallbackImageUrl="https://images.unsplash.com/photo-1520523839897-bd0b52f945a0"
      >
        <div className="flex items-center justify-center h-full text-center px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Drum Lessons That Come to You
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Experience the convenience of professional drum education in our state-of-the-art mobile studio
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/contact')}
                className="bg-indigo-600 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-indigo-700 transition"
              >
                Request a Lesson
              </button>
            </div>
          </div>
        </div>
      </VideoBackground>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Promo Banner */}
        <div className="bg-indigo-600 text-white p-4 rounded-lg text-center mb-16">
          <p className="text-lg font-semibold">{promoText}</p>
        </div>

        {/* Image Carousel Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Mobile Drum Studio</h2>
          <ImageCarousel images={demoImages} />
        </section>

        {/* Features Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Choose Us?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Calendar className="h-10 w-10 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Flexible Scheduling</h3>
              <p className="text-gray-600">Choose from various time slots that fit your busy schedule</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Music className="h-10 w-10 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Professional Drum Teacher</h3>
              <p className="text-gray-600">Learn from an experienced and passionate drum educator</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Mail className="h-10 w-10 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
              <p className="text-gray-600">Simple online booking system with instant confirmation</p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Get in Touch</h2>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              <div className="space-y-4">
                <a href="tel:+1234567890" className="flex items-center text-gray-600 hover:text-indigo-600">
                  <Phone className="h-5 w-5 mr-2" />
                  (123) 456-7890
                </a>
                <a href="mailto:info@musicbus.com" className="flex items-center text-gray-600 hover:text-indigo-600">
                  <Mail className="h-5 w-5 mr-2" />
                  info@musicbus.com
                </a>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-4">Quick Inquiry</h3>
              <form className="space-y-4">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                />
                <textarea
                  placeholder="Your message"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;