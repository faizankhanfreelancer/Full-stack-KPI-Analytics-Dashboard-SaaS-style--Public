const xlsx = require('xlsx');
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Customer = require('../models/Customer');

// @desc    Upload sales data from Excel
// @route   POST /api/upload/sales
// @access  Private (Admin, Manager)
exports.uploadSales = async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload a file'
      });
    }

    const file = req.files.file;
    
    // Read Excel file
    const workbook = xlsx.read(file.data, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    if (data.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No data found in the file'
      });
    }

    // Validate and transform data
    const salesData = [];
    const errors = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      // Check required fields
      if (!row.date || !row.product || !row.category || !row.region || 
          !row.salesperson || !row.orders || !row.revenue || !row.profit) {
        errors.push(`Row ${i + 2}: Missing required fields`);
        continue;
      }

      try {
        const sale = {
          date: new Date(row.date),
          product: String(row.product).trim(),
          category: String(row.category).trim(),
          region: String(row.region).trim(),
          salesperson: String(row.salesperson).trim(),
          orders: parseInt(row.orders) || 0,
          revenue: parseFloat(row.revenue) || 0,
          profit: parseFloat(row.profit) || 0
        };
        salesData.push(sale);
      } catch (error) {
        errors.push(`Row ${i + 2}: Invalid data format`);
      }
    }

    if (salesData.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid data to import',
        details: errors
      });
    }

    // Insert data
    const result = await Sale.insertMany(salesData);

    res.status(200).json({
      success: true,
      message: `Successfully imported ${result.length} sales records`,
      imported: result.length,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Export sales data to Excel
// @route   GET /api/upload/export
// @access  Private
exports.exportSales = async (req, res) => {
  try {
    const { startDate, endDate, category, region, format = 'xlsx' } = req.query;

    // Build filter
    const filter = {};
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    if (category) filter.category = category;
    if (region) filter.region = region;

    const sales = await Sale.find(filter).sort('-date');

    // Transform data for export
    const exportData = sales.map(sale => ({
      Date: sale.date.toISOString().split('T')[0],
      Product: sale.product,
      Category: sale.category,
      Region: sale.region,
      Salesperson: sale.salesperson,
      Orders: sale.orders,
      Revenue: sale.revenue,
      Profit: sale.profit,
      'Profit Margin': ((sale.profit / sale.revenue) * 100).toFixed(2) + '%'
    }));

    if (format === 'csv') {
      // Export as CSV
      const worksheet = xlsx.utils.json_to_sheet(exportData);
      const csv = xlsx.utils.sheet_to_csv(worksheet);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=sales-report.csv');
      res.send(csv);
    } else {
      // Export as Excel
      const worksheet = xlsx.utils.json_to_sheet(exportData);
      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet, 'Sales Report');
      
      const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=sales-report.xlsx');
      res.send(buffer);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get sample Excel template
// @route   GET /api/upload/template
// @access  Private
exports.getTemplate = async (req, res) => {
  try {
    const templateData = [
      {
        date: '2024-01-01',
        product: 'Sample Product',
        category: 'Electronics',
        region: 'North America',
        salesperson: 'John Doe',
        orders: 10,
        revenue: 1000,
        profit: 300
      }
    ];

    const worksheet = xlsx.utils.json_to_sheet(templateData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Template');
    
    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=sales-template.xlsx');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
