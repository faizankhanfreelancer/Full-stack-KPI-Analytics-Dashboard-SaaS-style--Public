const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const { protect } = require('./middleware/auth');
const { getOrderLocations } = require('./controllers/salesController');

// load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

// connect to database
connectDB();

const app = express();

// middlewares
app.use(express.json());
app.use(require('cors')());
app.use(require('express-fileupload')());

// routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/sales', require('./routes/salesRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/kpi', require('./routes/kpiRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.get('/api/orders/locations', protect, getOrderLocations);

// simple root route
app.get('/', (req, res) => {
  res.send('KPI Analytics Dashboard API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
