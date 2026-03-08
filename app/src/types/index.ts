// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'viewer';
  avatar?: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Sale Types
export interface Sale {
  _id: string;
  date: string;
  product: string;
  category: string;
  region: string;
  salesperson: string;
  orders: number;
  revenue: number;
  profit: number;
  customerId?: string;
  customerName?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SalesFilter {
  startDate?: string;
  endDate?: string;
  category?: string;
  region?: string;
  salesperson?: string;
  product?: string;
}

export interface SalesPagination {
  page: number;
  limit: number;
  totalPages: number;
  total: number;
}

export interface SalesResponse {
  success: boolean;
  count: number;
  total: number;
  pagination: SalesPagination;
  data: Sale[];
}

// KPI Types
export interface KPIMetric {
  value: number | string;
  change: string;
  trend: 'up' | 'down';
}

export interface KPIMetrics {
  totalRevenue: KPIMetric;
  totalOrders: KPIMetric;
  totalProfit: KPIMetric;
  avgOrderValue: KPIMetric;
  activeCustomers: KPIMetric;
  conversionRate: KPIMetric;
}

export interface ChartData {
  name?: string;
  month?: string;
  date?: string;
  region?: string;
  value?: number;
  revenue?: number;
  profit?: number;
  orders?: number;
  newCustomers?: number;
}

export interface OrderLocation {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  count: number;
  demo?: boolean;
  orders: Array<{
    customerName?: string;
    product: string;
    date: string;
    city?: string;
    country?: string;
  }>;
}

// Filter Options
export interface FilterOptions {
  categories: string[];
  regions: string[];
  salespeople: string[];
  products: string[];
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  read: boolean;
  createdAt: string;
}

// Theme
export type Theme = 'light' | 'dark';

// Sidebar State
export interface SidebarState {
  collapsed: boolean;
  mobileOpen: boolean;
}
