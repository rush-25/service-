import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Toast from '../components/Toast';
import { ShieldAlert, Download, RotateCcw } from 'lucide-react';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const fetchPayments = async () => {
    try {
      const res = await api.get('/payments');
      if (res.data.success) {
        setPayments(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleRefund = async (id) => {
    if (!window.confirm('Trigger full refund for this transaction receipt? This cancels the corresponding booking.')) return;

    try {
      const res = await api.put(`/payments/${id}/refund`);
      if (res.data.success) {
        showToast('Refund processed successfully!');
        fetchPayments();
      }
    } catch (err) {
      showToast('Refund failed.', 'error');
    }
  };

  const handleDownloadReceipt = (pay) => {
    const textReceipt = `
========================================
         DRIVEEASY TRANSACTION RECEIPT
========================================
Transaction ID: ${pay.paymentIntentId}
Customer Name: ${pay.user?.name || 'Customer'}
Customer Email: ${pay.user?.email || ''}
Customer Phone: ${pay.user?.phone || ''}
Grand Total Charged: $${pay.amount.toFixed(2)}
Payment Gateway: ${pay.paymentMethod}
Receipt Date: ${new Date(pay.createdAt).toLocaleString()}
Transaction Status: ${pay.status}
----------------------------------------
Verified secure checkout database receipt.
DriveEasy Car Rental Management Inc.
========================================
    `;

    const blob = new Blob([textReceipt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${pay.paymentIntentId}.txt`;
    link.click();
    showToast('Official payment receipt downloaded.');
  };

  if (loading) {
    return <div className="animate-pulse h-40 bg-gray-900 rounded-3xl"></div>;
  }

  return (
    <div className="space-y-8 text-left">

      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Payments & Financials</h1>
        <p className="text-xs text-gray-400 mt-1">Review live receipts, trigger refunds, or download transaction certificates.</p>
      </div>

      {/* Table list */}
      <div className="bg-slate-900/30 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        {payments.length === 0 ? (
          <div className="p-16 text-center text-xs text-gray-400">
            No system payment transaction records logged.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-semibold text-left">
              <thead className="bg-slate-900 text-gray-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Receipt ID</th>
                  <th className="px-6 py-4">Customer Details</th>
                  <th className="px-6 py-4">Gateway</th>
                  <th className="px-6 py-4">Amount Charged</th>
                  <th className="px-6 py-4">Transaction Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {payments.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-900/50">
                    <td className="px-6 py-4 font-mono font-bold text-white">{p.paymentIntentId}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-white">{p.user?.name || 'Customer'}</p>
                      <p className="text-[10px] text-gray-400 font-normal">{p.user?.email}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{p.paymentMethod}</td>
                    <td className="px-6 py-4 text-blue-400 font-extrabold">${p.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        p.status === 'Completed' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button
                        onClick={() => handleDownloadReceipt(p)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-lg transition-colors cursor-pointer"
                        title="Download official receipt"
                      >
                        <Download className="h-4.5 w-4.5" />
                      </button>
                      {p.status === 'Completed' && (
                        <button
                          onClick={() => handleRefund(p._id)}
                          className="px-2.5 h-8 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1"
                          title="Trigger refund"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          Refund
                        </button>
                      )}
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

export default AdminPayments;
