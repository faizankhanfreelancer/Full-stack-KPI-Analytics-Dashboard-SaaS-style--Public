# KPI Analytics Dashboard

A professional Business KPI Analytics Dashboard Web Application built with modern technologies. This full-stack application provides comprehensive business performance monitoring with interactive charts, data visualization, and advanced filtering capabilities.

![Dashboard Preview](https://via.placeholder.com/800x400?text=KPI+Dashboard)

## Features

### Core Features
- **KPI Cards**: Real-time metrics display (Total Revenue, Orders, Profit, AOV, Active Customers, Conversion Rate)
- **Interactive Charts**: Monthly Revenue, Orders by Category, Sales by Region, Daily Orders Trend, Customer Growth
- **Advanced Data Table**: Sorting, searching, pagination, and column filtering
- **Dynamic Filters**: Date range, category, region, and salesperson filters
- **Excel Upload/Download**: Import and export sales data
- **Authentication System**: JWT-based auth with role-based access control
- **Dark/Light Mode**: Theme switching with user preference persistence
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### User Roles
- **Admin**: Full access to all features and data management
- **Manager**: Can create, update, and view data
- **Viewer**: Read-only access to dashboard and reports

## Technology Stack

### Frontend
- React 18 (Functional Components + Hooks)
- TypeScript
- Tailwind CSS
- shadcn/ui Components
- Recharts (Data Visualization)
- React Router (Navigation)
- Axios (HTTP Client)
- date-fns (Date formatting)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs (Password hashing)
- xlsx (Excel processing)
- multer (File uploads)

## Project Structure

```
kpi-dashboard/
├── app/                          # Frontend React Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── charts/          # Chart components
│   │   │   ├── dashboard/       # Dashboard components
│   │   │   ├── layout/          # Layout components (Sidebar, Navbar)
│   │   │   └── ProtectedRoute.tsx
│   │   ├── hooks/               # Custom React hooks
│   │   ├── pages/               # Page components
│   │   ├── services/            # API services
│   │   ├── types/               # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── server/                       # Backend Node.js Application
│   ├── config/
│   │   └── db.js                # Database configuration
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── kpiController.js     # KPI metrics and charts
│   │   ├── salesController.js   # Sales CRUD operations
│   │   └── uploadController.js  # File upload/export
│   ├── middleware/
│   │   └── auth.js              # JWT middleware
│   ├── models/
│   │   ├── Customer.js          # Customer schema
│   │   ├── Product.js           # Product schema
│   │   ├── Sale.js              # Sale schema
│   │   └── User.js              # User schema
│   ├── routes/
│   │   ├── authRoutes.js        # Auth routes
│   │   ├── kpiRoutes.js         # KPI routes
│   │   ├── salesRoutes.js       # Sales routes
│   │   └── uploadRoutes.js      # Upload routes
│   ├── utils/
│   │   ├── jwt.js               # JWT utilities
│   │   └── seeder.js            # Database seeder
│   ├── server.js                # Main server file
│   ├── package.json
│   └── .env                     # Environment variables
│
└── README.md
```

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v5.0 or higher)
- npm or yarn

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd kpi-dashboard
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your configuration
# Default MongoDB URI: mongodb://localhost:27017/kpi_dashboard

# Seed the database with sample data
npm run seed

# Start the development server
npm run dev
```

The backend server will start on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to app directory (in a new terminal)
cd app

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start the development server
npm run dev
```

The frontend application will start on `http://localhost:5173`

## Default Login Credentials

After seeding the database, you can use these accounts:

| Role    | Email                      | Password   |
|---------|---------------------------|------------|
| Admin   | admin@kpidashboard.com    | admin123   |
| Manager | manager@kpidashboard.com  | manager123 |
| Viewer  | viewer@kpidashboard.com   | viewer123  |

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/preferences` - Update user preferences

### Sales
- `GET /api/sales` - Get all sales (with filters, pagination)
- `GET /api/sales/:id` - Get single sale
- `POST /api/sales` - Create new sale (Admin/Manager)
- `PUT /api/sales/:id` - Update sale (Admin/Manager)
- `DELETE /api/sales/:id` - Delete sale (Admin)
- `GET /api/sales/filters/options` - Get filter options

### KPI
- `GET /api/kpi/metrics` - Get KPI metrics
- `GET /api/kpi/monthly-revenue` - Get monthly revenue data
- `GET /api/kpi/orders-by-category` - Get orders by category
- `GET /api/kpi/sales-by-region` - Get sales by region
- `GET /api/kpi/customer-growth` - Get customer growth data
- `GET /api/kpi/daily-orders` - Get daily orders trend

### Upload/Export
- `POST /api/upload/sales` - Upload sales data (Excel)
- `GET /api/upload/export` - Export sales data
- `GET /api/upload/template` - Download Excel template

## Features in Detail

### Dashboard
- Real-time KPI cards with trend indicators
- Interactive charts with filtering capabilities
- Sales data table with advanced features
- Date range and category filters

### Sales Analytics
- Detailed revenue analysis
- Orders by category breakdown
- Sales by region comparison
- Daily orders trend visualization

### Data Management
- Manual data entry through forms
- Excel file upload with validation
- Export to Excel/CSV formats
- Download report templates

### User Management
- Role-based access control
- User profile management
- Theme preferences
- Notification settings

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kpi_dashboard
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## Available Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Sample Data

The seeder creates:
- 3 default users (Admin, Manager, Viewer)
- 100 sales records with various products, categories, and regions
- 50 customer records
- 24 product records across 8 categories

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimizations

- Lazy loading of components
- Efficient state management with React hooks
- API response caching
- Optimized re-renders
- Responsive images and assets

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Protected API routes
- Role-based access control
- Input validation
- XSS protection

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@kpidashboard.com or open an issue in the repository.

---

Built with ❤️ using React, Node.js, and MongoDB
