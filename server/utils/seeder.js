const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = require('../config/db');
const User = require('../models/User');
const Sale = require('../models/Sale');
const Customer = require('../models/Customer');
const Product = require('../models/Product');

const seedData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Sale.deleteMany();
    await Customer.deleteMany();
    await Product.deleteMany();

    const users = [
      { name: 'Admin', email: 'admin@kpidashboard.com', password: 'admin123', role: 'admin' },
      { name: 'Manager', email: 'manager@kpidashboard.com', password: 'manager123', role: 'manager' },
      { name: 'Viewer', email: 'viewer@kpidashboard.com', password: 'viewer123', role: 'viewer' }
    ];

    const createdUsers = await User.create(users);
    const adminUser = createdUsers[0]; // Get the admin user for associating sales

    const customers = [
      {
        name: 'John Doe',
        email: 'john@gmail.com',
        phone: '+1-555-0101',
        company: 'Tech Corp',
        region: 'North America',
        status: 'active',
        totalOrders: 45,
        totalRevenue: 125000,
        joinDate: new Date('2023-01-15'),
        userId: adminUser._id
      },
      {
        name: 'Ali Khan',
        email: 'ali@gmail.com',
        phone: '+92-555-0102',
        company: 'Digital Solutions',
        region: 'Asia Pacific',
        status: 'active',
        totalOrders: 32,
        totalRevenue: 98000,
        joinDate: new Date('2023-03-22'),
        userId: adminUser._id
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah@global.com',
        phone: '+1-555-0103',
        company: 'Global Solutions',
        region: 'Europe',
        status: 'active',
        totalOrders: 56,
        totalRevenue: 175000,
        joinDate: new Date('2022-11-05'),
        userId: adminUser._id
      },
      {
        name: 'Michael Brown',
        email: 'michael@innovation.com',
        phone: '+1-555-0104',
        company: 'Innovation Inc',
        region: 'North America',
        status: 'inactive',
        totalOrders: 12,
        totalRevenue: 35000,
        joinDate: new Date('2023-06-10'),
        userId: adminUser._id
      },
      {
        name: 'Emily Davis',
        email: 'emily@digital.com',
        phone: '+1-555-0105',
        company: 'Digital Dynamics',
        region: 'Latin America',
        status: 'active',
        totalOrders: 67,
        totalRevenue: 210000,
        joinDate: new Date('2022-10-15'),
        userId: adminUser._id
      },
      {
        name: 'David Wilson',
        email: 'david@smart.com',
        phone: '+1-555-0106',
        company: 'Smart Systems',
        region: 'Europe',
        status: 'prospect',
        totalOrders: 0,
        totalRevenue: 0,
        joinDate: new Date('2024-01-08'),
        userId: adminUser._id
      },
      {
        name: 'Lisa Anderson',
        email: 'lisa@future.com',
        phone: '+1-555-0107',
        company: 'Future Tech',
        region: 'Asia Pacific',
        status: 'active',
        totalOrders: 28,
        totalRevenue: 76000,
        joinDate: new Date('2023-08-14'),
        userId: adminUser._id
      },
      {
        name: 'Robert Taylor',
        email: 'robert@cloud.com',
        phone: '+1-555-0108',
        company: 'Cloud Nine',
        region: 'Latin America',
        status: 'active',
        totalOrders: 19,
        totalRevenue: 54000,
        joinDate: new Date('2023-09-30'),
        userId: adminUser._id
      }
    ];

    await Customer.create(customers);

    const salespeople = ['John Smith', 'Sarah Johnson', 'Mike Davis', 'Emily Chen', 'Robert Wilson'];
    const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Health & Beauty', 'Toys', 'Food & Beverage'];
    const regions = ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East', 'Africa'];

    const sales = [];
    const currentYear = new Date().getFullYear();

    // Generate sales data for all 12 months of 2026, associated with admin user
    for (let month = 0; month < 12; month++) {
      // Multiple sales entries per month
      for (let i = 0; i < 8; i++) {
        const day = Math.floor(Math.random() * 28) + 1;
        sales.push({
          date: new Date(currentYear, month, day),
          product: `Product ${Math.floor(Math.random() * 100) + 1}`,
          category: categories[Math.floor(Math.random() * categories.length)],
          region: regions[Math.floor(Math.random() * regions.length)],
          salesperson: salespeople[Math.floor(Math.random() * salespeople.length)],
          orders: Math.floor(Math.random() * 50) + 10,
          revenue: Math.floor(Math.random() * 50000) + 10000,
          profit: Math.floor(Math.random() * 15000) + 2000,
          userId: adminUser._id
        });
      }
    }

    await Sale.create(sales);

    console.log('Database seeded successfully with users, customers and user-specific sales data');
    process.exit();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
