import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Toast from '../components/Toast';
import { Search, ShieldAlert, Trash2, ShieldOff, ShieldAlert as SuspendedIcon } from 'lucide-react';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/admin/customers', { params: { search } });
      if (res.data.success) {
        setCustomers(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  const handleToggleSuspend = async (id, isSuspended) => {
    try {
      const res = await api.put(`/admin/customers/${id}/suspend`);
      if (res.data.success) {
        showToast(res.data.message);
        setCustomers(customers.map(c => c._id === id ? { ...c, isSuspended: !isSuspended } : c));
      }
    } catch (err) {
      showToast('Toggle suspension failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete customer account permanently? This action is irreversible.')) return;

    try {
      const res = await api.delete(`/admin/customers/${id}`);
      if (res.data.success) {
        showToast('Customer deleted successfully');
        setCustomers(customers.filter(c => c._id !== id));
      }
    } catch (err) {
      showToast('Delete action failed', 'error');
    }
  };

  if (loading && customers.length === 0) {
    return <div className="animate-pulse h-40 bg-gray-900 rounded-3xl"></div>;
  }

  return (
    <div className="space-y-8 text-left">

      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Customer Management</h1>
        <p className="text-xs text-gray-400 mt-1">Review active users, toggle suspension bounds, or delete customer cards.</p>
      </div>

      {/* Search bar */}
      <div className="relative bg-slate-900/30 border border-slate-800 p-4 rounded-2xl">
        <Search className="absolute left-7 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search customers by name, email, or telephone number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 h-11 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Table list */}
      <div className="bg-slate-900/30 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        {customers.length === 0 ? (
          <div className="p-16 text-center text-xs text-gray-400">
            No logged customer records found matching search parameters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-semibold text-left">
              <thead className="bg-slate-900 text-gray-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Registered Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {customers.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-900/50">
                    <td className="px-6 py-4 font-bold text-white">{c.name}</td>
                    <td className="px-6 py-4 text-gray-300">{c.email}</td>
                    <td className="px-6 py-4 text-gray-400">{c.phone}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        c.isSuspended ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'
                      }`}>
                        {c.isSuspended ? 'Suspended' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => handleToggleSuspend(c._id, c.isSuspended)}
                        className={`px-2.5 h-8 font-bold rounded-lg text-[10px] flex items-center gap-1 transition-all cursor-pointer ${
                          c.isSuspended
                            ? 'bg-green-500/10 hover:bg-green-500 text-green-400 hover:text-white'
                            : 'bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-white'
                        }`}
                        title={c.isSuspended ? 'Unsuspend Account' : 'Suspend Account'}
                      >
                        <SuspendedIcon className="h-3.5 w-3.5" />
                        {c.isSuspended ? 'Unsuspend' : 'Suspend'}
                      </button>
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="p-1.5 bg-slate-800 text-slate-400 hover:bg-red-500 hover:text-white rounded-lg transition-all cursor-pointer"
                        title="Delete User"
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

export default AdminCustomers;
