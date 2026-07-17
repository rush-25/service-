import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Toast from '../components/Toast';
import { Calendar, MapPin, XCircle, Clock, CheckCircle2, ShieldAlert } from 'lucide-react';

const CustomerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings');
      if (res.data.success) {
        setBookings(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you absolutely certain you want to cancel this booking?')) return;

    try {
      const res = await api.put(`/bookings/${id}`, { status: 'Cancelled' });
      if (res.data.success) {
        showToast('Your booking was successfully cancelled.');
        fetchBookings();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to cancel booking.', 'error');
    }
  };

  if (loading) {
    return <div className="animate-pulse space-y-6">
      <div className="h-40 bg-gray-200 rounded-3xl"></div>
      <div className="h-40 bg-gray-200 rounded-3xl"></div>
    </div>;
  }

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">My Bookings</h1>
        <p className="text-xs text-gray-400 mt-1">Manage and track your schedule of pending, confirmed, or active rentals.</p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-16 text-center space-y-4">
          <ShieldAlert className="h-12 w-12 text-blue-500 mx-auto" />
          <h3 className="text-lg font-bold text-gray-900">No Rental Bookings Found</h3>
          <p className="text-sm text-gray-400 max-w-sm mx-auto">You have not booked any vehicles yet. Let's make your first premium trip!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((b) => (
            <div key={b._id} className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">

              {/* Car Info Left */}
              <div className="flex gap-4 items-center">
                <img
                  src={b.car?.images[0]}
                  className="w-28 h-20 object-cover rounded-2xl bg-gray-50 shrink-0"
                />
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{b.car?.brand}</span>
                  <h3 className="text-lg font-bold text-gray-950">{b.car?.model}</h3>
                  <p className="text-xs text-blue-600 font-extrabold">LKR {b.totalPrice.toFixed(2)}</p>
                </div>
              </div>

              {/* Trip Dates Center */}
              <div className="space-y-3 text-xs text-gray-500 font-semibold">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>{new Date(b.pickupDate).toLocaleDateString()} to {new Date(b.returnDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>Pickup: {b.pickupLocation}</span>
                </div>
              </div>

              {/* Status and Action Buttons Right */}
              <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto items-stretch md:items-end">
                <div className="flex items-center gap-2 justify-end">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                    b.status === 'Completed' ? 'bg-green-50 text-green-700' :
                    b.status === 'Cancelled' ? 'bg-red-50 text-red-700' :
                    b.status === 'Active' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {b.status}
                  </span>
                  <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    b.paymentStatus === 'Paid' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {b.paymentStatus}
                  </span>
                </div>

                {/* Cancel Booking option for Pending/Confirmed */}
                {(b.status === 'Pending' || b.status === 'Confirmed') && (
                  <button
                    onClick={() => handleCancelBooking(b._id)}
                    className="h-10 px-4 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <XCircle className="h-4 w-4" />
                    Cancel Rental
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

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

export default CustomerBookings;
