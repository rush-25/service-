import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Heart, Star, Disc, Settings, Users, Info, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CarCard = ({ car, isWishlisted, onWishlistToggle, showNotification }) => {
  const { user } = useAuth();

  return (
    <div className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Car Image Container */}
      <div className="relative aspect-video overflow-hidden bg-gray-50">
        <img
          src={car.images && car.images[0] ? car.images[0] : 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80'}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Category Label */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center px-3 py-1 text-xs font-semibold tracking-wider text-blue-700 bg-blue-50/90 backdrop-blur-sm rounded-full uppercase">
            {car.category}
          </span>
        </div>

        {/* Wishlist Button */}
        {user && user.role !== 'Administrator' && (
          <button
            onClick={() => onWishlistToggle(car._id)}
            className="absolute top-4 right-4 p-2.5 bg-white/80 hover:bg-white backdrop-blur-sm hover:scale-110 rounded-full text-red-500 shadow-md transition-all cursor-pointer"
          >
            <Heart className={`h-4.5 w-4.5 ${isWishlisted ? 'fill-red-500' : ''}`} />
          </button>
        )}
      </div>

      {/* Details Container */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{car.brand}</span>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{car.model}</h3>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
            <span className="text-sm font-semibold text-gray-700">{car.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Specifications Icons */}
        <div className="grid grid-cols-3 gap-2 py-4 border-y border-gray-100 my-4 text-xs text-gray-500 font-medium">
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-gray-400 shrink-0" />
            <span>{car.seats} Seats</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Settings className="h-4 w-4 text-gray-400 shrink-0" />
            <span className="truncate">{car.transmission}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Disc className="h-4 w-4 text-gray-400 shrink-0" />
            <span>{car.fuelType}</span>
          </div>
        </div>

        {/* Price & Actions */}
        <div className="flex justify-between items-center mt-auto pt-2">
          <div>
            <span className="text-2xl font-extrabold text-blue-600">${car.dailyPrice}</span>
            <span className="text-xs font-semibold text-gray-400"> / Day</span>
          </div>

          <Link
            to={`/cars/${car._id}`}
            className="inline-flex items-center gap-1.5 px-4 h-10 text-sm font-bold text-white bg-[#111827] hover:bg-blue-600 rounded-xl shadow-md shadow-gray-100 hover:shadow-blue-200 transition-all cursor-pointer"
          >
            Details
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
