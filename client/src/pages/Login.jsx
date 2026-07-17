import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import { KeyRound, Mail, LogIn, CheckCircle } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both your email and password.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        showToast('Login successful! Redirecting...');

        // Retrieve role to determine redirect
        const user = JSON.parse(localStorage.getItem('user'));
        setTimeout(() => {
          if (user?.role === 'Administrator') {
            navigate('/admin');
          } else {
            navigate('/dashboard');
          }
        }, 1500);
      } else {
        showToast(res.message, 'error');
      }
    } catch (err) {
      showToast('An unexpected error occurred.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 text-left">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-8">

        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Welcome Back</h2>
          <p className="text-sm text-gray-500">Sign in to your premium DriveEasy rental panel</p>
        </div>

        {/* Demo Accounts Panel */}
        <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl space-y-2">
          <p className="text-xs font-bold text-blue-800 uppercase tracking-wider">💡 Seeded Demo Accounts:</p>
          <div className="text-xs text-blue-700 space-y-1">
            <p><span className="font-bold">Customer:</span> john@example.com / customerpassword123</p>
            <p><span className="font-bold">Admin:</span> admin@driveeasy.com / adminpassword123</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 h-12 bg-gray-50 border border-gray-200 focus:border-blue-500 rounded-xl text-sm font-medium focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 h-12 bg-gray-50 border border-gray-200 focus:border-blue-500 rounded-xl text-sm font-medium focus:outline-none transition-all"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-500">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Remember Me
            </label>
            <a href="#" className="text-blue-600 hover:underline font-semibold" onClick={(e) => { e.preventDefault(); showToast('Password recovery module triggered in demo simulation!'); }}>
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-blue-100 flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogIn className="h-5 w-5" />
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 font-semibold">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">Register Now</Link>
        </p>

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

export default Login;
