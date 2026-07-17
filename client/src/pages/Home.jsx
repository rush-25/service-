import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import CarCard from '../components/CarCard';
import Toast from '../components/Toast';
import { Search, Calendar, MapPin, ShieldCheck, Award, Zap, HelpCircle, Star, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
    // Fetch top 3 highest rated/popular cars
    const fetchPopularCars = async () => {
      try {
        const res = await api.get('/cars');
        if (res.data.success) {
          // Sort by rating & limit to 3
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

    // Redirect to cars catalog with state parameters
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
        // Remove
        await api.delete(`/wishlist/car/${carId}`);
        setWishlistIds(wishlistIds.filter(id => id !== carId));
        showToast('Vehicle removed from wishlist');
      } else {
        // Add
        await api.post('/wishlist', { carId });
        setWishlistIds([...wishlistIds, carId]);
        showToast('Vehicle added to your premium wishlist!');
      }
    } catch (err) {
      showToast('Action failed. Please register or login.', 'error');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Premium Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-slate-950 to-gray-900 py-24 sm:py-32 overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=50')] bg-cover bg-center mix-blend-overlay opacity-30"></div>
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm rounded-full text-blue-400 text-xs font-semibold tracking-wider uppercase">
              ✨ Premium Car rentals Redefined
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Drive Your Journey,<br />
              <span className="text-blue-500 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Your Way.</span>
            </h1>
            <p className="text-gray-300 text-lg sm:text-xl max-w-xl leading-relaxed">
              Experience the epitome of comfort and performance. From advanced Tesla self-driving models to raw Porsche dynamics, unlock custom premium access instantly.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/cars"
                className="inline-flex items-center gap-2 px-8 h-14 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
              >
                Browse Fleet
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#choose-us"
                className="inline-flex items-center justify-center px-8 h-14 text-sm font-bold text-gray-300 hover:text-white border border-gray-700 hover:border-gray-500 rounded-2xl transition-all"
              >
                Why Choose Us
              </a>
            </div>
          </div>

          {/* Hero Right: Booking Search Form Card */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 relative">
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
                className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-100 mt-6 cursor-pointer"
              >
                <Search className="h-5 w-5" />
                Search Available Cars
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Popular Fleet Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Our Premium Catalog</span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-4">Popular Luxury Vehicles</h2>
        <p className="text-gray-500 text-sm max-w-xl mx-auto mb-16">
          Handpicked luxury models tuned to deliver raw speed, comfort, and state of the art driver aids. Available immediately.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {popularCars.map(car => (
            <CarCard
              key={car._id}
              car={car}
              isWishlisted={wishlistIds.includes(car._id)}
              onWishlistToggle={handleWishlistToggle}
            />
          ))}
        </div>

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

      {/* Why Choose Us Section */}
      <div id="choose-us" className="bg-white border-y border-gray-100 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-sans">Why DriveEasy</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-16">Designed For Executive Renting</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-14 h-14 flex items-center justify-center shadow-inner">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Elite Renting Insurance</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Sleep easy knowing your dynamic trips are fully protected under complete liability waivers and multi-point secure assistance.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-14 h-14 flex items-center justify-center shadow-inner">
                <Award className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Highest Quality Cleanliness</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Each luxury model is treated with active deep cleaning and detailing checks before key handover. Excellent condition is guaranteed.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-14 h-14 flex items-center justify-center shadow-inner">
                <Zap className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Seamless Keyless Pickups</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Instantly map code accesses to retrieve vehicles at premium terminal locations like Beverly Hills and LAX Showrooms. No queues.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Client Testimonials</span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-16">What Our Customers Say</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative space-y-6">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 text-amber-400 fill-amber-400" />)}
            </div>
            <p className="text-gray-600 text-base leading-relaxed italic">
              "The Tesla Model S Plaid I rented at LAX was absolutely clean, fully charged, and ready. Keyless transition took exactly 2 minutes! Best executive platform I have ever used."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full text-white flex items-center justify-center font-bold text-sm">
                JD
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">John Doe</h4>
                <p className="text-xs text-gray-400 font-medium">Verified customer</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative space-y-6">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 text-amber-400 fill-amber-400" />)}
            </div>
            <p className="text-gray-600 text-base leading-relaxed italic">
              "Phenomenal M4 Competition Coupe coupe experience. The booking form calculations were crystal clear and the admin dashboard handles approvals instantly. High level of respect!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full text-white flex items-center justify-center font-bold text-sm">
                SC
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Sarah Connor</h4>
                <p className="text-xs text-gray-400 font-medium">Corporate account manager</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white border-t border-gray-100 py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Frequently Asked Questions</span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-2 mb-16">Got Questions? We Have Answers</h2>

          <div className="space-y-6 text-left">
            <div className="p-6 bg-gray-50 rounded-2xl">
              <h4 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-2">
                <HelpCircle className="h-5 w-5 text-blue-600 shrink-0" />
                What are the key rental requirements?
              </h4>
              <p className="text-sm text-gray-500 pl-7 leading-relaxed">
                All drivers must be at least 21 years of age, hold a valid driver's license with zero major suspensions, and present a valid security payment method like a premium card.
              </p>
            </div>

            <div className="p-6 bg-gray-50 rounded-2xl">
              <h4 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-2">
                <HelpCircle className="h-5 w-5 text-blue-600 shrink-0" />
                How does the mock Stripe payment calculation work?
              </h4>
              <p className="text-sm text-gray-500 pl-7 leading-relaxed">
                When you make an instant mock credit card payment, your booking status transitions immediately to "Confirmed". Cash bookings remain "Pending" until our administrator approves them.
              </p>
            </div>

            <div className="p-6 bg-gray-50 rounded-2xl">
              <h4 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-2">
                <HelpCircle className="h-5 w-5 text-blue-600 shrink-0" />
                Can I cancel my confirmed rental?
              </h4>
              <p className="text-sm text-gray-500 pl-7 leading-relaxed">
                Yes! Customer profiles allow hassle-free self-cancellation on any Pending or Confirmed booking before the rental trip begins. Completed/Active bookings cannot be cancelled.
              </p>
            </div>
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
