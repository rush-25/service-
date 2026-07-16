const Car = require('../models/Car');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Payment = require('../models/Payment');

// @desc    Get Admin Stats & KPIs
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getAdminStats = async (req, res) => {
  try {
    const totalCars = await Car.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'Customer' });
    const totalBookings = await Booking.countDocuments();

    // Sum Completed Payments Revenue
    const payments = await Payment.find({ status: 'Completed' });
    const revenue = payments.reduce((sum, pay) => sum + pay.amount, 0);

    const activeRentals = await Booking.countDocuments({ status: 'Active' });

    // Charts data: Monthly Bookings (Grouped by month of the current year)
    // For simplicity with Memory MongoDB, we can query bookings and aggregate in JS or standard pipeline
    const bookings = await Booking.find().populate('car');

    // Group monthly
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyStats = monthNames.map(month => ({ month, bookings: 0, revenue: 0 }));

    bookings.forEach(b => {
      const date = new Date(b.createdAt);
      const monthIdx = date.getMonth();
      monthlyStats[monthIdx].bookings += 1;
      if (b.paymentStatus === 'Paid') {
        monthlyStats[monthIdx].revenue += b.totalPrice;
      }
    });

    // Popular Cars (Top cars booked)
    const carBookingCounts = {};
    bookings.forEach(b => {
      if (b.car) {
        const carId = b.car._id.toString();
        const carName = `${b.car.brand} ${b.car.model}`;
        if (!carBookingCounts[carId]) {
          carBookingCounts[carId] = { name: carName, value: 0 };
        }
        carBookingCounts[carId].value += 1;
      }
    });
    const popularCars = Object.values(carBookingCounts)
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // Booking Status split
    const statusCounts = { Pending: 0, Confirmed: 0, Active: 0, Completed: 0, Cancelled: 0 };
    bookings.forEach(b => {
      if (statusCounts[b.status] !== undefined) {
        statusCounts[b.status] += 1;
      }
    });
    const bookingStatusData = Object.keys(statusCounts).map(key => ({
      name: key,
      value: statusCounts[key],
    }));

    res.status(200).json({
      success: true,
      data: {
        cards: {
          totalCars,
          totalCustomers,
          totalBookings,
          revenue,
          activeRentals,
        },
        charts: {
          revenueOverview: monthlyStats,
          monthlyBookings: monthlyStats,
          popularCars,
          bookingStatus: bookingStatusData,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get customer list for admin
// @route   GET /api/admin/customers
// @access  Private/Admin
exports.getCustomers = async (req, res) => {
  try {
    const search = req.query.search;
    let query = { role: 'Customer' };

    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { phone: new RegExp(search, 'i') },
      ];
    }

    const customers = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: customers.length, data: customers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle suspend/unsuspend customer
// @route   PUT /api/admin/customers/:id/suspend
// @access  Private/Admin
exports.toggleSuspendCustomer = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    customer.isSuspended = !customer.isSuspended;
    await customer.save();

    res.status(200).json({
      success: true,
      message: `Customer ${customer.isSuspended ? 'suspended' : 'unsuspended'} successfully`,
      data: customer,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a customer
// @route   DELETE /api/admin/customers/:id
// @access  Private/Admin
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    await customer.deleteOne();
    res.status(200).json({ success: true, message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
