const Review = require('../models/Review');
const Car = require('../models/Car');

// Helper to recalculate car average ratings
const updateCarRating = async (carId) => {
  const reviews = await Review.find({ car: carId });
  const reviewsCount = reviews.length;
  let rating = 5.0;

  if (reviewsCount > 0) {
    const total = reviews.reduce((sum, rev) => sum + rev.rating, 0);
    rating = parseFloat((total / reviewsCount).toFixed(1));
  }

  await Car.findByIdAndUpdate(carId, { rating, reviewsCount });
};

// @desc    Add review for a car
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res) => {
  try {
    const { carId, rating, comment } = req.body;

    const carExists = await Car.findById(carId);
    if (!carExists) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    // Check if review already exists
    const existing = await Review.findOne({ car: carId, user: req.user._id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this vehicle' });
    }

    const review = await Review.create({
      car: carId,
      user: req.user._id,
      rating: parseFloat(rating),
      comment,
    });

    await updateCarRating(carId);

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get reviews for a specific car
// @route   GET /api/reviews/:carId
// @access  Public
exports.getCarReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ car: req.params.carId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = async (req, res) => {
  try {
    let review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Ownership check
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'Administrator') {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this review' });
    }

    review.rating = req.body.rating || review.rating;
    review.comment = req.body.comment || review.comment;

    await review.save();
    await updateCarRating(review.car);

    res.status(200).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Ownership or admin check
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'Administrator') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const carId = review.car;
    await review.deleteOne();
    await updateCarRating(carId);

    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
