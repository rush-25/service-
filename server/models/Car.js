const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: [true, 'Please provide a brand'],
    trim: true,
  },
  model: {
    type: String,
    required: [true, 'Please provide a model'],
    trim: true,
  },
  year: {
    type: Number,
    required: [true, 'Please provide a year'],
  },
  color: {
    type: String,
    required: [true, 'Please provide a color'],
  },
  seats: {
    type: Number,
    required: [true, 'Please provide seats count'],
  },
  fuelType: {
    type: String,
    required: [true, 'Please provide fuel type'],
    enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
  },
  transmission: {
    type: String,
    required: [true, 'Please provide transmission type'],
    enum: ['Automatic', 'Manual'],
  },
  dailyPrice: {
    type: Number,
    required: [true, 'Please provide daily price'],
  },
  weeklyPrice: {
    type: Number,
    required: [true, 'Please provide weekly price'],
  },
  monthlyPrice: {
    type: Number,
    required: [true, 'Please provide monthly price'],
  },
  description: {
    type: String,
    required: [true, 'Please provide description'],
  },
  availability: {
    type: Boolean,
    default: true,
  },
  images: [
    {
      type: String, // URLs of images
    },
  ],
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['Luxury', 'SUV', 'Sedan', 'Sports', 'Electric', 'Van'],
  },
  rating: {
    type: Number,
    default: 5.0,
  },
  reviewsCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Car', carSchema);
