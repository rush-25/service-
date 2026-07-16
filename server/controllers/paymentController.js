const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

// @desc    Process mock payment
// @route   POST /api/payments
// @access  Private
exports.createPayment = async (req, res) => {
  try {
    const { bookingId, paymentMethod, amount } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const payment = await Payment.create({
      booking: bookingId,
      user: req.user._id,
      amount: amount || booking.totalPrice,
      paymentMethod,
      status: 'Completed',
    });

    // Update booking status
    booking.paymentStatus = 'Paid';
    if (booking.status === 'Pending') {
      booking.status = 'Confirmed';
    }
    await booking.save();

    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get payments (All for admin, own for customer)
// @route   GET /api/payments
// @access  Private
exports.getPayments = async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'Administrator') {
      query.user = req.user._id;
    }

    const payments = await Payment.find(query)
      .populate('booking')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Refund/Update transaction
// @route   PUT /api/payments/:id/refund
// @access  Private/Admin
exports.refundPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    payment.status = 'Refunded';
    await payment.save();

    // Update booking payment status
    const booking = await Booking.findById(payment.booking);
    if (booking) {
      booking.paymentStatus = 'Refunded';
      booking.status = 'Cancelled';
      await booking.save();
    }

    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
