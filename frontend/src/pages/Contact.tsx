import React from 'react';
import { Phone, Mail, MapPin, Clock, Music2 } from 'lucide-react';
import ScrollingPhotoGallery from '../components/ScrollingPhotoGallery';

function Contact() {
  // Sample photos for the gallery
  const galleryPhotos = [
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
    },
    {
      url: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7',
      alt: 'Drum sticks'
    },
    {
      url: 'https://images.unsplash.com/photo-1461784180009-27c1303a64b6',
      alt: 'Drum performance'
    },
    {
      url: 'https://images.unsplash.com/photo-1524230659092-07f99a75c013',
      alt: 'Drum kit close-up'
    },
    {
      url: 'https://images.unsplash.com/photo-1445985543470-41fba5c3144a',
      alt: 'Drummer in action'
    },
    {
      url: 'https://images.unsplash.com/photo-1563330232-57114bb0823c',
      alt: 'Drum practice'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {/* Scrolling Photo Gallery at the bottom */}
          <div className="mt-16">
            <ScrollingPhotoGallery photos={galleryPhotos} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-600">We'd love to hear from you</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    placeholder="Enter last name"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    placeholder="Enter zip code"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent">
                    <option>General Inquiry</option>
                    <option>Drum Lesson Information</option>
                    <option>Pricing Questions</option>
                    <option>Technical Support</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <div className="mb-2 p-3 bg-amber-50 text-amber-800 text-sm rounded-md">
                  <p>If you are requesting a lesson, please make sure to include student age and skill level in your message.</p>
                  <b>Pricing varies based on locations.</b>
                </div>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  placeholder="Enter your message"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-indigo-700 transition"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-indigo-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <a href="tel:+1234567890" className="text-gray-600 hover:text-indigo-600">
                      (123) 456-7890
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-indigo-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <a href="mailto:info@musicbus.com" className="text-gray-600 hover:text-indigo-600">
                      info@musicbus.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-indigo-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Service Area</h3>
                    <p className="text-gray-600">Greater Metropolitan Area</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Clock className="h-6 w-6 text-indigo-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Business Hours</h3>
                    <p className="text-gray-600">Monday - Friday: 9am - 7pm</p>
                    <p className="text-gray-600">Saturday: 10am - 4pm</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Music2 className="h-6 w-6 text-indigo-600" />
                <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">How far do you travel?</h3>
                  <p className="text-gray-600">We service the entire metropolitan area and surrounding suburbs within a 25-mile radius.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Do I need my own drum kit?</h3>
                  <p className="text-gray-600">While having your own drum kit is beneficial for practice, it's not required. Our mobile studio is equipped with a professional drum kit for lessons.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Do you offer trial lessons?</h3>
                  <p className="text-gray-600">Yes! First-time students can book a single trial lesson before committing to a package.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">What styles of drumming do you teach?</h3>
                  <p className="text-gray-600">We offer instruction in various styles including rock, jazz, funk, metal, Latin, and electronic drumming.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;