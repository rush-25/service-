import React, { useState } from 'react';
import { ShieldCheck, Award, Zap, Compass, Map, Layers } from 'lucide-react';

const Services = () => {
  return (
    <div className="bg-gray-50 min-h-screen text-left">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 py-24 px-4 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1920&q=50')] bg-cover opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10 max-w-4xl mx-auto space-y-4">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Our Offerings</span>
          <h1 className="text-4xl sm:text-5xl font-black">DriveEasy Services</h1>
          <p className="text-gray-300 text-sm max-w-xl mx-auto">Discover custom-tailored mobility packages engineered for high-flying professionals.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-20">

        {/* Services Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl w-14 h-14 flex items-center justify-center">
              <Compass className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">VIP Showroom Pickup</h3>
            <p className="text-gray-500 text-xs leading-relaxed">
              Skip standard counter waiting lines completely. Utilize our secure, code-access key lockers to unlock your selected car within seconds of your arrival.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl w-14 h-14 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Comprehensive Coverage</h3>
            <p className="text-gray-500 text-xs leading-relaxed">
              All bookings come standard with Premium Loss Damage Waiver options and multi-point emergency roadside support, ensuring you can drive with confidence.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl w-14 h-14 flex items-center justify-center">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Flexible Rental Rates</h3>
            <p className="text-gray-500 text-xs leading-relaxed">
              Our system applies automatic premium weekly and monthly discounts. Rent for 7+ days or 30+ days to unlock massive executive budget rate reductions.
            </p>
          </div>

        </div>

        {/* Dynamic call out info */}
        <div className="bg-[#111827] text-white p-8 sm:p-12 rounded-3xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-lg">
          <div className="md:col-span-8 space-y-4">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Enterprise solutions</span>
            <h3 className="text-2xl font-extrabold tracking-tight">Need a Corporate Account for Your Team?</h3>
            <p className="text-sm text-gray-400 max-w-xl">
              DriveEasy offers premium corporate portals with bulk booking discounts, dedicated 24/7 key locker support managers, and consolidated monthly invoices.
            </p>
          </div>
          <div className="md:col-span-4 md:text-right">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-6 h-12 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/10 transition-all cursor-pointer"
            >
              Contact Corporate Sales
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Services;
