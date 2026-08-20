import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import CarCard from '../components/CarCard';
import Toast from '../components/Toast';
import {
  Search, Calendar, MapPin, ShieldCheck, Award, Zap, HelpCircle,
  Star, ArrowRight, Car, Users, Clock, HeadphonesIcon,
  ChevronDown, ChevronUp, Plane, Crown, Navigation, Key
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/* ── Animation Variants ────────────────────────────────── */
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

/* ── Stat Counter ──────────────────────────────────────── */
const StatItem = ({ value, label, suffix = '+' }) => (
  <motion.div variants={fadeIn} className="stat-animate flex flex-col items-center py-8 px-6 border-r border-gray-200 last:border-r-0">
    <span className="text-4xl font-extrabold text-blue-600 tracking-tight">
      {value}{suffix}
    </span>
    <span className="text-sm font-medium text-gray-500 mt-1">{label}</span>
  </motion.div>
);

/* ── FAQ Item ──────────────────────────────────────────── */
const FaqItem = ({ question, answer, icon }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-2xl border transition-all duration-300 overflow-hidden ${open ? 'border-blue-200 bg-blue-50/40' : 'border-gray-100 bg-gray-50'}`}>
      <button
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer focus:outline-none"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-blue-500 shrink-0">{icon}</span>}
          <span className="text-sm font-bold text-gray-900">{question}</span>
        </div>
        <span className={`shrink-0 text-blue-500 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
          <ChevronDown className="h-5 w-5" />
        </span>
      </button>
      <div className={`faq-answer ${open ? 'open' : ''}`}>
        <p className="text-sm text-gray-500 leading-relaxed px-6 pb-5 pl-14">{answer}</p>
      </div>
    </div>
  );
};

/* ── Service Card ──────────────────────────────────────── */
const ServiceCard = ({ icon, title, description, accent }) => (
  <motion.div variants={fadeIn} className={`service-card bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-4`}>
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${accent}`}>
      {icon}
    </div>
    <div>
      <h3 className="text-base font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
    <Link to="/cars" className="mt-auto inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:gap-2 transition-all">
      Learn More <ArrowRight className="h-3.5 w-3.5" />
    </Link>
  </motion.div>
);

/* ── Main Component ────────────────────────────────────── */
const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [popularCars, setPopularCars] = useState([]);
  const [locations, setLocations] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);

  // Search Form States
  const [pickupLoc, setPickupLoc] = useState('');
  const [returnLoc, setReturnLoc] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  // Toast notifications
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    const fetchPopularCars = async () => {
      try {
        const res = await api.get('/cars');
        if (res.data.success) {
          const sorted = [...res.data.data]
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 3);
          setPopularCars(sorted);
        }
      } catch (err) {
        console.error('Error fetching popular cars:', err);
      }
    };

    const fetchLocations = async () => {
      try {
        const res = await api.get('/locations');
        if (res.data.success) {
          setLocations(res.data.data);
          if (res.data.data.length > 0) {
            setPickupLoc(res.data.data[0].name);
            setReturnLoc(res.data.data[0].name);
          }
        }
      } catch (err) {
        console.error('Error fetching locations:', err);
      }
    };

    const fetchWishlist = async () => {
      if (user && user.role !== 'Administrator') {
        try {
          const res = await api.get('/wishlist');
          if (res.data.success) {
            setWishlistIds(res.data.data.map(item => item.car?._id).filter(Boolean));
          }
        } catch (err) {
          console.error('Error fetching wishlist:', err);
        }
      }
    };

    fetchPopularCars();
    fetchLocations();
    fetchWishlist();
  }, [user]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!pickupLoc || !pickupDate || !returnDate) {
      showToast('Please fill in pickup details to look up vehicles!', 'error');
      return;
    }
    navigate('/cars', {
      state: {
        pickupLocation: pickupLoc,
        returnLocation: returnLoc || pickupLoc,
        pickupDate,
        returnDate,
      }
    });
  };

  const handleWishlistToggle = async (carId) => {
    try {
      if (wishlistIds.includes(carId)) {
        await api.delete(`/wishlist/car/${carId}`);
        setWishlistIds(wishlistIds.filter(id => id !== carId));
        showToast('Vehicle removed from wishlist');
      } else {
        await api.post('/wishlist', { carId });
        setWishlistIds([...wishlistIds, carId]);
        showToast('Vehicle added to your premium wishlist!');
      }
    } catch (err) {
      showToast('Action failed. Please register or login.', 'error');
    }
  };

  const faqItems = [
    {
      icon: <HelpCircle className="h-5 w-5" />,
      question: 'What are the key rental requirements?',
      answer: 'All drivers must be at least 21 years of age, hold a valid driver\'s license with zero major suspensions, and present a valid security payment method like a premium card.',
    },
    {
      icon: <HelpCircle className="h-5 w-5" />,
      question: 'How does the mock Stripe payment calculation work?',
      answer: 'When you make an instant mock credit card payment, your booking status transitions immediately to "Confirmed". Cash bookings remain "Pending" until our administrator approves them.',
    },
    {
      icon: <HelpCircle className="h-5 w-5" />,
      question: 'Can I cancel my confirmed rental?',
      answer: 'Yes! Customer profiles allow hassle-free self-cancellation on any Pending or Confirmed booking before the rental trip begins. Completed/Active bookings cannot be cancelled.',
    },
    {
      icon: <HelpCircle className="h-5 w-5" />,
      question: 'Is fuel included in the daily rate?',
      answer: 'Fuel is not included in the daily rental rate. Vehicles are delivered with a full tank and must be returned with a full tank. Additional fuel charges apply otherwise.',
    },
    {
      icon: <HelpCircle className="h-5 w-5" />,
      question: 'Are there any hidden charges?',
      answer: 'No hidden charges. The daily rate shown is the total rate. Extras such as additional drivers, GPS, or baby seats are clearly listed during booking checkout.',
    },
  ];

  const services = [
    {
      icon: <Key className="h-7 w-7 text-blue-600" />,
      accent: 'bg-blue-50',
      title: 'Self-Drive Rental',
      description: 'Take the wheel yourself. Choose from our wide fleet of economy to luxury vehicles for full independence.',
    },
    {
      icon: <Crown className="h-7 w-7 text-amber-500" />,
      accent: 'bg-amber-50',
      title: 'Chauffeur Service',
      description: 'Sit back and relax while our professional, uniformed drivers take you safely to your destination.',
    },
    {
      icon: <Plane className="h-7 w-7 text-emerald-600" />,
      accent: 'bg-emerald-50',
      title: 'Airport Transfers',
      description: 'Seamless airport pickup and drop-off. We track your flight and ensure punctual arrivals at all times.',
    },
    {
      icon: <Navigation className="h-7 w-7 text-purple-600" />,
      accent: 'bg-purple-50',
      title: 'Long-Term Leasing',
      description: 'Monthly leasing options with exclusive discounts. Ideal for corporates, expats, and extended stays.',
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* ── Premium Hero Section ──────────────────────────── */}
      <div className="relative bg-gradient-to-br from-gray-900 via-slate-950 to-gray-900 py-24 sm:py-32 overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=50')] bg-cover bg-center mix-blend-overlay opacity-30"></div>

        {/* Subtle radial glow */}
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <motion.div 
          initial="hidden" animate="visible" variants={staggerContainer}
          className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
        >

          {/* Hero Left Content */}
          <motion.div variants={fadeIn} className="lg:col-span-7 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm rounded-full text-blue-400 text-xs font-semibold tracking-wider uppercase">
              ✨ Premium Car Rentals Redefined
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Drive Your Journey,<br />
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Your Way.</span>
            </h1>
            <p className="text-gray-300 text-lg sm:text-xl max-w-xl leading-relaxed">
              Experience the epitome of comfort and performance. From advanced Tesla self-driving models to raw Porsche dynamics, unlock custom premium access instantly.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 text-xs text-gray-400">
              {['✅ Free Cancellation', '🔒 Secure Booking', '📍 Islandwide Pickup', '💬 24/7 Support'].map(b => (
                <span key={b} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm">{b}</span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/cars"
                className="inline-flex items-center gap-2 px-8 h-14 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                Browse Fleet
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#services-section"
                className="inline-flex items-center justify-center px-8 h-14 text-sm font-bold text-gray-300 hover:text-white border border-gray-700 hover:border-gray-500 rounded-2xl transition-all cursor-pointer"
              >
                Our Services
              </a>
            </div>
          </motion.div>

          {/* Hero Right: Booking Search Form Card */}
          <motion.div variants={fadeIn} className="lg:col-span-5 bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 relative">
            <div className="absolute -top-3 -right-3 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg shadow-blue-500/30 uppercase tracking-widest">
              Book Instantly
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Plan Your Premium Trip</h3>
            <form onSubmit={handleSearchSubmit} className="space-y-4 text-left">

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Pickup Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={pickupLoc}
                    onChange={(e) => setPickupLoc(e.target.value)}
                    className="w-full pl-10 pr-4 h-12 bg-gray-50 border border-gray-200 focus:border-blue-500 rounded-xl text-sm font-medium focus:outline-none transition-all cursor-pointer"
                    required
                  >
                    <option value="">Choose Pickup Location</option>
                    {locations.map(loc => (
                      <option key={loc._id} value={loc.name}>{loc.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Return Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={returnLoc}
                    onChange={(e) => setReturnLoc(e.target.value)}
                    className="w-full pl-10 pr-4 h-12 bg-gray-50 border border-gray-200 focus:border-blue-500 rounded-xl text-sm font-medium focus:outline-none transition-all cursor-pointer"
                  >
                    <option value="">Same as Pickup Location</option>
                    {locations.map(loc => (
                      <option key={loc._id} value={loc.name}>{loc.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Pickup Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      value={pickupDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full pl-9 pr-2 h-12 bg-gray-50 border border-gray-200 focus:border-blue-500 rounded-xl text-xs font-medium focus:outline-none transition-all cursor-pointer"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Return Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      value={returnDate}
                      min={pickupDate || new Date().toISOString().split('T')[0]}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full pl-9 pr-2 h-12 bg-gray-50 border border-gray-200 focus:border-blue-500 rounded-xl text-xs font-medium focus:outline-none transition-all cursor-pointer"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-100 mt-6 cursor-pointer hover:-translate-y-0.5"
              >
                <Search className="h-5 w-5" />
                Search Available Cars
              </button>
            </form>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Animated Stats Bar ────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100"
          >
            <StatItem value="200" label="Vehicles Available" />
            <StatItem value="5,000" label="Happy Customers" />
            <StatItem value="10" label="Pickup Locations" />
            <StatItem value="24/7" label="Customer Support" suffix="" />
          </motion.div>
        </div>
      </div>

      {/* ── Popular Fleet Section ─────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Our Premium Catalog</span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-4">Popular Luxury Vehicles</h2>
        <p className="text-gray-500 text-sm max-w-xl mx-auto mb-16">
          Handpicked luxury models tuned to deliver raw speed, comfort, and state of the art driver aids. Available immediately.
        </p>

        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left"
        >
          {popularCars.map(car => (
            <motion.div variants={fadeIn} key={car._id}>
              <CarCard
                car={car}
                isWishlisted={wishlistIds.includes(car._id)}
                onWishlistToggle={handleWishlistToggle}
              />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12">
          <Link
            to="/cars"
            className="inline-flex items-center gap-1.5 px-6 py-3 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all cursor-pointer"
          >
            Explore Entire Fleet
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* ── Services Section (GetGo-inspired) ────────────── */}
      <div id="services-section" className="bg-white border-y border-gray-100 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">What We Offer</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-4">Our Services</h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto mb-14">
            From a quick self-drive getaway to a full-service chauffeur experience — we have a solution for every journey.
          </p>
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left"
          >
            {services.map(s => <ServiceCard key={s.title} {...s} />)}
          </motion.div>
        </div>
      </div>

      {/* ── Why Choose Us Section ─────────────────────────── */}
      <div id="choose-us" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-sans">Why DriveEasy</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-16">Designed For Executive Renting</h2>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left"
          >
            <motion.div variants={fadeIn} className="space-y-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-14 h-14 flex items-center justify-center shadow-inner">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Elite Renting Insurance</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Sleep easy knowing your dynamic trips are fully protected under complete liability waivers and multi-point secure assistance.
              </p>
            </motion.div>

            <motion.div variants={fadeIn} className="space-y-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-14 h-14 flex items-center justify-center shadow-inner">
                <Award className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Highest Quality Cleanliness</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Each luxury model is treated with active deep cleaning and detailing checks before key handover. Excellent condition is guaranteed.
              </p>
            </motion.div>

            <motion.div variants={fadeIn} className="space-y-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-14 h-14 flex items-center justify-center shadow-inner">
                <Zap className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Seamless Keyless Pickups</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Instantly map code accesses to retrieve vehicles at premium terminal locations. No queues, no hassle.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── Testimonials ──────────────────────────────────── */}
      <div className="bg-white border-y border-gray-100 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Client Testimonials</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-16">What Our Customers Say</h2>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left"
          >
            {[
              {
                stars: 5,
                text: '"The Tesla Model S Plaid I rented was absolutely clean, fully charged, and ready. Keyless transition took exactly 2 minutes! Best executive platform I have ever used."',
                initials: 'JD', name: 'John Doe', role: 'Verified customer',
              },
              {
                stars: 5,
                text: '"Phenomenal M4 Competition Coupe experience. The booking form calculations were crystal clear and the admin dashboard handles approvals instantly. High level of respect!"',
                initials: 'SC', name: 'Sarah Connor', role: 'Corporate account manager',
              },
            ].map(t => (
              <motion.div variants={fadeIn} key={t.name} className="card-lift bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-sm relative space-y-6">
                <div className="flex gap-1">
                  {[...Array(t.stars)].map((_, i) => <Star key={i} className="h-5 w-5 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-gray-600 text-base leading-relaxed italic">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full text-white flex items-center justify-center font-bold text-sm">
                    {t.initials}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{t.name}</h4>
                    <p className="text-xs text-gray-400 font-medium">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── FAQ Accordion Section ─────────────────────────── */}
      <div className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Frequently Asked Questions</span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-2 mb-12">Got Questions? We Have Answers</h2>
          <div className="space-y-3 text-left">
            {faqItems.map(item => (
              <FaqItem key={item.question} {...item} />
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA Strip ─────────────────────────────────────── */}
      <div className="cta-strip py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-blue-200 text-xs font-semibold tracking-wider uppercase">
            🚗 Start Today
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
            Ready to Hit the Road?
          </h2>
          <p className="text-blue-200 text-base sm:text-lg max-w-2xl mx-auto">
            Browse our premium fleet, choose your dates, and get rolling in minutes. No hidden fees — just open roads.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              to="/cars"
              className="inline-flex items-center gap-2 px-10 h-14 text-sm font-bold text-blue-700 bg-white hover:bg-blue-50 rounded-2xl shadow-xl shadow-blue-900/30 transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              Browse All Cars
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={`https://wa.me/94773511935?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20a%20car%20rental.`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-10 h-14 text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/30 rounded-2xl transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              💬 WhatsApp Us
            </a>
          </div>
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

export default Home;
