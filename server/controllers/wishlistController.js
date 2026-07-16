const Wishlist = require('../models/Wishlist');

// @desc    Add car to wishlist
// @route   POST /api/wishlist
// @access  Private
exports.addToWishlist = async (req, res) => {
  try {
    const { carId } = req.body;

    // Check if already in wishlist
    const existing = await Wishlist.findOne({ user: req.user._id, car: carId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Already in wishlist' });
    }

    const item = await Wishlist.create({
      user: req.user._id,
      car: carId,
    });

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res) => {
  try {
    const items = await Wishlist.find({ user: req.user._id }).populate('car');
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete from wishlist
// @route   DELETE /api/wishlist/:id
// @access  Private
exports.deleteFromWishlist = async (req, res) => {
  try {
    const item = await Wishlist.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Wishlist item not found' });
    }

    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await item.deleteOne();
    res.status(200).json({ success: true, message: 'Removed from wishlist successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove from wishlist by Car ID
// @route   DELETE /api/wishlist/car/:carId
// @access  Private
exports.deleteFromWishlistByCarId = async (req, res) => {
  try {
    const item = await Wishlist.findOne({ user: req.user._id, car: req.params.carId });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Wishlist item not found' });
    }

    await item.deleteOne();
    res.status(200).json({ success: true, message: 'Removed from wishlist successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
