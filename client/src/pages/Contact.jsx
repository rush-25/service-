import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Toast from '../components/Toast';
import { Mail, Phone, Clock, MapPin, Send, MessageSquare } from 'lucide-react';

const slideLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const slideRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [toast, setToast] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setToast({ message: 'Thank you! Your message has been sent. Our team will contact you shortly.', type: 'success' });
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="bg-gray-50 min-h-screen text-left py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="max-w-3xl mb-12 space-y-2">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Connect With Us</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Contact DriveEasy Support</h1>
          <p className="text-sm text-gray-500">Have questions about our luxury models, insurance, or custom multi-day plans? Get in touch.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left Column: Details & Office Hours */}
          <motion.div 
            initial="hidden" animate="visible" variants={slideLeft}
            className="lg:col-span-5 space-y-8"
          >
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Corporate Headquarters</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 text-sm">Indika Motors</h5>
                    <p className="text-xs text-gray-400 mt-0.5">Colombo Rd, Maikkulama, Chilaw</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 text-sm">Direct Phone</h5>
                    <div className="text-xs text-gray-400 mt-0.5 space-y-1">
                      <p>+94773535282</p>
                      <p>+94773511935</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 text-sm">Email Support</h5>
                    <p className="text-xs text-gray-400 mt-0.5">indikamotoschilaw@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 text-sm">Operational Office Hours</h5>
                    <p className="text-xs text-gray-400 mt-0.5">Monday - Friday: 8:00 AM - 10:00 PM</p>
                    <p className="text-xs text-gray-400">Saturday - Sunday: 9:00 AM - 8:00 PM</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Simulated Interactive Map Block */}
            <div className="bg-[#111827] text-white p-8 rounded-3xl relative overflow-hidden aspect-video shadow-lg">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=50')] bg-cover opacity-20 mix-blend-overlay"></div>
              <div className="relative z-10 space-y-4">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Active Hub Location</span>
                <h4 className="text-base font-bold">Chilaw GPS Grid Map</h4>
                <p className="text-xs text-gray-400">Our physical pickup lounge is positioned perfectly on Colombo Rd, offering VIP refreshments and 24/7 keyless pick lockers.</p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600 rounded-lg text-xs font-semibold">
                  <span>Showroom open now</span>
                </div>
              </div>
            </div>

          </motion.div>

          {/* Right Column: Premium Contact Form */}
          <motion.div 
            initial="hidden" animate="visible" variants={slideRight}
            className="lg:col-span-7"
          >
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-gray-900">Send Us A Message</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 h-11 bg-gray-50 border border-gray-200 focus:border-blue-500 rounded-xl text-xs font-semibold focus:outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full px-4 h-11 bg-gray-50 border border-gray-200 focus:border-blue-500 rounded-xl text-xs font-semibold focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Message or Requirement</label>
                <textarea
                  placeholder="Tell us about your rental requests or commercial contract needs..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-4 h-32 bg-gray-50 border border-gray-200 focus:border-blue-500 rounded-xl text-xs font-semibold focus:outline-none resize-none transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-6 h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
              >
                <Send className="h-4 w-4" />
                Send Inquiry
              </button>
            </form>
          </motion.div>

        </div>

      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Contact;
