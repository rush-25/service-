const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['Stripe', 'Cash'],
    required: true,
  },
  paymentIntentId: {
    type: String, // Mock transaction reference ID
    default: () => 'tx_' + Math.random().toString(36).substring(2, 12).toUpperCase(),
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Refunded'],
    default: 'Completed',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Payment', paymentSchema);
