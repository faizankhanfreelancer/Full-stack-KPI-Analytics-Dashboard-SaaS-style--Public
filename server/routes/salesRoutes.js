const express = require('express');
const {
  getSales,
  getSale,
  createSale,
  updateSale,
  deleteSale,
  getFilterOptions,
  getOrderLocations
} = require('../controllers/salesController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// apply authentication to all sales routes
router.use(protect);

router.get('/locations', getOrderLocations);
router.get('/', getSales);
router.get('/filters/options', getFilterOptions);
router.get('/:id', getSale);
router.post('/', authorize('admin', 'manager'), createSale);
router.put('/:id', authorize('admin', 'manager'), updateSale);
router.delete('/:id', authorize('admin'), deleteSale);

module.exports = router;
