import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Disc, Settings, Users, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const WHATSAPP_NUMBER = '94773511935'; // Update this to your actual WhatsApp number

const CarCard = ({ car, isWishlisted, onWishlistToggle }) => {
  const { user } = useAuth();

  const monthlyPrice = car.dailyPrice ? Math.round(car.dailyPrice * 28 * 0.85) : null;

  const waMessage = encodeURIComponent(
    `Hi! I'm interested in renting the ${car.brand} ${car.model} (LKR ${car.dailyPrice}/day). Please share availability.`
  );
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`;

  return (
    <div className="card-lift group relative bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm flex flex-col h-full">

      {/* ── Car Image ── */}
      <div className="relative aspect-video overflow-hidden bg-gray-50">
        <img
          src={
            car.images && car.images[0]
              ? car.images[0]
              : 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80'
          }
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
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500' : ''}`} />
          </button>
        )}

        {/* Availability badge */}
        {car.availability !== undefined && (
          <div className="absolute bottom-3 left-3">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-full ${
              car.availability
                ? 'bg-emerald-500/90 text-white'
                : 'bg-red-500/90 text-white'
            }`}>
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${car.availability ? 'bg-white' : 'bg-white'}`}></span>
              {car.availability ? 'Available' : 'Unavailable'}
            </span>
          </div>
        )}
      </div>

      {/* ── Details ── */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{car.brand}</span>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">{car.model}</h3>
          </div>
          <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
            <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
            <span className="text-xs font-bold text-amber-600">{car.rating?.toFixed(1)}</span>
          </div>
        </div>

        {/* Specs row */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-100 my-3 text-xs text-gray-500 font-medium">
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            <span>{car.seats} Seats</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Settings className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            <span className="truncate">{car.transmission}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Disc className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            <span className="truncate">{car.fuelType}</span>
          </div>
        </div>

        {/* Pricing — Daily + Monthly */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-2xl font-extrabold text-blue-600">LKR {car.dailyPrice?.toLocaleString()}</span>
            <span className="text-xs font-semibold text-gray-400">/ Day</span>
          </div>
          {monthlyPrice && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs text-gray-400">Monthly from</span>
              <span className="text-xs font-bold text-emerald-600">LKR {monthlyPrice.toLocaleString()}</span>
              <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-1.5 py-0.5 rounded-full">-15%</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto">
          <Link
            to={`/cars/${car._id}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 text-sm font-bold text-white bg-[#111827] hover:bg-blue-600 rounded-xl shadow-md shadow-gray-100 hover:shadow-blue-200 transition-all cursor-pointer"
          >
            Details
            <ChevronRight className="h-4 w-4" />
          </Link>
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            title="WhatsApp Quick Inquiry"
            className="wa-pulse inline-flex items-center justify-center w-10 h-10 bg-[#25D366] hover:bg-[#1ebe5d] text-white rounded-xl shadow-md shadow-green-100 transition-all cursor-pointer shrink-0"
          >
            {/* WhatsApp SVG icon */}
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
