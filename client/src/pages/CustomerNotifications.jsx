import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Toast from '../components/Toast';
import { Bell, ShieldAlert, CheckCheck, Trash2, MailOpen } from 'lucide-react';

const CustomerNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      const res = await api.put(`/notifications/${id}/read`);
      if (res.data.success) {
        setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
        showToast('Notification marked as read');
      }
    } catch (err) {
      showToast('Action failed', 'error');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await api.put('/notifications/read-all');
      if (res.data.success) {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        showToast('All messages marked as read');
      }
    } catch (err) {
      showToast('Action failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await api.delete(`/notifications/${id}`);
      if (res.data.success) {
        setNotifications(notifications.filter(n => n._id !== id));
        showToast('Notification deleted');
      }
    } catch (err) {
      showToast('Delete failed', 'error');
    }
  };

  if (loading) {
    return <div className="animate-pulse h-40 bg-gray-200 rounded-3xl"></div>;
  }

  return (
    <div className="space-y-8">

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Notifications</h1>
          <p className="text-xs text-gray-400 mt-1">Review alerts, updates, and transaction confirmations.</p>
        </div>
        {notifications.some(n => !n.isRead) && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 px-4 h-10 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold rounded-xl text-xs transition-all cursor-pointer"
          >
            <CheckCheck className="h-4 w-4" />
            Mark All Read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-16 text-center space-y-4">
          <ShieldAlert className="h-12 w-12 text-blue-500 mx-auto" />
          <h3 className="text-lg font-bold text-gray-900">All Caught Up</h3>
          <p className="text-sm text-gray-400 max-w-sm mx-auto">You have no active message alerts inside your inbox.</p>
        </div>
      ) : (
        <div className="space-y-4 text-left">
          {notifications.map((n) => (
            <div key={n._id} className={`p-6 rounded-2xl border flex gap-4 justify-between items-center transition-all ${
              n.isRead ? 'bg-white border-gray-100 opacity-60' : 'bg-blue-50/30 border-blue-100 shadow-sm'
            }`}>

              <div className="flex gap-3 items-center">
                <div className={`p-2 rounded-lg shrink-0 ${n.isRead ? 'bg-gray-100 text-gray-400' : 'bg-blue-100 text-blue-600'}`}>
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{n.title}</h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-gray-400 mt-1.5 block font-semibold">{new Date(n.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-2">
                {!n.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(n._id)}
                    className="p-1.5 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors cursor-pointer"
                    title="Mark Read"
                  >
                    <MailOpen className="h-4.5 w-4.5" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(n._id)}
                  className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors cursor-pointer"
                  title="Delete Alert"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </button>
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

export default CustomerNotifications;
