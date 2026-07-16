import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Toast from '../components/Toast';
import { ShieldAlert, Star, Trash2, Edit2, Check } from 'lucide-react';

const CustomerReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Edit Review modal states
  const [editId, setEditId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const fetchReviews = async () => {
    try {
      // Fetch all reviews and filter client-side to own reviews in demo memory state
      // (or query endpoint that has populated details)
      const carsRes = await api.get('/cars');
      if (carsRes.data.success) {
        let allRevs = [];
        for (const car of carsRes.data.data) {
          const revRes = await api.get(`/reviews/car/${car._id}`);
          if (revRes.data.success) {
            // Include car details in object
            const withCar = revRes.data.data.map(r => ({ ...r, car }));
            allRevs = [...allRevs, ...withCar];
          }
        }

        // Match current user
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const userRevs = allRevs.filter(r => r.user?._id === currentUser?._id || r.user === currentUser?._id);
        setReviews(userRevs);
      }
    } catch (err) {
      console.error('Error loading user reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete review permanently?')) return;

    try {
      const res = await api.delete(`/reviews/${id}`);
      if (res.data.success) {
        showToast('Review deleted successfully');
        setReviews(reviews.filter(r => r._id !== id));
      }
    } catch (err) {
      showToast('Failed to delete review.', 'error');
    }
  };

  const handleStartEdit = (rev) => {
    setEditId(rev._id);
    setEditRating(rev.rating);
    setEditComment(rev.comment);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/reviews/${editId}`, {
        rating: editRating,
        comment: editComment,
      });

      if (res.data.success) {
        showToast('Your review was successfully updated.');
        setEditId(null);
        fetchReviews();
      }
    } catch (err) {
      showToast('Failed to update review.', 'error');
    }
  };

  if (loading) {
    return <div className="animate-pulse h-40 bg-gray-200 rounded-3xl"></div>;
  }

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">My Reviews</h1>
        <p className="text-xs text-gray-400 mt-1">Reflect, modify, or delete your driver feedback entries.</p>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-16 text-center space-y-4">
          <ShieldAlert className="h-12 w-12 text-blue-500 mx-auto" />
          <h3 className="text-lg font-bold text-gray-900">No Reviews Posted Yet</h3>
          <p className="text-sm text-gray-400 max-w-sm mx-auto">You have not written any ratings for our premium cars yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {reviews.map((rev) => (
            <div key={rev._id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4 relative">

              {editId === rev._id ? (
                /* Edit Mode Inline Form */
                <form onSubmit={handleUpdate} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-400 uppercase">Edit Rating:</span>
                    <select
                      value={editRating}
                      onChange={(e) => setEditRating(parseInt(e.target.value))}
                      className="h-8 bg-gray-50 border rounded-lg text-xs"
                    >
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
                  </div>
                  <textarea
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    className="w-full p-3 h-20 bg-gray-50 border border-gray-200 focus:border-blue-500 rounded-xl text-xs resize-none"
                    required
                  />
                  <div className="flex gap-2">
                    <button type="submit" className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer">
                      <Check className="h-3.5 w-3.5" /> Save
                    </button>
                    <button type="button" onClick={() => setEditId(null)} className="h-9 px-4 bg-gray-100 text-gray-600 hover:bg-gray-200 font-bold rounded-xl text-xs cursor-pointer">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                /* View Mode */
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{rev.car?.brand}</span>
                      <h4 className="font-bold text-gray-900 text-sm">{rev.car?.model}</h4>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 leading-relaxed italic">"{rev.comment}"</p>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <span className="text-[10px] text-gray-400 font-semibold">{new Date(rev.createdAt).toLocaleDateString()}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStartEdit(rev)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit Review"
                      >
                        <Edit2 className="h-4.5 w-4.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(rev._id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Review"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>
                </>
              )}

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

export default CustomerReviews;
