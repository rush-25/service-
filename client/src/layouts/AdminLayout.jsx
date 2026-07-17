import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BarChart3, Car, Calendar, Users, CreditCard, PieChart, LogOut, ArrowLeft, Menu, X
} from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { name: 'Overview', path: '/admin', icon: BarChart3 },
    { name: 'Vehicles CRUD', path: '/admin/vehicles', icon: Car },
    { name: 'Bookings List', path: '/admin/bookings', icon: Calendar },
    { name: 'Customer Base', path: '/admin/customers', icon: Users },
    { name: 'Payments Board', path: '/admin/payments', icon: CreditCard },
    { name: 'Reports Center', path: '/admin/reports', icon: PieChart },
  ];

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col md:flex-row text-left text-gray-100">

      {/* Mobile Header Block */}
      <div className="md:hidden bg-gray-900 border-b border-gray-800 h-16 px-4 flex items-center justify-between sticky top-20 z-40">
        <span className="text-sm font-black text-white tracking-wide uppercase">Admin Console</span>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-gray-400 rounded-xl hover:bg-gray-800 focus:outline-none"
        >
          {sidebarOpen ? <X className="h-5 w-5 text-white" /> : <Menu className="h-5 w-5 text-white" />}
        </button>
      </div>

      {/* Admin Sidebar Navigation Panel - Dark Theme */}
      <aside className={`w-64 bg-[#111827] text-gray-300 flex-shrink-0 flex flex-col fixed md:sticky top-0 md:top-20 h-[calc(100vh-5rem)] z-30 transition-transform duration-300 md:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>

        {/* User Card */}
        <div className="p-6 border-b border-gray-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white text-sm shrink-0">
            AD
          </div>
          <div>
            <h5 className="font-bold text-white text-sm truncate max-w-[130px]">{user?.name || 'Administrator'}</h5>
            <span className="text-[10px] text-blue-400 font-extrabold tracking-wider uppercase">System Admin</span>
          </div>
        </div>

        {/* Menu Items list */}
        <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === '/admin'}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10'
                    : 'hover:bg-gray-800/60 hover:text-white text-gray-400'
                }`}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="p-4 border-t border-gray-800 space-y-2">
          <NavLink
            to="/"
            className="flex items-center gap-3 w-full px-4 py-3 text-xs font-bold text-gray-400 hover:text-white hover:bg-gray-800/40 rounded-xl transition-all"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
            Back to Website
          </NavLink>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-xs font-bold text-gray-400 hover:text-red-400 rounded-xl hover:bg-red-500/5 transition-all cursor-pointer"
          >
            <LogOut className="h-4.5 w-4.5" />
            Logout Session
          </button>
        </div>

      </aside>

      {/* Main Content Workspace */}
      <main className="flex-grow p-6 sm:p-10 overflow-x-hidden min-h-[calc(100vh-5rem)] bg-slate-950">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;
