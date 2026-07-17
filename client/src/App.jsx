import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public Pages
import Home from './pages/Home';
import Cars from './pages/Cars';
import CarDetails from './pages/CarDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import Services from './pages/Services';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Customer Protected Area
import CustomerLayout from './layouts/CustomerLayout';
import CustomerOverview from './pages/CustomerOverview';
import CustomerProfile from './pages/CustomerProfile';
import CustomerBookings from './pages/CustomerBookings';
import CustomerPayments from './pages/CustomerPayments';
import CustomerFavorites from './pages/CustomerFavorites';
import CustomerReviews from './pages/CustomerReviews';
import CustomerNotifications from './pages/CustomerNotifications';

// Admin Protected Area
import AdminLayout from './layouts/AdminLayout';
import AdminOverview from './pages/AdminOverview';
import AdminVehicles from './pages/AdminVehicles';
import AdminBookings from './pages/AdminBookings';
import AdminCustomers from './pages/AdminCustomers';
import AdminPayments from './pages/AdminPayments';
import AdminReports from './pages/AdminReports';

import { useAuth } from './context/AuthContext';

// Auth Guard Helpers
const CustomerRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-12 text-center text-xs animate-pulse">Verifying Access...</div>;
  if (!user || user.role !== 'Customer') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-12 text-center text-xs animate-pulse">Verifying Access...</div>;
  if (!user || user.role !== 'Administrator') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      {/* Dynamic Header */}
      <Navbar />

      {/* Pages Container */}
      <div className="flex-grow">
        <Routes>
          {/* Public Routing */}
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/cars/:id" element={<CarDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Services />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Customer Routing Dashboard */}
          <Route path="/dashboard" element={<CustomerRoute><CustomerLayout /></CustomerRoute>}>
            <Route index element={<CustomerOverview />} />
            <Route path="profile" element={<CustomerProfile />} />
            <Route path="bookings" element={<CustomerBookings />} />
            <Route path="payments" element={<CustomerPayments />} />
            <Route path="favorites" element={<CustomerFavorites />} />
            <Route path="reviews" element={<CustomerReviews />} />
            <Route path="notifications" element={<CustomerNotifications />} />
          </Route>

          {/* Admin Routing Panel */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminOverview />} />
            <Route path="vehicles" element={<AdminVehicles />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="reports" element={<AdminReports />} />
          </Route>

          {/* 404 Routing */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {/* Dynamic Footer widget */}
      <Footer />

    </div>
  );
}

export default App;
