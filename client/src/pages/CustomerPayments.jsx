import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Toast from '../components/Toast';
import { CreditCard, Download, ShieldAlert, FileText, CheckCircle } from 'lucide-react';

const CustomerPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get('/payments');
        if (res.data.success) {
          setPayments(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching payments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const handleDownloadInvoice = (pay) => {
    // Generate simple PDF-like print view or CSV string dynamically
    const invoiceContent = `
========================================
             DRIVEEASY INVOICE
========================================
Receipt ID: LKR {pay.paymentIntentId}
Customer Name: LKR {pay.user?.name || 'Customer'}
Customer Email: LKR {pay.user?.email || ''}
Amount Charged: LKR ${pay.amount.toFixed(2)}
Payment Gateway: LKR {pay.paymentMethod}
Transaction Status: LKR {pay.status}
Payment Date: LKR {new Date(pay.createdAt).toLocaleString()}
----------------------------------------
Thank you for choosing DriveEasy!
Safe travels.
========================================
    `;

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice-${pay.paymentIntentId}.txt`;
    link.click();
    showToast('Invoice document downloaded successfully!');
  };

  if (loading) {
    return <div className="animate-pulse h-40 bg-gray-200 rounded-3xl"></div>;
  }

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Payments & Invoices</h1>
        <p className="text-xs text-gray-400 mt-1">Review your rental payment transaction receipts and download official receipts.</p>
      </div>

      {payments.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-16 text-center space-y-4">
          <ShieldAlert className="h-12 w-12 text-blue-500 mx-auto" />
          <h3 className="text-lg font-bold text-gray-900">No Transactions Found</h3>
          <p className="text-sm text-gray-400 max-w-sm mx-auto">You have no recorded payment records inside DriveEasy yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Transaction History</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-semibold text-left">
              <thead className="bg-gray-50 text-gray-400 uppercase tracking-wider text-[10px] border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Receipt ID</th>
                  <th className="px-6 py-4">Payment Method</th>
                  <th className="px-6 py-4">Amount Charged</th>
                  <th className="px-6 py-4">Created Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Invoices</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payments.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-mono font-bold text-gray-900">{p.paymentIntentId}</td>
                    <td className="px-6 py-4 text-gray-700">{p.paymentMethod}</td>
                    <td className="px-6 py-4 text-blue-600 font-extrabold">LKR {p.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        p.status === 'Completed' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDownloadInvoice(p)}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all cursor-pointer"
                        title="Download Receipt TXT"
                      >
                        <Download className="h-4.5 w-4.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

export default CustomerPayments;
