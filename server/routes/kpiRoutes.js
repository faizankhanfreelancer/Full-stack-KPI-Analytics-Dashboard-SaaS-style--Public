const express = require('express');
const {
  getKPIMetrics,
  getMonthlyRevenue,
  getOrdersByCategory,
  getSalesByRegion,
  getCustomerGrowth,
  getDailyOrders
} = require('../controllers/kpiController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/metrics', getKPIMetrics);
router.get('/monthly-revenue', getMonthlyRevenue);
router.get('/orders-by-category', getOrdersByCategory);
router.get('/sales-by-region', getSalesByRegion);
router.get('/customer-growth', getCustomerGrowth);
router.get('/daily-orders', getDailyOrders);

module.exports = router;
