const express = require('express');
const router = express.Router();
const { createPayment, getPayments, refundPayment } = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createPayment)
  .get(protect, getPayments);

router.route('/:id/refund')
  .put(protect, authorize('Administrator'), refundPayment);

module.exports = router;
