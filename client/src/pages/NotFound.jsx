import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, HelpCircle, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4 text-center">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6">
        <div className="p-4 bg-blue-50 text-blue-600 rounded-3xl w-16 h-16 flex items-center justify-center mx-auto shadow-inner">
          <Compass className="h-8 w-8 animate-spin-slow" />
        </div>
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">404 - Not Found</h2>
          <p className="text-sm text-gray-500">The luxury destination you requested is out of reach.</p>
        </div>
        <p className="text-xs text-gray-400">
          The vehicle profile, custom route, or page destination might have changed. Search our fleet catalogs to get back on track.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-1.5 px-6 h-11 text-xs font-bold text-white bg-[#111827] hover:bg-blue-600 rounded-xl transition-all shadow-md"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
