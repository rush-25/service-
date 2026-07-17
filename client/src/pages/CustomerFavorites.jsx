import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Toast from '../components/Toast';
import { Heart, Trash2, ShieldAlert, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const CustomerFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const fetchWishlist = async () => {
    try {
      const res = await api.get('/wishlist');
      if (res.data.success) {
        setFavorites(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (id) => {
    try {
      const res = await api.delete(`/wishlist/${id}`);
      if (res.data.success) {
        showToast('Vehicle removed from wishlist');
        setFavorites(favorites.filter(item => item._id !== id));
      }
    } catch (err) {
      showToast('Failed to remove vehicle.', 'error');
    }
  };

  if (loading) {
    return <div className="animate-pulse h-40 bg-gray-200 rounded-3xl"></div>;
  }

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Favorite Cars</h1>
        <p className="text-xs text-gray-400 mt-1">Review and manage your wishlisted luxury fleet models.</p>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-16 text-center space-y-4">
          <ShieldAlert className="h-12 w-12 text-blue-500 mx-auto" />
          <h3 className="text-lg font-bold text-gray-900">Your Wishlist is Empty</h3>
          <p className="text-sm text-gray-400 max-w-sm mx-auto">Bookmark luxury vehicles in our catalog to populate this space!</p>
          <Link to="/cars" className="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer">
            Explore Cars Fleet
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((item) => {
            const car = item.car;
            if (!car) return null;
            return (
              <div key={item._id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm flex flex-col h-full">
                <img src={car.images[0]} className="aspect-video object-cover bg-gray-50" />
                <div className="p-5 flex flex-col flex-grow text-left space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{car.brand}</span>
                      <h4 className="font-bold text-gray-950 text-sm">{car.model}</h4>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold text-gray-700">{car.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-gray-500 font-semibold">{car.category} • {car.transmission} • {car.fuelType}</p>

                  <div className="flex justify-between items-center pt-2 mt-auto border-t border-gray-100">
                    <div>
                      <span className="text-lg font-black text-blue-600">${car.dailyPrice}</span>
                      <span className="text-[10px] text-gray-400 font-semibold">/Day</span>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/cars/${car._id}`} className="px-3 h-8 flex items-center justify-center bg-gray-900 text-white rounded-lg text-[10px] font-bold">
                        Rent
                      </Link>
                      <button
                        onClick={() => handleRemove(item._id)}
                        className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-all cursor-pointer"
                        title="Remove from favorites"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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

export default CustomerFavorites;
