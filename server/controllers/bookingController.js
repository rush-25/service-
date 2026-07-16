const Booking = require('../models/Booking');
const Car = require('../models/Car');
const Notification = require('../models/Notification');

// Helper to check booking overlaps
const checkOverlap = async (carId, pickupDate, returnDate, excludeBookingId = null) => {
  const pickup = new Date(pickupDate);
  const returnD = new Date(returnDate);

  let query = {
    car: carId,
    status: { $in: ['Pending', 'Confirmed', 'Active'] },
    $or: [
      {
        pickupDate: { $lte: returnD },
        returnDate: { $gte: pickup },
      },
    ],
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const overlaps = await Booking.find(query);
  return overlaps.length > 0;
};

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
  try {
    const { carId, pickupLocation, returnLocation, pickupDate, returnDate, paymentMethod } = req.body;

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    if (!car.availability) {
      return res.status(400).json({ success: false, message: 'This vehicle is currently unavailable' });
    }

    // Check overlaps
    const hasOverlap = await checkOverlap(carId, pickupDate, returnDate);
    if (hasOverlap) {
      return res.status(400).json({ success: false, message: 'Vehicle is already booked for these dates' });
    }

    // Calculate prices
    const pDate = new Date(pickupDate);
    const rDate = new Date(returnDate);
    const timeDiff = Math.abs(rDate.getTime() - pDate.getTime());
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24)) || 1;

    let totalPrice = 0;
    if (days >= 30) {
      totalPrice = days * (car.monthlyPrice || car.dailyPrice);
    } else if (days >= 7) {
      totalPrice = days * (car.weeklyPrice || car.dailyPrice);
    } else {
      totalPrice = days * car.dailyPrice;
    }

    // Determine initial status based on payment method
    // Stripe mock payment makes it automatically Confirmed, Cash makes it Pending
    const status = paymentMethod === 'Stripe' ? 'Confirmed' : 'Pending';
    const paymentStatus = paymentMethod === 'Stripe' ? 'Paid' : 'Pending';

    const booking = await Booking.create({
      user: req.user._id,
      car: carId,
      pickupLocation,
      returnLocation,
      pickupDate: pDate,
      returnDate: rDate,
      totalPrice,
      status,
      paymentStatus,
    });

    // Send notifications (Mock implementation + in-app DB notification)
    await Notification.create({
      user: req.user._id,
      title: 'Booking Placed successfully',
      message: `Your booking for ${car.brand} ${car.model} is ${status}. Total: $${totalPrice.toFixed(2)}.`,
    });

    console.log(`[MOCK EMAIL SENT] to ${req.user.email}: Booking for ${car.brand} ${car.model} is placed. Total: $${totalPrice}.`);

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user bookings or all bookings for admin
// @route   GET /api/bookings
// @access  Private
exports.getBookings = async (req, res) => {
  try {
    let query = {};

    // If not Admin, only show own bookings
    if (req.user.role !== 'Administrator') {
      query.user = req.user._id;
    }

    const bookings = await Booking.find(query)
      .populate('car')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get booking details
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('car')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Owner or Admin check
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'Administrator') {
      return res.status(403).json({ success: false, message: 'Unauthorized access to this booking' });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update booking (Cancel, approve, complete etc.)
// @route   PUT /api/bookings/:id
// @access  Private
exports.updateBooking = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    let booking = await Booking.findById(req.params.id).populate('car').populate('user');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // If customer, they can only "Cancel" their booking if it's pending or confirmed
    if (req.user.role !== 'Administrator') {
      if (booking.user._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
      }

      if (status && status !== 'Cancelled') {
        return res.status(400).json({ success: false, message: 'Customers can only cancel bookings' });
      }

      if (booking.status === 'Active' || booking.status === 'Completed') {
        return res.status(400).json({ success: false, message: 'Cannot cancel an ongoing or completed trip' });
      }
    }

    // Update status and payment status if provided
    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    await booking.save();

    // Trigger Notification
    await Notification.create({
      user: booking.user._id,
      title: `Booking Status Update: ${status}`,
      message: `Your booking for ${booking.car.brand} ${booking.car.model} is now ${status}.`,
    });

    console.log(`[MOCK EMAIL SENT] to ${booking.user.email}: Booking state updated to ${status}.`);

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete/Remove Booking
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    await booking.deleteOne();
    res.status(200).json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all booked dates for a specific car to disable in front-end calendar
// @route   GET /api/bookings/car/:carId/dates
// @access  Public
exports.getCarBookedDates = async (req, res) => {
  try {
    const bookings = await Booking.find({
      car: req.params.carId,
      status: { $in: ['Pending', 'Confirmed', 'Active'] },
    }).select('pickupDate returnDate');

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
