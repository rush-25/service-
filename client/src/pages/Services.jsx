import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, Zap, Compass, Map, Layers, CheckCircle2, ChevronRight, Briefcase } from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const Services = () => {
  return (
    <div className="bg-gray-50 min-h-screen text-left font-sans selection:bg-blue-500/30">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1920&q=50')] bg-cover opacity-10 mix-blend-overlay"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center max-w-3xl mx-auto space-y-8"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Our Offerings</span>
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
              DriveEasy <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Services</span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-lg md:text-xl text-gray-300 leading-relaxed font-medium max-w-xl mx-auto">
              Discover custom-tailored mobility packages engineered for high-flying professionals.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Core Services Bento Grid - Light theme */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Main Feature Card */}
            <motion.div variants={fadeIn} className="md:col-span-2 group relative overflow-hidden rounded-[2.5rem] bg-white border border-gray-100 p-8 md:p-14 transition-all duration-500 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-900/5">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="relative z-10 flex flex-col h-full justify-between gap-12">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 text-blue-600 shadow-sm border border-blue-100">
                  <Compass className="h-8 w-8" />
                </div>
                
                <div className="space-y-6 max-w-xl">
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">VIP Showroom Pickup</h3>
                  <p className="text-gray-500 text-lg leading-relaxed">
                    Skip standard counter waiting lines completely. Utilize our secure, code-access key lockers to unlock your selected car within seconds of your arrival.
                  </p>
                  <ul className="space-y-4 pt-4">
                    {['Zero wait time upon arrival', 'Contactless secure handover', '24/7 dedicated terminal access'].map((item, i) => (
                      <li key={i} className="flex items-center gap-4 text-sm md:text-base text-gray-700 font-semibold">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
                           <CheckCircle2 className="h-4 w-4 text-blue-600" />
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Side Feature 1 */}
            <motion.div variants={fadeIn} className="group relative overflow-hidden rounded-[2.5rem] bg-white border border-gray-100 p-8 md:p-10 transition-all duration-500 hover:border-emerald-100 hover:shadow-2xl hover:shadow-emerald-900/5">
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative z-10 flex flex-col h-full gap-8">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 text-emerald-600">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                
                <div className="space-y-4 mt-auto">
                  <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Comprehensive Coverage</h3>
                  <p className="text-gray-500 text-base leading-relaxed">
                    Premium Loss Damage Waiver options and multi-point emergency roadside support come standard with every executive booking.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Side Feature 2 */}
            <motion.div variants={fadeIn} className="group relative overflow-hidden rounded-[2.5rem] bg-white border border-gray-100 p-8 md:p-10 transition-all duration-500 hover:border-amber-100 hover:shadow-2xl hover:shadow-amber-900/5">
              <div className="absolute inset-0 bg-gradient-to-b from-amber-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative z-10 flex flex-col h-full gap-8">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 text-amber-600">
                  <Zap className="h-7 w-7" />
                </div>
                
                <div className="space-y-4 mt-auto">
                  <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Flexible Rental Rates</h3>
                  <p className="text-gray-500 text-base leading-relaxed">
                    Our system applies automatic premium weekly and monthly discounts. Rent for 7+ days to unlock massive executive budget rate reductions.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Side Feature 3 - Corporate Banner */}
            <motion.div variants={fadeIn} className="md:col-span-2 group relative overflow-hidden rounded-[2.5rem] bg-[#111827] text-white p-8 md:p-12 transition-all duration-500 shadow-xl flex flex-col md:flex-row items-center justify-between gap-10">
               <div className="relative z-10 space-y-5 max-w-lg">
                  <div className="inline-flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">
                    <Briefcase className="h-4 w-4" /> Enterprise solutions
                  </div>
                  <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight">Need a Corporate Account?</h3>
                  <p className="text-gray-400 text-lg leading-relaxed font-medium">
                    DriveEasy offers premium corporate portals with bulk booking discounts, dedicated 24/7 key locker support managers, and consolidated monthly invoices.
                  </p>
               </div>
               
               <div className="relative z-10 shrink-0 w-full md:w-auto md:text-right">
                 <Link to="/contact" className="group/btn inline-flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 text-white hover:bg-blue-700 rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1 w-full md:w-auto text-lg">
                    Contact Sales
                    <ChevronRight className="h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
                 </Link>
               </div>
            </motion.div>

          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;
