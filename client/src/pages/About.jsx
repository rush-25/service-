import React from 'react';
import { ShieldCheck, Target, Heart, Eye, Users, Layers, Award } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen text-left">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-[#111827] to-slate-900 py-24 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1920&q=50')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
        <div className="relative z-10 max-w-4xl mx-auto space-y-4">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Our Corporate Journey</span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">About DriveEasy</h1>
          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Engineered to deliver hassle-free luxury car sharing and rentals across premium corporate hotspots.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-24">

        {/* Core Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Who We Are</span>
            <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">Empowering Seamless Car Share Experiences</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              DriveEasy was founded in 2026 with a bold objective: to completely eliminate traditional vehicle rental headaches, slow airport lines, and ambiguous hidden fees.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed">
              By merging premium keyless fleet integrations with fully transparent calculations, we allow our luxury-seeking drivers to unlock executive supercars in under two minutes flat.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shrink-0">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-900">Our Shared Mission</h4>
                <p className="text-xs text-gray-500 leading-relaxed mt-1">
                  To establish the worlds most responsive luxury booking framework, keeping client-first convenience at the forefront of each transaction.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shrink-0">
                <Eye className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-900">Our Future Vision</h4>
                <p className="text-xs text-gray-500 leading-relaxed mt-1">
                  Pioneering autonomous car shares and fully carbon-neutral luxury fleets across all key airport transit hubs worldwide.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Statistics Block */}
        <div className="bg-white border border-gray-100 rounded-3xl p-8 sm:p-12 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <p className="text-4xl font-black text-blue-600">5,000+</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Premium Trips</p>
          </div>
          <div className="space-y-1">
            <p className="text-4xl font-black text-blue-600">120+</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Luxury Models</p>
          </div>
          <div className="space-y-1">
            <p className="text-4xl font-black text-blue-600">99.8%</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">CSAT Rating</p>
          </div>
          <div className="space-y-1">
            <p className="text-4xl font-black text-blue-600">10+</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Global Hubs</p>
          </div>
        </div>

        {/* Corporate Leadership Team */}
        <div className="space-y-12 text-center">
          <div className="space-y-3">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Leadership</span>
            <h2 className="text-3xl font-extrabold text-gray-900">DriveEasy Executives</h2>
            <p className="text-gray-400 text-sm max-w-lg mx-auto">Committed to pushing boundaries in engineering and customer services.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">

            <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-4 shadow-sm">
              <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80" alt="CEO" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-900">Alexander Thorne</h4>
                <p className="text-xs font-semibold text-blue-600">Chief Executive Officer</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-4 shadow-sm">
              <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80" alt="COO" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-900">Victoria Sterling</h4>
                <p className="text-xs font-semibold text-blue-600">Chief Operations Officer</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-4 shadow-sm">
              <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80" alt="VP Sales" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-900">Marcus Vance</h4>
                <p className="text-xs font-semibold text-blue-600">VP of Fleet Experience</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
