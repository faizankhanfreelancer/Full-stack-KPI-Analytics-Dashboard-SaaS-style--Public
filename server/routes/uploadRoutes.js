const express = require('express');
const { uploadSales, exportSales, getTemplate } = require('../controllers/uploadController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/sales', authorize('admin', 'manager'), uploadSales);
router.get('/export', exportSales);
router.get('/template', getTemplate);

module.exports = router;
