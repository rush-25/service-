import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Toast from '../components/Toast';
import { Search, Calendar, MapPin, ShieldAlert, Check, X, ShieldX, Play, Trash2 } from 'lucide-react';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusStatusFilter] = useState('');
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id, status, paymentStatus = null) => {
    try {
      const data = { status };
      if (paymentStatus) {
        data.paymentStatus = paymentStatus;
      }

      const res = await api.put(`/bookings/${id}`, data);
      if (res.data.success) {
        showToast(`Booking is now ${status}`);
        fetchBookings();
      }
    } catch (err) {
      showToast('Failed to transition booking status.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete booking record?')) return;
    try {
      const res = await api.delete(`/bookings/${id}`);
      if (res.data.success) {
        showToast('Booking deleted');
        setBookings(bookings.filter(b => b._id !== id));
      }
    } catch (err) {
      showToast('Action failed', 'error');
    }
  };

  // Client-side search and filtering
  const filteredBookings = bookings.filter((b) => {
    const term = search.toLowerCase();
    const customerName = b.user?.name?.toLowerCase() || '';
    const carModel = `${b.car?.brand} ${b.car?.model}`.toLowerCase() || '';
    const statusMatch = statusFilter ? b.status === statusFilter : true;

    return (customerName.includes(term) || carModel.includes(term)) && statusMatch;
  });

  if (loading) {
    return <div className="animate-pulse h-40 bg-gray-900 rounded-3xl"></div>;
  }

  return (
    <div className="space-y-8 text-left">

      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Rental Bookings</h1>
        <p className="text-xs text-gray-400 mt-1">Search, review, approve, reject, cancel, or complete customer rentals.</p>
      </div>

      {/* Search / Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-slate-900/30 border border-slate-800 p-4 rounded-2xl">
        <div className="flex-grow relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer name or car model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 h-11 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusStatusFilter(e.target.value)}
          className="h-11 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white px-4 focus:outline-none cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Bookings Table list */}
      <div className="bg-slate-900/30 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        {filteredBookings.length === 0 ? (
          <div className="p-16 text-center text-xs text-gray-400">
            No logged rental bookings match your current criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-semibold text-left">
              <thead className="bg-slate-900 text-gray-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Customer Details</th>
                  <th className="px-6 py-4">Luxury Vehicle</th>
                  <th className="px-6 py-4">Duration Dates</th>
                  <th className="px-6 py-4">Price Charged</th>
                  <th className="px-6 py-4">Trip Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {filteredBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-900/50">
                    <td className="px-6 py-4">
                      <p className="font-bold text-white">{b.user?.name || 'DriveEasy User'}</p>
                      <p className="text-[10px] text-gray-400 font-normal">{b.user?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-white">{b.car?.brand} {b.car?.model}</p>
                      <p className="text-[10px] text-gray-400">{b.car?.category}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-300">{new Date(b.pickupDate).toLocaleDateString()} to {new Date(b.returnDate).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4 text-blue-400 font-bold">LKR {b.totalPrice.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        b.status === 'Completed' ? 'bg-green-500/10 text-green-400' :
                        b.status === 'Cancelled' ? 'bg-red-500/10 text-red-400' :
                        b.status === 'Active' ? 'bg-blue-500/10 text-blue-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">

                      {b.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(b._id, 'Confirmed', 'Paid')}
                            className="p-1.5 bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white rounded-lg transition-all cursor-pointer"
                            title="Approve Booking"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(b._id, 'Cancelled')}
                            className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all cursor-pointer"
                            title="Reject/Cancel"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}

                      {b.status === 'Confirmed' && (
                        <button
                          onClick={() => handleUpdateStatus(b._id, 'Active')}
                          className="px-2.5 h-8 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-[10px] flex items-center gap-1 transition-all cursor-pointer"
                          title="Start Active Trip"
                        >
                          <Play className="h-3 w-3" /> Start Trip
                        </button>
                      )}

                      {b.status === 'Active' && (
                        <button
                          onClick={() => handleUpdateStatus(b._id, 'Completed')}
                          className="px-2.5 h-8 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-[10px] flex items-center gap-1 transition-all cursor-pointer"
                          title="Complete Booking"
                        >
                          <Check className="h-3 w-3" /> Complete
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(b._id)}
                        className="p-1.5 bg-slate-800 text-slate-400 hover:bg-red-500 hover:text-white rounded-lg transition-all cursor-pointer"
                        title="Delete Record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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

export default AdminBookings;
