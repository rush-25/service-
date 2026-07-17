import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, CreditCard, CheckCircle, Shield, AlertCircle, RefreshCcw } from 'lucide-react';

const CustomerOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeRentals: 0,
    upcomingBookings: 0,
    completedTrips: 0,
    totalSpent: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/bookings');
        if (res.data.success) {
          const bookings = res.data.data;

          // Calculate quick metrics
          const active = bookings.filter(b => b.status === 'Active').length;
          const upcoming = bookings.filter(b => b.status === 'Pending' || b.status === 'Confirmed').length;
          const completed = bookings.filter(b => b.status === 'Completed').length;

          const spent = bookings
            .filter(b => b.paymentStatus === 'Paid' && b.status !== 'Cancelled')
            .reduce((sum, b) => sum + b.totalPrice, 0);

          setStats({
            activeRentals: active,
            upcomingBookings: upcoming,
            completedTrips: completed,
            totalSpent: spent,
          });

          // Limit table to 5 recent
          setRecentBookings(bookings.slice(0, 5));
        }

        // Load recommended/popular cars for user
        const carsRes = await api.get('/cars');
        if (carsRes.data.success) {
          setRecommended(carsRes.data.data.slice(0, 2));
        }

      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="animate-pulse space-y-6">
      <div className="grid grid-cols-4 gap-4 h-24 bg-gray-200 rounded-2xl"></div>
      <div className="h-48 bg-gray-200 rounded-2xl"></div>
    </div>;
  }

  return (
    <div className="space-y-10">

      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Welcome, {user?.name}!</h1>
        <p className="text-xs text-gray-400 mt-1">Explore your premium rentals, payments, and active booking schedules.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Rentals</span>
            <p className="text-2xl font-black text-gray-950">{stats.activeRentals}</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <RefreshCcw className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Upcoming Bookings</span>
            <p className="text-2xl font-black text-gray-950">{stats.upcomingBookings}</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Calendar className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Completed Trips</span>
            <p className="text-2xl font-black text-gray-950">{stats.completedTrips}</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <CheckCircle className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Spent</span>
            <p className="text-2xl font-black text-blue-600">${stats.totalSpent.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <CreditCard className="h-5 w-5" />
          </div>
        </div>

      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Recent Bookings</h3>
          <Link to="/dashboard/bookings" className="text-xs font-bold text-blue-600 hover:underline">View All</Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-400">
            You have not placed any rental bookings yet. Look up our luxury fleet to get started!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-semibold text-left">
              <thead className="bg-gray-50 text-gray-400 uppercase tracking-wider text-[10px] border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Vehicle</th>
                  <th className="px-6 py-4">Duration Dates</th>
                  <th className="px-6 py-4">Total Cost</th>
                  <th className="px-6 py-4">Trip Status</th>
                  <th className="px-6 py-4">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{b.car?.brand} {b.car?.model}</p>
                      <span className="text-[10px] text-gray-400">{b.car?.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-700">{new Date(b.pickupDate).toLocaleDateString()} to {new Date(b.returnDate).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-bold">${b.totalPrice.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        b.status === 'Completed' ? 'bg-green-50 text-green-700' :
                        b.status === 'Cancelled' ? 'bg-red-50 text-red-700' :
                        b.status === 'Active' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        b.paymentStatus === 'Paid' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {b.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recommended Cars section */}
      <div className="space-y-6">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Recommended Vehicles</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {recommended.map(car => (
            <div key={car._id} className="bg-white border border-gray-100 rounded-2xl p-5 flex gap-4 shadow-sm items-center">
              <img src={car.images[0]} className="w-24 h-16 object-cover rounded-lg bg-gray-50 shrink-0" />
              <div className="flex-grow">
                <h5 className="font-bold text-gray-900 text-xs">{car.brand} {car.model}</h5>
                <p className="text-[10px] text-gray-400">{car.category} • ${car.dailyPrice}/Day</p>
                <Link to={`/cars/${car._id}`} className="text-[10px] font-bold text-blue-600 hover:underline mt-2 block">
                  Details & Book →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default CustomerOverview;
