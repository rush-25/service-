const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true,
  },
  pickupLocation: {
    type: String,
    required: [true, 'Please provide a pickup location'],
  },
  returnLocation: {
    type: String,
    required: [true, 'Please provide a return location'],
  },
  pickupDate: {
    type: Date,
    required: [true, 'Please provide a pickup date'],
  },
  returnDate: {
    type: Date,
    required: [true, 'Please provide a return date'],
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Active', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Refunded'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Booking', bookingSchema);
