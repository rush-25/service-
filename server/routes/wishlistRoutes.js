const express = require('express');
const router = express.Router();
const { addToWishlist, getWishlist, deleteFromWishlist, deleteFromWishlistByCarId } = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, addToWishlist)
  .get(protect, getWishlist);

router.route('/:id')
  .delete(protect, deleteFromWishlist);

router.route('/car/:carId')
  .delete(protect, deleteFromWishlistByCarId);

module.exports = router;
