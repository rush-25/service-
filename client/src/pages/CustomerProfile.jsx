import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import { User, Phone, Mail, KeyRound, ShieldCheck } from 'lucide-react';

const CustomerProfile = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name || !phone) {
      showToast('Name and Phone fields are required.', 'error');
      return;
    }

    if (password && password !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    setLoading(true);
    try {
      const data = { name, phone };
      if (password) data.password = password;

      const res = await updateProfile(data);
      if (res.success) {
        showToast('Profile updated successfully!');
        setPassword('');
        setConfirmPassword('');
      } else {
        showToast(res.message, 'error');
      }
    } catch (err) {
      showToast('Failed to update details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl space-y-8">

      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">My Profile</h1>
        <p className="text-xs text-gray-400 mt-1">Configure your personal and security account settings</p>
      </div>

      <form onSubmit={handleUpdate} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full pl-10 pr-4 h-11 bg-gray-50 border border-gray-200 focus:border-blue-500 rounded-xl text-xs font-semibold focus:outline-none transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
                className="w-full pl-10 pr-4 h-11 bg-gray-50 border border-gray-200 focus:border-blue-500 rounded-xl text-xs font-semibold focus:outline-none transition-all"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Email Address (Locked)</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              value={user?.email || ''}
              className="w-full pl-10 pr-4 h-11 bg-gray-100 border border-gray-200 rounded-xl text-xs font-semibold text-gray-400 focus:outline-none cursor-not-allowed"
              disabled
            />
          </div>
        </div>

        <hr className="border-gray-100" />

        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Change Password (Optional)</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">New Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 h-11 bg-gray-50 border border-gray-200 focus:border-blue-500 rounded-xl text-xs font-semibold focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Confirm Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 h-11 bg-gray-50 border border-gray-200 focus:border-blue-500 rounded-xl text-xs font-semibold focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer flex items-center gap-1.5"
        >
          <ShieldCheck className="h-5 w-5" />
          {loading ? 'Saving Changes...' : 'Update Settings'}
        </button>

      </form>

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

export default CustomerProfile;
