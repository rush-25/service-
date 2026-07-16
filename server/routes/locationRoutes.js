const express = require('express');
const router = express.Router();
const { getLocations, createLocation } = require('../controllers/locationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getLocations)
  .post(protect, authorize('Administrator'), createLocation);

module.exports = router;
