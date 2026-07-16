import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import CarCard from '../components/CarCard';
import Toast from '../components/Toast';
import { SlidersHorizontal, Search, RotateCcw, ArrowUpDown, Fuel, ShieldAlert } from 'lucide-react';

const Cars = () => {
  const location = useLocation();

  // Initial State from Landing Hero search form, if any
  const searchState = location.state || {};

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [transmission, setTransmission] = useState('');
  const [seats, setSeats] = useState('');
  const [availability, setAvailability] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('mostPopular');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Wishlisted cache
  const [wishlistIds, setWishlistIds] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Unique Brands helper
  const [availableBrands, setAvailableBrands] = useState([]);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const params = {};
      if (brand) params.brand = brand;
      if (category) params.category = category;
      if (fuelType) params.fuelType = fuelType;
      if (transmission) params.transmission = transmission;
      if (seats) params.seats = seats;
      if (availability) params.availability = availability;
      if (search) params.search = search;
      if (sort) params.sort = sort;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const res = await api.get('/cars', { params });
      if (res.data.success) {
        setCars(res.data.data);

        // Extract unique brands for filtering once if not set
        if (availableBrands.length === 0 && res.data.data.length > 0) {
          const brands = [...new Set(res.data.data.map(c => c.brand))];
          setAvailableBrands(brands);
        }
      }
    } catch (err) {
      console.error('Error fetching cars:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await api.get('/wishlist');
        if (res.data.success) {
          setWishlistIds(res.data.data.map(item => item.car?._id).filter(Boolean));
        }
      } catch (err) {
        // Safe to ignore if not logged in
      }
    };

    fetchWishlist();
  }, []);

  // Run search when filters update
  useEffect(() => {
    fetchCars();
    setCurrentPage(1); // Reset page on filter changes
  }, [brand, category, fuelType, transmission, seats, availability, search, sort, minPrice, maxPrice]);

  const handleResetFilters = () => {
    setBrand('');
    setCategory('');
    setFuelType('');
    setTransmission('');
    setSeats('');
    setAvailability('');
    setSearch('');
    setSort('mostPopular');
    setMinPrice('');
    setMaxPrice('');
  };

  const handleWishlistToggle = async (carId) => {
    try {
      if (wishlistIds.includes(carId)) {
        await api.delete(`/wishlist/car/${carId}`);
        setWishlistIds(wishlistIds.filter(id => id !== carId));
        showToast('Vehicle removed from wishlist');
      } else {
        await api.post('/wishlist', { carId });
        setWishlistIds([...wishlistIds, carId]);
        showToast('Vehicle added to wishlist!');
      }
    } catch (err) {
      showToast('Please register or login to bookmark vehicles.', 'error');
    }
  };

  // Pagination Calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCars = cars.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(cars.length / itemsPerPage);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="text-left mb-10 space-y-2">
          {searchState.pickupDate && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-100">
              ✈️ Booking Active: Pickup at {searchState.pickupLocation} ({searchState.pickupDate} to {searchState.returnDate})
            </div>
          )}
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Browse Premium Fleet</h1>
          <p className="text-sm text-gray-500">Filter, sort, and book premium luxury vehicles seamlessly.</p>
        </div>

        {/* Layout: Sidebar Filter & Grid Listings */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Left Columns: Dynamic Filter Sidebar */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit space-y-6 text-left">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-blue-600" />
                Filters
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Search Vehicle</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Brand, model, key..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 h-11 bg-gray-50 border border-gray-200 focus:border-blue-500 rounded-xl text-sm font-medium focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Vehicle Brand</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full h-11 bg-gray-50 border border-gray-200 focus:border-blue-500 rounded-xl text-sm font-medium focus:outline-none transition-all cursor-pointer"
              >
                <option value="">All Brands</option>
                {availableBrands.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-11 bg-gray-50 border border-gray-200 focus:border-blue-500 rounded-xl text-sm font-medium focus:outline-none transition-all cursor-pointer"
              >
                <option value="">All Categories</option>
                <option value="Luxury">Luxury</option>
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="Sports">Sports</option>
                <option value="Electric">Electric</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Daily Budget ($)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="pl-3 h-11 bg-gray-50 border border-gray-200 focus:border-blue-500 rounded-xl text-sm font-medium focus:outline-none transition-all"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="pl-3 h-11 bg-gray-50 border border-gray-200 focus:border-blue-500 rounded-xl text-sm font-medium focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Fuel Type Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Fuel Type</label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                className="w-full h-11 bg-gray-50 border border-gray-200 focus:border-blue-500 rounded-xl text-sm font-medium focus:outline-none transition-all cursor-pointer"
              >
                <option value="">All Fuel Types</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            {/* Transmission */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Transmission</label>
              <select
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
                className="w-full h-11 bg-gray-50 border border-gray-200 focus:border-blue-500 rounded-xl text-sm font-medium focus:outline-none transition-all cursor-pointer"
              >
                <option value="">All Transmissions</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            {/* Seats */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Seats Cap</label>
              <select
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                className="w-full h-11 bg-gray-50 border border-gray-200 focus:border-blue-500 rounded-xl text-sm font-medium focus:outline-none transition-all cursor-pointer"
              >
                <option value="">All Capacities</option>
                <option value="4">4 Seats</option>
                <option value="5">5 Seats</option>
                <option value="7">7 Seats</option>
              </select>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Status</label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full h-11 bg-gray-50 border border-gray-200 focus:border-blue-500 rounded-xl text-sm font-medium focus:outline-none transition-all cursor-pointer"
              >
                <option value="">All Vehicles</option>
                <option value="true">Available Now</option>
              </select>
            </div>

          </div>

          {/* Right Columns: Cars Grid & Sorting */}
          <div className="lg:col-span-3 space-y-6">

            {/* Top Bar Sort options */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
              <span className="text-sm font-semibold text-gray-500">
                Found <span className="text-gray-900 font-bold">{cars.length}</span> luxury models matching your criteria
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <ArrowUpDown className="h-4 w-4 text-gray-400 shrink-0" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="h-10 bg-gray-50 border border-gray-200 focus:border-blue-500 rounded-xl text-xs font-bold focus:outline-none transition-all cursor-pointer"
                >
                  <option value="mostPopular">Sort by: Popularity</option>
                  <option value="highestRated">Sort by: Highest Rated</option>
                  <option value="priceLowToHigh">Sort by: Price Low-to-High</option>
                  <option value="priceHighToLow">Sort by: Price High-to-Low</option>
                </select>
              </div>
            </div>

            {/* Loading Skeletons */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4 animate-pulse">
                    <div className="aspect-video bg-gray-100 rounded-xl"></div>
                    <div className="h-6 bg-gray-100 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                    <div className="h-10 bg-gray-100 rounded-xl mt-4"></div>
                  </div>
                ))}
              </div>
            ) : cars.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-16 text-center space-y-4">
                <ShieldAlert className="h-12 w-12 text-blue-500 mx-auto" />
                <h3 className="text-lg font-bold text-gray-900">No Vehicles Match Your Filter</h3>
                <p className="text-sm text-gray-400 max-w-sm mx-auto">Try resetting or loosening filters to discover our extensive catalog.</p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentCars.map(car => (
                  <CarCard
                    key={car._id}
                    car={car}
                    isWishlisted={wishlistIds.includes(car._id)}
                    onWishlistToggle={handleWishlistToggle}
                  />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 pt-6">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 h-10 border border-gray-200 rounded-xl hover:bg-white text-sm font-semibold disabled:opacity-50"
                >
                  Prev
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 text-sm font-bold rounded-xl border ${
                      currentPage === i + 1
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-gray-200 hover:bg-white text-gray-700'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 h-10 border border-gray-200 rounded-xl hover:bg-white text-sm font-semibold disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}

          </div>

        </div>

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

export default Cars;
