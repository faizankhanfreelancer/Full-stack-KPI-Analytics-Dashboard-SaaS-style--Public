const Customer = require('../models/Customer');

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ userId: req.user._id }).sort({ joinDate: -1 });
    res.status(200).json({
      success: true,
      count: customers.length,
      data: customers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single customer
// @route   GET /api/customers/:id
// @access  Private
exports.getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }
    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create customer
// @route   POST /api/customers
// @access  Private (Admin, Manager)
exports.createCustomer = async (req, res) => {
  try {
    // Auto-assign userId from authenticated user
    req.body.userId = req.user._id;
    const customer = await Customer.create(req.body);
    res.status(201).json({
      success: true,
      data: customer
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private (Admin, Manager)
exports.updateCustomer = async (req, res) => {
  try {
    // Prevent userId from being modified
    delete req.body.userId;
    
    const customer = await Customer.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id
      },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }
    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private (Admin)
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
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

// @desc    Get customer statistics
// @route   GET /api/customers/stats/overview
// @access  Private
exports.getCustomerStats = async (req, res) => {
  try {
    const filter = { userId: req.user._id };
    const total = await Customer.countDocuments(filter);
    const active = await Customer.countDocuments({ ...filter, status: 'active' });
    const inactive = await Customer.countDocuments({ ...filter, status: 'inactive' });
    const prospects = await Customer.countDocuments({ ...filter, status: 'prospect' });
    const totalRevenue = await Customer.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalRevenue' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        active,
        inactive,
        prospects,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
