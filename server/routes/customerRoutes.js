const express = require('express');
const {
  getAllCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerStats
} = require('../controllers/customerController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All customer routes are now protected
router.use(protect);

router.get('/', getAllCustomers);
router.get('/stats/overview', getCustomerStats);
router.get('/:id', getCustomer);

// Allow authenticated users to manage their own customers
router.post('/', createCustomer);
router.put('/:id', updateCustomer);
// Keep delete restricted to admin to prevent accidental data loss
router.delete('/:id', authorize('admin'), deleteCustomer);

module.exports = router;
