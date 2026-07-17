import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import { Star, ShieldAlert, Calendar, MapPin, Users, Settings, Disc, ShieldCheck, Check, DollarSign } from 'lucide-react';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [bookedDates, setBookedDates] = useState([]);
  const [recommendedCars, setRecommendedCars] = useState([]);

  // Form Booking parameters
  const [pickupLocation, setPickupLocation] = useState('');
  const [returnLocation, setReturnLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Stripe');
  const [locations, setLocations] = useState([]);

  // Mock Stripe Credit Card Inputs
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');

  // Reviews
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  // Price Live breakdown state
  const [calcDays, setCalcDays] = useState(0);
  const [calcTotal, setCalcTotal] = useState(0);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    const fetchCarAndDetails = async () => {
      setLoading(true);
      try {
        const carRes = await api.get(`/cars/${id}`);
        if (carRes.data.success) {
          setCar(carRes.data.data);
          setSelectedImage(carRes.data.data.images[0]);
        }

        const datesRes = await api.get(`/bookings/car/${id}/dates`);
        if (datesRes.data.success) {
          setBookedDates(datesRes.data.data);
        }

        const reviewsRes = await api.get(`/reviews/car/${id}`);
        if (reviewsRes.data.success) {
          setReviews(reviewsRes.data.data);
        }

        const locationsRes = await api.get('/locations');
        if (locationsRes.data.success) {
          setLocations(locationsRes.data.data);
          if (locationsRes.data.data.length > 0) {
            setPickupLocation(locationsRes.data.data[0].name);
            setReturnLocation(locationsRes.data.data[0].name);
          }
        }

        // Recommended Cars: Same Category
        const listRes = await api.get('/cars');
        if (listRes.data.success) {
          const filtered = listRes.data.data.filter(c => c._id !== id).slice(0, 3);
          setRecommendedCars(filtered);
        }

      } catch (err) {
        console.error('Error loading details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCarAndDetails();
  }, [id]);

  // Recalculate price dynamically when dates shift
  useEffect(() => {
    if (pickupDate && returnDate && car) {
      const pDate = new Date(pickupDate);
      const rDate = new Date(returnDate);
      const diffTime = Math.abs(rDate.getTime() - pDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      setCalcDays(diffDays);

      let totalPrice = 0;
      if (diffDays >= 30) {
        totalPrice = diffDays * (car.monthlyPrice || car.dailyPrice);
      } else if (diffDays >= 7) {
        totalPrice = diffDays * (car.weeklyPrice || car.dailyPrice);
      } else {
        totalPrice = diffDays * car.dailyPrice;
      }
      setCalcTotal(totalPrice);
    } else {
      setCalcDays(0);
      setCalcTotal(0);
    }
  }, [pickupDate, returnDate, car]);

  // Check if chosen dates intersect bookedDates
  const isRangeOverlapping = (start, end) => {
    const sDate = new Date(start);
    const eDate = new Date(end);

    for (const b of bookedDates) {
      const bStart = new Date(b.pickupDate);
      const bEnd = new Date(b.returnDate);
      if (sDate <= bEnd && eDate >= bStart) {
        return true;
      }
    }
    return false;
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('Please login or register to book a car.', 'error');
      navigate('/login');
      return;
    }

    if (user.role === 'Administrator') {
      showToast('Administrators are not permitted to place rental bookings!', 'error');
      return;
    }

    if (isRangeOverlapping(pickupDate, returnDate)) {
      showToast('Overlapping booking! These dates are already booked for this vehicle.', 'error');
      return;
    }

    // Stripe input validations if Stripe selected
    if (paymentMethod === 'Stripe') {
      if (!cardNumber || !cardExpiry || !cardCVC) {
        showToast('Please provide your mock Stripe details to process premium checkout.', 'error');
        return;
      }
    }

    try {
      const data = {
        carId: car._id,
        pickupLocation,
        returnLocation,
        pickupDate,
        returnDate,
        paymentMethod,
      };

      const res = await api.post('/bookings', data);
      if (res.data.success) {
        showToast('Booking Placed successfully!');

        // If Stripe payment method, also create Payment record
        if (paymentMethod === 'Stripe') {
          await api.post('/payments', {
            bookingId: res.data.data._id,
            paymentMethod: 'Stripe',
            amount: calcTotal,
          });
        }

        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to place booking.', 'error');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('Please login to post a review', 'error');
      return;
    }

    try {
      const res = await api.post('/reviews', {
        carId: car._id,
        rating: newRating,
        comment: newComment,
      });

      if (res.data.success) {
        showToast('Thank you for your valuable feedback!');
        setNewComment('');
        // Reload reviews
        const revs = await api.get(`/reviews/car/${car._id}`);
        setReviews(revs.data.data);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to write review.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center animate-pulse space-y-8">
        <div className="h-96 bg-gray-200 rounded-3xl"></div>
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <ShieldAlert className="h-12 w-12 text-blue-500 mx-auto" />
        <h2 className="text-2xl font-bold">Car Not Found</h2>
        <Link to="/cars" className="text-blue-600 font-semibold hover:underline">Return to Premium Fleet</Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Gallery / Detail Header Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left Column: Premium Images & Specs */}
          <div className="lg:col-span-7 space-y-8">

            {/* Primary Large Image */}
            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm aspect-video">
              <img
                src={selectedImage}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnails */}
            {car.images && car.images.length > 1 && (
              <div className="flex gap-4">
                {car.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-24 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImage === img ? 'border-blue-600 scale-105' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="car thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Specifications Cards */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Technical Specifications</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-gray-400 uppercase">Seats</span>
                  <p className="font-bold text-gray-900 flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-blue-600" />
                    {car.seats} Passengers
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-gray-400 uppercase">Transmission</span>
                  <p className="font-bold text-gray-900 flex items-center gap-1.5">
                    <Settings className="h-4 w-4 text-blue-600" />
                    {car.transmission}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-gray-400 uppercase">Fuel Type</span>
                  <p className="font-bold text-gray-900 flex items-center gap-1.5">
                    <Disc className="h-4 w-4 text-blue-600" />
                    {car.fuelType}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-gray-400 uppercase">Rating</span>
                  <p className="font-bold text-gray-900 flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    {car.rating.toFixed(1)} / 5.0
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Vehicle Description</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{car.description}</p>
            </div>

          </div>

          {/* Right Column: Interactive Booking Form */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl sticky top-28">

              <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
                <div>
                  <h3 className="text-2xl font-black text-gray-900">{car.brand} {car.model}</h3>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Premium {car.category} Listing</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-blue-600">${car.dailyPrice}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Per Day Rate</p>
                </div>
              </div>

              {/* Show Busy Schedule Calendar Preview */}
              {bookedDates.length > 0 && (
                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 mb-6 text-xs text-blue-800">
                  <p className="font-bold mb-1">📅 Reserved Schedule Dates:</p>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {bookedDates.map((b, idx) => (
                      <li key={idx}>
                        {new Date(b.pickupDate).toLocaleDateString()} to {new Date(b.returnDate).toLocaleDateString()}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Booking Fields */}
              <form onSubmit={handleBookingSubmit} className="space-y-4">

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Pickup Location</label>
                  <select
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full h-11 bg-gray-50 border border-gray-200 focus:border-blue-500 rounded-xl text-xs font-medium focus:outline-none transition-all cursor-pointer"
                    required
                  >
                    {locations.map(l => (
                      <option key={l._id} value={l.name}>{l.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Return Location</label>
                  <select
                    value={returnLocation}
                    onChange={(e) => setReturnLocation(e.target.value)}
                    className="w-full h-11 bg-gray-50 border border-gray-200 focus:border-blue-500 rounded-xl text-xs font-medium focus:outline-none transition-all cursor-pointer"
                    required
                  >
                    {locations.map(l => (
                      <option key={l._id} value={l.name}>{l.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Pickup Date</label>
                    <input
                      type="date"
                      value={pickupDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full h-11 bg-gray-50 border border-gray-200 focus:border-blue-500 rounded-xl text-xs font-medium focus:outline-none transition-all cursor-pointer"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Return Date</label>
                    <input
                      type="date"
                      value={returnDate}
                      min={pickupDate || new Date().toISOString().split('T')[0]}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full h-11 bg-gray-50 border border-gray-200 focus:border-blue-500 rounded-xl text-xs font-medium focus:outline-none transition-all cursor-pointer"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Choose Payment Method</label>
                  <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Stripe')}
                      className={`h-11 border rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        paymentMethod === 'Stripe' ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      Stripe Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Cash')}
                      className={`h-11 border rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        paymentMethod === 'Cash' ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      Cash Payment
                    </button>
                  </div>
                </div>

                {/* Live Cost Calculation breakdown */}
                {calcDays > 0 && (
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-2 text-xs">
                    <div className="flex justify-between font-bold">
                      <span>Daily Base Price:</span>
                      <span>${car.dailyPrice} x {calcDays} days</span>
                    </div>
                    {calcDays >= 30 ? (
                      <p className="text-green-600 font-semibold">🔥 Applied premium monthly discount!</p>
                    ) : calcDays >= 7 ? (
                      <p className="text-green-600 font-semibold">🔥 Applied weekly package discount!</p>
                    ) : null}
                    <hr className="border-gray-200" />
                    <div className="flex justify-between text-base font-black text-gray-900">
                      <span>Estimated Total:</span>
                      <span>${calcTotal.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                {/* Stripe Fields */}
                {paymentMethod === 'Stripe' && calcDays > 0 && (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-3">
                    <p className="text-xs font-bold text-gray-400 uppercase">💳 Mock Stripe Payment Card</p>
                    <input
                      type="text"
                      placeholder="16-Digit Card Number"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                      className="w-full px-3 h-10 bg-white border border-gray-200 focus:border-blue-500 rounded-lg text-xs"
                      required
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value.slice(0, 5))}
                        className="px-3 h-10 bg-white border border-gray-200 focus:border-blue-500 rounded-lg text-xs"
                        required
                      />
                      <input
                        type="password"
                        placeholder="CVC"
                        value={cardCVC}
                        onChange={(e) => setCardCVC(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        className="px-3 h-10 bg-white border border-gray-200 focus:border-blue-500 rounded-lg text-xs"
                        required
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="h-5 w-5" />
                  Place Rental Booking
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* Customer Reviews Section */}
        <div className="max-w-4xl py-16 border-t border-gray-100 mt-16 space-y-12">

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Customer Reviews ({reviews.length})</h3>
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No reviews yet for this premium vehicle. Be the first to share your rental experience!</p>
              ) : (
                reviews.map(rev => (
                  <div key={rev._id} className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-3">
                    <div className="flex justify-between items-center">
                      <h5 className="font-bold text-gray-900 text-sm">{rev.user?.name || 'DriveEasy User'}</h5>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{rev.comment}</p>
                    <span className="text-[10px] text-gray-400 block font-semibold uppercase">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Review Posting Form */}
          {user && user.role !== 'Administrator' && (
            <form onSubmit={handleReviewSubmit} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h4 className="text-base font-bold text-gray-900">Post Your Review</h4>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase">Rating:</span>
                <select
                  value={newRating}
                  onChange={(e) => setNewRating(parseInt(e.target.value))}
                  className="h-9 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold cursor-pointer"
                >
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Very Good</option>
                  <option value="3">3 - Good</option>
                  <option value="2">2 - Fair</option>
                  <option value="1">1 - Poor</option>
                </select>
              </div>
              <textarea
                placeholder="Share your driving and booking transition feedback with the DriveEasy community..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-4 h-24 bg-gray-50 border border-gray-200 focus:border-blue-500 rounded-xl text-xs resize-none"
                required
              />
              <button
                type="submit"
                className="px-6 h-10 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
              >
                Submit Feedback
              </button>
            </form>
          )}

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

export default CarDetails;
