const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, 'Please add a date'],
    default: Date.now
  },
  product: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Health & Beauty', 'Toys', 'Food & Beverage']
  },
  region: {
    type: String,
    required: [true, 'Please add a region'],
    enum: ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East', 'Africa']
  },
  salesperson: {
    type: String,
    required: [true, 'Please add a salesperson'],
    trim: true
  },
  orders: {
    type: Number,
    required: [true, 'Please add number of orders'],
    min: [0, 'Orders cannot be negative']
  },
  revenue: {
    type: Number,
    required: [true, 'Please add revenue'],
    min: [0, 'Revenue cannot be negative']
  },
  profit: {
    type: Number,
    required: [true, 'Please add profit'],
    min: [0, 'Profit cannot be negative']
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    default: null
  },
  customerName: {
    type: String,
    trim: true,
    default: ''
  },
  city: {
    type: String,
    trim: true,
    default: ''
  },
  country: {
    type: String,
    trim: true,
    default: ''
  },
  latitude: {
    type: Number,
    default: null
  },
  longitude: {
    type: Number,
    default: null
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please add a user ID']
  }
}, {
  timestamps: true
});

// Index for faster queries
saleSchema.index({ date: -1 });
saleSchema.index({ category: 1 });
saleSchema.index({ region: 1 });
saleSchema.index({ salesperson: 1 });
saleSchema.index({ userId: 1 });
saleSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Sale', saleSchema);
