import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Target, Heart, Eye, Users, Layers, Award } from 'lucide-react';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const slideUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen text-left">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-[#111827] to-slate-900 py-24 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1920&q=50')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
        <motion.div 
          initial="hidden" animate="visible" variants={staggerContainer}
          className="relative z-10 max-w-4xl mx-auto space-y-4"
        >
          <motion.span variants={slideUp} className="block text-xs font-bold text-blue-400 uppercase tracking-widest">Our Corporate Journey</motion.span>
          <motion.h1 variants={slideUp} className="text-4xl sm:text-5xl font-black text-white tracking-tight">About DriveEasy</motion.h1>
          <motion.p variants={slideUp} className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Engineered to deliver hassle-free luxury car sharing and rentals across premium corporate hotspots.
          </motion.p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-24">

        {/* Core Vision & Mission */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          <motion.div variants={slideUp} className="space-y-6">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Who We Are</span>
            <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">Empowering Seamless Car Share Experiences</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              DriveEasy was founded in 2026 with a bold objective: to completely eliminate traditional vehicle rental headaches, slow airport lines, and ambiguous hidden fees.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed">
              By merging premium keyless fleet integrations with fully transparent calculations, we allow our luxury-seeking drivers to unlock executive supercars in under two minutes flat.
            </p>
          </motion.div>
          <motion.div variants={slideUp} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
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
          </motion.div>
        </motion.div>

        {/* Dynamic Statistics Block */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
          className="bg-white border border-gray-100 rounded-3xl p-8 sm:p-12 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          <motion.div variants={slideUp} className="space-y-1">
            <p className="text-4xl font-black text-blue-600">5,000+</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Premium Trips</p>
          </motion.div>
          <motion.div variants={slideUp} className="space-y-1">
            <p className="text-4xl font-black text-blue-600">120+</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Luxury Models</p>
          </motion.div>
          <motion.div variants={slideUp} className="space-y-1">
            <p className="text-4xl font-black text-blue-600">99.8%</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">CSAT Rating</p>
          </motion.div>
          <motion.div variants={slideUp} className="space-y-1">
            <p className="text-4xl font-black text-blue-600">10+</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Global Hubs</p>
          </motion.div>
        </motion.div>

        {/* Corporate Leadership Team */}
        <div className="space-y-12 text-center">
          <div className="space-y-3">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Leadership</span>
            <h2 className="text-3xl font-extrabold text-gray-900">DriveEasy Executives</h2>
            <p className="text-gray-400 text-sm max-w-lg mx-auto">Committed to pushing boundaries in engineering and customer services.</p>
          </div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left max-w-4xl mx-auto"
          >

            <motion.div variants={slideUp} className="bg-white rounded-3xl border border-gray-100 p-6 space-y-4 shadow-sm">
              <div className="aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden">
                <img src="/team/founder.jpg" alt="Founder & Owner" className="w-full h-full object-cover" />
              </div>
              <div className="text-center">
                <h4 className="text-xl font-bold text-gray-900">Founder & Owner</h4>
                <p className="text-sm font-semibold text-blue-600 mt-1">DriveEasy / Indika Motors</p>
              </div>
            </motion.div>

            <motion.div variants={slideUp} className="bg-white rounded-3xl border border-gray-100 p-6 space-y-4 shadow-sm">
              <div className="aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden">
                <img src="/team/director.jpg" alt="Managing Director" className="w-full h-full object-cover" />
              </div>
              <div className="text-center">
                <h4 className="text-xl font-bold text-gray-900">Managing Director</h4>
                <p className="text-sm font-semibold text-blue-600 mt-1">Operations</p>
              </div>
            </motion.div>

          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default About;
