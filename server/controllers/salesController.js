const Sale = require('../models/Sale');
const Customer = require('../models/Customer');

// @desc    Get all sales
// @route   GET /api/sales
// @access  Private
exports.getSales = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      category,
      region,
      salesperson,
      product,
      page = 1,
      limit = 10,
      sort = '-date'
    } = req.query;

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
    if (product) filter.product = { $regex: product, $options: 'i' };

    // Execute query
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const sales = await Sale.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Sale.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: sales.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      },
      data: sales
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single sale
// @route   GET /api/sales/:id
// @access  Private
exports.getSale = async (req, res) => {
  try {
    const sale = await Sale.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!sale) {
      return res.status(404).json({
        success: false,
        error: 'Sale not found'
      });
    }
    res.status(200).json({
      success: true,
      data: sale
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create new sale
// @route   POST /api/sales
// @access  Private (Admin, Manager)
exports.createSale = async (req, res) => {
  try {
    // Add userId to the sale data
    req.body.userId = req.user._id;

    // If a customerId is provided, auto-populate the customerName
    if (req.body.customerId && !req.body.customerName) {
      const customer = await Customer.findById(req.body.customerId);
      if (customer) {
        req.body.customerName = customer.name;
      }
    }

    const sale = await Sale.create(req.body);
    res.status(201).json({
      success: true,
      data: sale
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update sale
// @route   PUT /api/sales/:id
// @access  Private (Admin, Manager)
exports.updateSale = async (req, res) => {
  try {
    // Prevent userId from being modified
    delete req.body.userId;

    // If a customerId is provided, auto-populate the customerName
    if (req.body.customerId && !req.body.customerName) {
      const customer = await Customer.findById(req.body.customerId);
      if (customer) {
        req.body.customerName = customer.name;
      }
    }
    
    const sale = await Sale.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    if (!sale) {
      return res.status(404).json({
        success: false,
        error: 'Sale not found'
      });
    }
    res.status(200).json({
      success: true,
      data: sale
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete sale
// @route   DELETE /api/sales/:id
// @access  Private (Admin)
exports.deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!sale) {
      return res.status(404).json({
        success: false,
        error: 'Sale not found'
      });
    }
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get filter options
// @route   GET /api/sales/filters/options
// @access  Private
exports.getFilterOptions = async (req, res) => {
  try {
    // only provide options existing for this user
    const filter = { userId: req.user._id };
    const categories = await Sale.distinct('category', filter);
    const regions = await Sale.distinct('region', filter);
    const salespeople = await Sale.distinct('salesperson', filter);
    const products = await Sale.distinct('product', filter);

    res.status(200).json({
      success: true,
      data: {
        categories,
        regions,
        salespeople,
        products
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get order locations for map
// @route   GET /api/orders/locations
// @access  Private
exports.getOrderLocations = async (req, res) => {
  try {
    const filter = {
      userId: req.user._id,
      latitude: { $ne: null },
      longitude: { $ne: null }
    };

    const locations = await Sale.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            city: '$city',
            country: '$country',
            latitude: '$latitude',
            longitude: '$longitude'
          },
          count: { $sum: 1 },
          orders: {
            $push: {
              customerName: '$customerName',
              product: '$product',
              date: '$date',
              city: '$city',
              country: '$country'
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          city: '$_id.city',
          country: '$_id.country',
          latitude: '$_id.latitude',
          longitude: '$_id.longitude',
          count: 1,
          orders: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: locations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
