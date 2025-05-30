import React from 'react';
import { BookOpen, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-200">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-6 w-6 text-accent-500" />
              <span className="font-bold text-xl text-white">MUST LIBRARY</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your gateway to knowledge and discovery. Our library offers a diverse collection of books across various subjects to support your academic journey.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-accent-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-400 hover:text-accent-500 transition-colors">
                  Search Books
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-accent-500 transition-colors">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-accent-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">123 University Road, Academic District</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-accent-500 flex-shrink-0" />
                <span className="text-gray-400">(123) 456-7890</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-accent-500 flex-shrink-0" />
                <span className="text-gray-400">library@mustuniversity.edu</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 text-center text-gray-500">
          <p>&copy; {currentYear} MUST LIBRARY. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;