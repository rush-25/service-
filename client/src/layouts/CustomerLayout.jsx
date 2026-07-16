import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, User, Calendar, CreditCard, Heart, Star, Bell, LogOut, Car, Menu, X
} from 'lucide-react';

const CustomerLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', path: '/dashboard/profile', icon: User },
    { name: 'My Bookings', path: '/dashboard/bookings', icon: Calendar },
    { name: 'Payments', path: '/dashboard/payments', icon: CreditCard },
    { name: 'Favorite Cars', path: '/dashboard/favorites', icon: Heart },
    { name: 'My Reviews', path: '/dashboard/reviews', icon: Star },
    { name: 'Notifications', path: '/dashboard/notifications', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row text-left">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden bg-white border-b border-gray-100 h-16 px-4 flex items-center justify-between sticky top-20 z-40">
        <span className="text-sm font-bold text-gray-900">Dashboard Panel</span>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-gray-500 rounded-xl hover:bg-gray-50"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar navigation */}
      <aside className={`w-64 bg-[#111827] text-gray-300 flex-shrink-0 flex flex-col fixed md:sticky top-0 md:top-20 h-[calc(100vh-5rem)] z-30 transition-transform duration-300 md:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>

        {/* User Card */}
        <div className="p-6 border-b border-gray-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white text-sm">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'CU'}
          </div>
          <div>
            <h5 className="font-bold text-white text-sm truncate max-w-[130px]">{user?.name}</h5>
            <span className="text-[10px] text-gray-400 font-semibold uppercase">{user?.role}</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === '/dashboard'}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-800/50 hover:text-white text-gray-400'
                }`}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-xs font-bold text-gray-400 hover:text-red-400 rounded-xl hover:bg-red-500/5 transition-all cursor-pointer"
          >
            <LogOut className="h-4.5 w-4.5" />
            Logout Account
          </button>
        </div>

      </aside>

      {/* Main Content Pane */}
      <main className="flex-grow p-6 sm:p-10 overflow-x-hidden min-h-[calc(100vh-5rem)]">
        <Outlet />
      </main>
    </div>
  );
};

export default CustomerLayout;
