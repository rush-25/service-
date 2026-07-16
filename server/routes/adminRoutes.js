const express = require('express');
const router = express.Router();
const { getAdminStats, getCustomers, toggleSuspendCustomer, deleteCustomer } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('Administrator'));

router.get('/stats', getAdminStats);
router.get('/customers', getCustomers);
router.put('/customers/:id/suspend', toggleSuspendCustomer);
router.delete('/customers/:id', deleteCustomer);

module.exports = router;
