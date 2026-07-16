import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Mail, Phone, MapPin, Clock, Share2, Globe, Compass, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#111827] text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg">
                <Car className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Drive<span className="text-blue-500">Easy</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              DriveEasy is the premier luxury car sharing and rental platform, engineered to offer you effortless access to a fleet of top-tier supercars, executive cruisers, and advanced electric vehicles.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-gray-800 hover:bg-blue-600 rounded-xl text-gray-400 hover:text-white transition-all">
                <Share2 className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 hover:bg-blue-600 rounded-xl text-gray-400 hover:text-white transition-all">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 hover:bg-blue-600 rounded-xl text-gray-400 hover:text-white transition-all">
                <Compass className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-base font-semibold mb-6 tracking-wide uppercase">Quick Links</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link to="/" className="hover:text-blue-400 transition-colors">Home Page</Link>
              </li>
              <li>
                <Link to="/cars" className="hover:text-blue-400 transition-colors">Our Premium Fleet</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-400 transition-colors">About DriveEasy</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-blue-400 transition-colors">Services Offered</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-400 transition-colors">Contact Support</Link>
              </li>
            </ul>
          </div>

          {/* Business Info */}
          <div>
            <h3 className="text-white text-base font-semibold mb-6 tracking-wide uppercase">Company Info</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-500 shrink-0" />
                <span>9850 Wilshire Blvd, Beverly Hills, Los Angeles, CA 90210</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-500 shrink-0" />
                <span>+1 555-0199</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-500 shrink-0" />
                <span>support@driveeasy.com</span>
              </li>
            </ul>
          </div>

          {/* Work Hours & Secure Badge */}
          <div className="space-y-6">
            <h3 className="text-white text-base font-semibold mb-2 tracking-wide uppercase">Business Hours</h3>
            <div className="flex gap-3 text-sm text-gray-400">
              <Clock className="h-5 w-5 text-blue-500 shrink-0" />
              <div>
                <p>Mon - Fri: 8:00 AM - 10:00 PM</p>
                <p>Sat - Sun: 9:00 AM - 8:00 PM</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-800/50 border border-gray-800 rounded-2xl">
              <ShieldCheck className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-xs text-white font-semibold">100% Secure Checkout</p>
                <p className="text-[10px] text-gray-400">Fully encrypted Stripe & cash rental guarantees</p>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-12 border-gray-800" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} DriveEasy Car Rental Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-blue-400">Privacy Policy</a>
            <a href="#" className="hover:text-blue-400">Terms of Service</a>
            <a href="#" className="hover:text-blue-400">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
