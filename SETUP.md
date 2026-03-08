# KPI Analytics Dashboard - Setup Guide

This guide will walk you through setting up and running the KPI Analytics Dashboard application.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v5.0 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **npm** (comes with Node.js) or **yarn**

## Quick Start

### Option 1: Using the Root Package Scripts

1. **Install all dependencies** (root, frontend, and backend):
   ```bash
   npm run install:all
   ```

2. **Set up environment variables**:
   ```bash
   # Backend
   cd server
   cp .env.example .env
   # Edit .env with your MongoDB URI if needed
   
   # Frontend
   cd ../app
   cp .env.example .env
   # Edit .env with your API URL if needed
   ```

3. **Seed the database** (creates sample data and default users):
   ```bash
   npm run seed
   ```

4. **Start both servers** (runs backend and frontend concurrently):
   ```bash
   npm run dev
   ```

5. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

### Option 2: Manual Setup

#### Step 1: Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration (optional)
# Default MongoDB URI: mongodb://localhost:27017/kpi_dashboard

# Seed database with sample data
npm run seed

# Start development server
npm run dev
```

The backend server will start on `http://localhost:5000`

#### Step 2: Frontend Setup (New Terminal)

```bash
# Navigate to app directory
cd app

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

The frontend application will start on `http://localhost:5173`

## Default Login Credentials

After seeding the database, use these accounts to log in:

| Role    | Email                      | Password   | Permissions                          |
|---------|---------------------------|------------|--------------------------------------|
| Admin   | admin@kpidashboard.com    | admin123   | Full access - CRUD all data          |
| Manager | manager@kpidashboard.com  | manager123 | Create, update, view data            |
| Viewer  | viewer@kpidashboard.com   | viewer123  | Read-only access                     |

## Environment Variables

### Backend (server/.env)

```env
PORT=5000                          # Server port
MONGODB_URI=mongodb://localhost:27017/kpi_dashboard  # MongoDB connection string
JWT_SECRET=your_jwt_secret_key     # Secret for JWT tokens
JWT_EXPIRE=7d                      # JWT expiration time
NODE_ENV=development               # Environment (development/production)
```

### Frontend (app/.env)

```env
VITE_API_URL=http://localhost:5000/api  # Backend API URL
```

## Project Structure

```
kpi-dashboard/
├── app/                          # Frontend React Application
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── charts/         # Chart components (Recharts)
│   │   │   ├── dashboard/      # Dashboard components
│   │   │   ├── layout/         # Layout components
│   │   │   └── ui/             # shadcn/ui components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── pages/              # Page components
│   │   ├── services/           # API services
│   │   ├── types/              # TypeScript types
│   │   └── App.tsx             # Main App component
│   ├── public/                 # Static assets
│   └── package.json
│
├── server/                       # Backend Node.js Application
│   ├── config/                 # Configuration files
│   ├── controllers/            # Route controllers
│   ├── middleware/             # Express middleware
│   ├── models/                 # Mongoose models
│   ├── routes/                 # API routes
│   ├── utils/                  # Utility functions
│   ├── server.js               # Main server file
│   └── package.json
│
├── package.json                  # Root package.json
├── README.md                     # Project documentation
└── SETUP.md                      # This file
```

## Available Scripts

### Root Directory

- `npm run install:all` - Install dependencies for all packages
- `npm run dev` - Start both frontend and backend concurrently
- `npm run server` - Start backend only
- `npm run client` - Start frontend only
- `npm run build` - Build frontend for production
- `npm run seed` - Seed database with sample data
- `npm run start` - Start production server

### Backend (server/)

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data

### Frontend (app/)

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Features Overview

### Dashboard
- Real-time KPI cards with trend indicators
- Interactive charts (Monthly Revenue, Orders by Category, Sales by Region, Daily Orders, Customer Growth)
- Advanced data table with sorting, searching, and pagination
- Dynamic filters (date range, category, region, salesperson)

### Data Management
- Manual data entry through forms
- Excel file upload with validation
- Export to Excel/CSV formats
- Download report templates

### User Management
- Role-based access control (Admin, Manager, Viewer)
- User profile management
- Theme preferences (Dark/Light mode)
- Notification settings

## Troubleshooting

### MongoDB Connection Issues

If you encounter MongoDB connection errors:

1. Ensure MongoDB is running:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

2. Check your MongoDB URI in `server/.env`

3. Verify MongoDB is accessible:
   ```bash
   mongosh
   ```

### Port Already in Use

If ports 5000 or 5173 are already in use:

1. Change the port in `server/.env`:
   ```env
   PORT=5001
   ```

2. Update the frontend `.env`:
   ```env
   VITE_API_URL=http://localhost:5001/api
   ```

### Node Modules Issues

If you encounter module-related errors:

```bash
# Delete node_modules and reinstall
rm -rf node_modules app/node_modules server/node_modules
npm run install:all
```

## Sample Data

The database seeder creates:

- **3 Default Users**: Admin, Manager, and Viewer accounts
- **100 Sales Records**: Across 8 categories and 6 regions
- **50 Customer Records**: With various statuses and regions
- **24 Product Records**: Across all categories

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/preferences` - Update user preferences

### Sales Endpoints
- `GET /api/sales` - Get all sales (with filters, pagination)
- `GET /api/sales/:id` - Get single sale
- `POST /api/sales` - Create new sale
- `PUT /api/sales/:id` - Update sale
- `DELETE /api/sales/:id` - Delete sale
- `GET /api/sales/filters/options` - Get filter options

### KPI Endpoints
- `GET /api/kpi/metrics` - Get KPI metrics
- `GET /api/kpi/monthly-revenue` - Get monthly revenue data
- `GET /api/kpi/orders-by-category` - Get orders by category
- `GET /api/kpi/sales-by-region` - Get sales by region
- `GET /api/kpi/customer-growth` - Get customer growth data
- `GET /api/kpi/daily-orders` - Get daily orders trend

### Upload/Export Endpoints
- `POST /api/upload/sales` - Upload sales data (Excel)
- `GET /api/upload/export` - Export sales data
- `GET /api/upload/template` - Download Excel template

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the repository.

---

**Built with ❤️ using React, Node.js, and MongoDB**
