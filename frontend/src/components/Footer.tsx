import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, Music2 } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center">
              <Music2 className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">MusicBus</span>
            </div>
            <p className="mt-4 text-gray-600">
              Bringing music education directly to your doorstep. Experience the convenience
              of professional music lessons in our state-of-the-art mobile studio.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Contact
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="tel:+1234567890" className="text-gray-600 hover:text-indigo-600">
                  (123) 456-7890
                </a>
              </li>
              <li>
                <a href="mailto:info@musicbus.com" className="text-gray-600 hover:text-indigo-600">
                  info@musicbus.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Follow Us
            </h3>
            <div className="mt-4 flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-indigo-600"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-indigo-600"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-indigo-600"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-indigo-600"
              >
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t">
          <p className="text-center text-gray-600">
            © {new Date().getFullYear()} MusicBus. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;