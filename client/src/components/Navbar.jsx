import React, { useState } from 'react';
import { Link, useNavigate, useLocation as useRouteLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Car, User, LogOut } from 'lucide-react';

const WHATSAPP_NUMBER = '94773511935';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useRouteLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Cars', path: '/cars' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ];

  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi! I\'d like to enquire about a car rental.')}`;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">

          {/* ── Logo ── */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-2 bg-blue-600 rounded-xl text-white shadow-md shadow-blue-200">
                <Car className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-gray-900">
                Drive<span className="text-blue-600">Easy</span>
              </span>
            </Link>
          </div>

          {/* ── Desktop Navigation ── */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  isActive(link.path) ? 'text-blue-600 font-semibold' : 'text-gray-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* ── Auth CTA & Profile Actions ── */}
          <div className="hidden md:flex items-center gap-3">

            {/* WhatsApp Quick Inquiry — shown when not logged in */}
            {!user && (
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="wa-pulse inline-flex items-center gap-2 px-4 h-10 text-sm font-semibold text-white bg-[#25D366] hover:bg-[#1ebe5d] rounded-xl transition-all shadow-md shadow-green-100"
              >
                {/* WhatsApp icon */}
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Quick Inquiry
              </a>
            )}

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to={user.role === 'Administrator' ? '/admin' : '/dashboard'}
                  className="flex items-center gap-2 px-5 h-11 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all"
                >
                  <User className="h-4 w-4" />
                  {user.role === 'Administrator' ? 'Admin Panel' : 'Dashboard'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-4 h-11 text-sm font-medium text-gray-500 hover:text-red-600 rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 px-4 py-2 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center justify-center px-6 h-11 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-100"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* ── Mobile menu button ── */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 focus:outline-none transition-colors cursor-pointer"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {isOpen && (
        <div className="md:hidden border-b border-gray-100 bg-white/95 backdrop-blur-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-blue-600 bg-blue-50/50 font-semibold'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <hr className="my-2 border-gray-100" />

            {/* WhatsApp on mobile */}
            {!user && (
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-3 text-base font-semibold text-white bg-[#25D366] hover:bg-[#1ebe5d] rounded-xl transition-all"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Quick Inquiry
              </a>
            )}

            {user ? (
              <div className="space-y-1">
                <Link
                  to={user.role === 'Administrator' ? '/admin' : '/dashboard'}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-base font-medium text-blue-600 hover:bg-blue-50/50 rounded-xl"
                >
                  <User className="h-5 w-5" />
                  Dashboard ({user.name})
                </Link>
                <button
                  onClick={() => { setIsOpen(false); handleLogout(); }}
                  className="flex items-center gap-2 w-full text-left px-4 py-3 text-base font-medium text-gray-500 hover:text-red-600 hover:bg-red-50/50 rounded-xl cursor-pointer"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 p-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center h-12 text-base font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center h-12 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-100"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
