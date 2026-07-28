import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import Toast from '../components/Toast';
import { Plus, Edit, Trash2, Upload, X, Image as ImageIcon } from 'lucide-react';

const AdminVehicles = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Form toggles / modal states
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  // Form state fields
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [color, setColor] = useState('');
  const [seats, setSeats] = useState('5');
  const [fuelType, setFuelType] = useState('Electric');
  const [transmission, setTransmission] = useState('Automatic');
  const [dailyPrice, setDailyPrice] = useState('');
  const [weeklyPrice, setWeeklyPrice] = useState('');
  const [monthlyPrice, setMonthlyPrice] = useState('');
  const [category, setCategory] = useState('Electric');
  const [description, setDescription] = useState('');
  const [imageFiles, setImageFiles] = useState([]);   // new File objects
  const [imagePreviews, setImagePreviews] = useState([]); // data-URL previews
  const [existingImages, setExistingImages] = useState([]); // server URLs when editing
  const fileInputRef = useRef(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const fetchCars = async () => {
    setLoading(true);
    try {
      const res = await api.get('/cars');
      if (res.data.success) {
        setCars(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleOpenCreate = () => {
    setEditId(null);
    setBrand('');
    setModel('');
    setYear('2023');
    setColor('');
    setSeats('5');
    setFuelType('Electric');
    setTransmission('Automatic');
    setDailyPrice('');
    setWeeklyPrice('');
    setMonthlyPrice('');
    setCategory('Electric');
    setDescription('');
    setImageFiles([]);
    setImagePreviews([]);
    setExistingImages([]);
    setShowForm(true);
  };

  const handleOpenEdit = (car) => {
    setEditId(car._id);
    setBrand(car.brand);
    setModel(car.model);
    setYear(car.year.toString());
    setColor(car.color);
    setSeats(car.seats.toString());
    setFuelType(car.fuelType);
    setTransmission(car.transmission);
    setDailyPrice(car.dailyPrice.toString());
    setWeeklyPrice(car.weeklyPrice.toString());
    setMonthlyPrice(car.monthlyPrice.toString());
    setCategory(car.category);
    setDescription(car.description);
    setImageFiles([]);
    setImagePreviews([]);
    setExistingImages(car.images || []);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle from your catalog?')) return;

    try {
      const res = await api.delete(`/cars/${id}`);
      if (res.data.success) {
        showToast('Vehicle deleted successfully');
        setCars(cars.filter(c => c._id !== id));
      }
    } catch (err) {
      showToast('Delete action failed', 'error');
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setImageFiles(prev => [...prev, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreviews(prev => [...prev, ev.target.result]);
      reader.readAsDataURL(file);
    });
    // reset input so same file can be re-selected if removed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeNewImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('brand', brand);
    formData.append('model', model);
    formData.append('year', parseInt(year));
    formData.append('color', color);
    formData.append('seats', parseInt(seats));
    formData.append('fuelType', fuelType);
    formData.append('transmission', transmission);
    formData.append('dailyPrice', parseFloat(dailyPrice));
    formData.append('weeklyPrice', parseFloat(weeklyPrice || dailyPrice));
    formData.append('monthlyPrice', parseFloat(monthlyPrice || dailyPrice));
    formData.append('category', category);
    formData.append('description', description);

    // Append new file uploads
    imageFiles.forEach(file => formData.append('images', file));

    // When editing, pass existing URLs so the server keeps them
    if (editId && existingImages.length > 0) {
      existingImages.forEach(url => formData.append('existingImages', url));
    }

    try {
      if (editId) {
        const res = await api.put(`/cars/${editId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res.data.success) {
          showToast('Vehicle updated successfully!');
          fetchCars();
        }
      } else {
        const res = await api.post('/cars', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res.data.success) {
          showToast('New premium vehicle created successfully!');
          fetchCars();
        }
      }
      setShowForm(false);
    } catch (err) {
      showToast(err.response?.data?.message || 'Action failed', 'error');
    }
  };

  if (loading && cars.length === 0) {
    return <div className="animate-pulse h-40 bg-gray-900 rounded-3xl"></div>;
  }

  return (
    <div className="space-y-8 text-left">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Vehicles Management</h1>
          <p className="text-xs text-gray-400 mt-1">Create, update, or remove luxury vehicle fleets inside your database.</p>
        </div>
        {!showForm && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-5 h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
          >
            <Plus className="h-4.5 w-4.5" />
            Add New Vehicle
          </button>
        )}
      </div>

      {/* Add / Edit Form Card */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">{editId ? 'Edit Vehicle Info' : 'Create New Premium Fleet'}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Brand</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. BMW, Tesla, Audi"
                className="w-full px-4 h-11 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Model Name</label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. Model S Plaid"
                className="w-full px-4 h-11 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Year Model</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g. 2023"
                className="w-full px-4 h-11 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Exterior Color</label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g. Solid Black"
                className="w-full px-4 h-11 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Seats count</label>
              <select
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                className="w-full h-11 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="4">4 Seats</option>
                <option value="5">5 Seats</option>
                <option value="7">7 Seats</option>
                <option value="8">8 Seats</option>
                <option value="9">9 Seats</option>
                <option value="10">10 Seats</option>
                <option value="12">12 Seats</option>
                <option value="14">14 Seats</option>
                <option value="15">15 Seats</option>
                <option value="16">16 Seats</option>
                <option value="18">18 Seats</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Fuel Type</label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                className="w-full h-11 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Electric">Electric</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Transmission</label>
              <select
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
                className="w-full h-11 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Daily Price (LKR)</label>
              <input
                type="number"
                value={dailyPrice}
                onChange={(e) => setDailyPrice(e.target.value)}
                placeholder="e.g. 150"
                className="w-full px-4 h-11 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Weekly Price (LKR)</label>
              <input
                type="number"
                value={weeklyPrice}
                onChange={(e) => setWeeklyPrice(e.target.value)}
                placeholder="Discount weekly rate"
                className="w-full px-4 h-11 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Monthly Price (LKR)</label>
              <input
                type="number"
                value={monthlyPrice}
                onChange={(e) => setMonthlyPrice(e.target.value)}
                placeholder="Discount monthly rate"
                className="w-full px-4 h-11 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-11 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Sedan">Sedan</option>
                <option value="Station Wagon">Station Wagon</option>
                <option value="Hatchback">Hatchback</option>
                <option value="SUV">SUV</option>
                <option value="Crossover">Crossover</option>
                <option value="Pickup Truck">Pickup Truck</option>
                <option value="Minivan (MPV)">Minivan (MPV)</option>
                <option value="Van">Van</option>
                <option value="Fastback">Fastback</option>
                <option value="Liftback">Liftback</option>
                <option value="Kei Car">Kei Car</option>
              </select>
            </div>
          </div>

          {/* Image Upload Section */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-3">Vehicle Images (JPG / PNG)</label>

            {/* Existing images (edit mode) */}
            {existingImages.length > 0 && (
              <div className="mb-3">
                <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">Current Images</p>
                <div className="flex flex-wrap gap-3">
                  {existingImages.map((url, i) => (
                    <div key={i} className="relative group w-24 h-16 rounded-lg overflow-hidden border border-slate-700">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(i)}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New image previews */}
            {imagePreviews.length > 0 && (
              <div className="mb-3">
                <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">New Images</p>
                <div className="flex flex-wrap gap-3">
                  {imagePreviews.map((src, i) => (
                    <div key={i} className="relative group w-24 h-16 rounded-lg overflow-hidden border border-blue-700/50">
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeNewImage(i)}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Drop zone / pick button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-24 border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-blue-400 transition-colors cursor-pointer bg-slate-950/60"
            >
              <Upload className="h-6 w-6" />
              <span className="text-xs font-semibold">Click to upload images</span>
              <span className="text-[10px] text-gray-600">JPG, PNG supported · Multiple files allowed</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Vehicle Specifications Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a luxury highlight write-up of the vehicle..."
              className="w-full p-4 h-24 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 resize-none"
              required
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-6 h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs cursor-pointer"
            >
              {editId ? 'Save Changes' : 'Create Vehicle'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 h-11 bg-slate-800 hover:bg-slate-700 text-gray-300 font-bold rounded-xl text-xs cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Grid listing of existing cars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map(c => (
          <div key={c._id} className="bg-slate-900/30 border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-full">
            <img src={c.images[0]} className="aspect-video object-cover" />
            <div className="p-5 flex flex-col flex-grow space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">{c.brand}</span>
                  <h4 className="font-bold text-white text-sm">{c.model}</h4>
                </div>
                <span className="inline-flex px-2 py-0.5 bg-slate-800 rounded-md text-[10px] font-bold text-gray-300">
                  {c.category}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs text-gray-400">
                <span>Daily budget: <span className="text-white font-bold">LKR {c.dailyPrice}</span></span>
                <span>Weekly: <span className="text-white font-bold">LKR {c.weeklyPrice}</span></span>
              </div>

              <div className="flex gap-2 pt-2 mt-auto border-t border-slate-800">
                <button
                  onClick={() => handleOpenEdit(c)}
                  className="flex-grow h-9 bg-slate-800 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-bold text-gray-300 transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <Edit className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c._id)}
                  className="p-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-all cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
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

export default AdminVehicles;
