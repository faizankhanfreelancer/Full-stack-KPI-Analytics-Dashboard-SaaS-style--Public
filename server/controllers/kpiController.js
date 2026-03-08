const Sale = require('../models/Sale');
const Customer = require('../models/Customer');

// @desc    Get KPI metrics
// @route   GET /api/kpi/metrics
// @access  Private
exports.getKPIMetrics = async (req, res) => {
  try {
    const { startDate, endDate, category, region, salesperson } = req.query;

    // Build filter object - always filter by userId
    const filter = { userId: req.user._id };
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    if (category) filter.category = category;
    if (region) filter.region = region;
    if (salesperson) filter.salesperson = salesperson;

    // Get current period data
    const sales = await Sale.find(filter);
    
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.revenue, 0);
    const totalOrders = sales.reduce((sum, sale) => sum + sale.orders, 0);
    const totalProfit = sales.reduce((sum, sale) => sum + sale.profit, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Get active customers count (scoped to the logged in user)
    const activeCustomers = await Customer.countDocuments({ ...filter, status: 'active' });

    // Calculate conversion rate (mock calculation based on orders per customer)
    const conversionRate = activeCustomers > 0 ? (totalOrders / activeCustomers) * 100 : 0;

    // Calculate previous period for comparison
    let prevFilter = { userId: req.user._id };
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diff = end - start;
      prevFilter.date = {
        $gte: new Date(start - diff),
        $lte: new Date(end - diff)
      };
    }
    if (category) prevFilter.category = category;
    if (region) prevFilter.region = region;
    if (salesperson) prevFilter.salesperson = salesperson;

    const prevSales = await Sale.find(prevFilter);
    const prevRevenue = prevSales.reduce((sum, sale) => sum + sale.revenue, 0);
    const prevOrders = prevSales.reduce((sum, sale) => sum + sale.orders, 0);
    const prevProfit = prevSales.reduce((sum, sale) => sum + sale.profit, 0);

    // Calculate percentage changes
    const revenueChange = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;
    const ordersChange = prevOrders > 0 ? ((totalOrders - prevOrders) / prevOrders) * 100 : 0;
    const profitChange = prevProfit > 0 ? ((totalProfit - prevProfit) / prevProfit) * 100 : 0;

    res.status(200).json({
      success: true,
      data: {
        totalRevenue: {
          value: totalRevenue,
          change: revenueChange.toFixed(2),
          trend: revenueChange >= 0 ? 'up' : 'down'
        },
        totalOrders: {
          value: totalOrders,
          change: ordersChange.toFixed(2),
          trend: ordersChange >= 0 ? 'up' : 'down'
        },
        totalProfit: {
          value: totalProfit,
          change: profitChange.toFixed(2),
          trend: profitChange >= 0 ? 'up' : 'down'
        },
        avgOrderValue: {
          value: avgOrderValue.toFixed(2),
          change: '0',
          trend: 'up'
        },
        activeCustomers: {
          value: activeCustomers,
          change: '0',
          trend: 'up'
        },
        conversionRate: {
          value: conversionRate.toFixed(2),
          change: '0',
          trend: 'up'
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get monthly revenue chart data
// @route   GET /api/kpi/monthly-revenue
// @access  Private
exports.getMonthlyRevenue = async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;

    const monthlyData = await Sale.aggregate([
      {
        $match: {
          userId: req.user._id,
          date: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$date' },
          revenue: { $sum: '$revenue' },
          profit: { $sum: '$profit' },
          orders: { $sum: '$orders' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = monthlyData.map(item => ({
      month: months[item._id - 1],
      revenue: item.revenue,
      profit: item.profit,
      orders: item.orders
    }));

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get orders by category
// @route   GET /api/kpi/orders-by-category
// @access  Private
exports.getOrdersByCategory = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = { userId: req.user._id };
    
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const data = await Sale.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$category',
          orders: { $sum: '$orders' },
          revenue: { $sum: '$revenue' }
        }
      },
      { $sort: { orders: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: data.map(item => ({
        name: item._id,
        value: item.orders,
        revenue: item.revenue
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get sales by region
// @route   GET /api/kpi/sales-by-region
// @access  Private
exports.getSalesByRegion = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = { userId: req.user._id };
    
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const data = await Sale.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$region',
          revenue: { $sum: '$revenue' },
          profit: { $sum: '$profit' },
          orders: { $sum: '$orders' }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: data.map(item => ({
        region: item._id,
        revenue: item.revenue,
        profit: item.profit,
        orders: item.orders
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get customer growth data
// @route   GET /api/kpi/customer-growth
// @access  Private
exports.getCustomerGrowth = async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;

    const monthlyData = await Customer.aggregate([
      {
        $match: {
          userId: req.user._id,
          joinDate: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$joinDate' },
          newCustomers: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = monthlyData.map(item => ({
      month: months[item._id - 1],
      newCustomers: item.newCustomers
    }));

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get daily orders trend
// @route   GET /api/kpi/daily-orders
// @access  Private
exports.getDailyOrders = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(days));

    const data = await Sale.aggregate([
      {
        $match: {
          userId: req.user._id,
          date: {
            $gte: startDate,
            $lte: endDate
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            day: { $dayOfMonth: '$date' }
          },
          orders: { $sum: '$orders' },
          revenue: { $sum: '$revenue' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: data.map(item => ({
        date: `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')}`,
        orders: item.orders,
        revenue: item.revenue
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
