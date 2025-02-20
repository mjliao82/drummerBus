import React from 'react';
import { Phone, Mail, MapPin, Clock, Music2 } from 'lucide-react';

function Contact() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-600">We'd love to hear from you</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent">
                  <option>General Inquiry</option>
                  <option>Lesson Information</option>
                  <option>Pricing Questions</option>
                  <option>Technical Support</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
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
                  <h3 className="font-semibold text-gray-900">What instruments do you teach?</h3>
                  <p className="text-gray-600">We offer lessons for piano, guitar, drums, voice, bass, and violin.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Do you offer trial lessons?</h3>
                  <p className="text-gray-600">Yes! First-time students can book a single trial lesson before committing to a package.</p>
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