import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { Car, Users, Calendar, DollarSign, Activity } from 'lucide-react';

const AdminOverview = () => {
  const [cards, setCards] = useState({
    totalCars: 0,
    totalCustomers: 0,
    totalBookings: 0,
    revenue: 0,
    activeRentals: 0,
  });

  const [charts, setCharts] = useState({
    revenueOverview: [],
    monthlyBookings: [],
    popularCars: [],
    bookingStatus: [],
  });

  const [loading, setLoading] = useState(true);

  // Custom colors for Pie Charts
  const COLORS = ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#F59E0B', '#EF4444'];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        if (res.data.success) {
          setCards(res.data.data.cards);
          setCharts(res.data.data.charts);
        }
      } catch (err) {
        console.error('Error fetching admin overview metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="animate-pulse space-y-6 text-gray-500">
      <div className="grid grid-cols-5 gap-4 h-24 bg-gray-900 rounded-2xl"></div>
      <div className="h-64 bg-gray-900 rounded-2xl"></div>
    </div>;
  }

  return (
    <div className="space-y-10 text-left">

      {/* Title */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-white">System Admin Overview</h1>
        <p className="text-xs text-gray-400 mt-1">Review live financial metrics, popular models, and rental schedules.</p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">

        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Fleet</span>
            <p className="text-2xl font-black text-white">{cards.totalCars}</p>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
            <Car className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customer Base</span>
            <p className="text-2xl font-black text-white">{cards.totalCustomers}</p>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Bookings Count</span>
            <p className="text-2xl font-black text-white">{cards.totalBookings}</p>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
            <Calendar className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Revenue</span>
            <p className="text-2xl font-black text-blue-400">LKR {cards.revenue.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
            <span className="font-bold text-lg">LKR</span>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Trips</span>
            <p className="text-2xl font-black text-white">{cards.activeRentals}</p>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
            <Activity className="h-5 w-5" />
          </div>
        </div>

      </div>

      {/* Visual Charts Grid Layout (using Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Revenue Overview Line Chart */}
        <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Revenue Overview (LKR)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.revenueOverview}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155' }} />
                <Line type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Bookings Bar Chart */}
        <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Monthly Bookings Activity</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.monthlyBookings}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155' }} />
                <Bar dataKey="bookings" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Cars Pie Chart */}
        <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Popular Luxury Cars</h3>
          <div className="h-64 flex items-center justify-center">
            {charts.popularCars.length === 0 ? (
              <p className="text-xs text-gray-500 italic">No rental activity records logged yet</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.popularCars}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {charts.popularCars.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155' }} />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Booking Status distribution Pie */}
        <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Booking Status Distribution</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.bookingStatus}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {charts.bookingStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155' }} />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminOverview;
