import React, { useState, useEffect } from 'react';
import { Package, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrdersByCategoryChart } from '@/components/charts/OrdersByCategoryChart';
import { useKPI } from '@/hooks/useKPI';

import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  sku: string;
  isActive: boolean;
}

export const Products: React.FC = () => {
  const { ordersByCategory, loading } = useKPI();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    lowStock: 0,
    categories: 0,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      // Mock data for products
      const mockProducts: Product[] = [
        { _id: '1', name: 'Wireless Headphones', category: 'Electronics', price: 149.99, cost: 80, stock: 245, sku: 'SKU-0001', isActive: true },
        { _id: '2', name: 'Smart Watch', category: 'Electronics', price: 299.99, cost: 150, stock: 128, sku: 'SKU-0002', isActive: true },
        { _id: '3', name: 'Laptop Stand', category: 'Electronics', price: 49.99, cost: 20, stock: 15, sku: 'SKU-0003', isActive: true },
        { _id: '4', name: 'Running Shoes', category: 'Sports', price: 129.99, cost: 60, stock: 89, sku: 'SKU-0004', isActive: true },
        { _id: '5', name: 'Yoga Mat', category: 'Sports', price: 39.99, cost: 15, stock: 5, sku: 'SKU-0005', isActive: true },
        { _id: '6', name: 'Tennis Racket', category: 'Sports', price: 199.99, cost: 100, stock: 34, sku: 'SKU-0006', isActive: false },
        { _id: '7', name: 'Winter Jacket', category: 'Clothing', price: 249.99, cost: 120, stock: 67, sku: 'SKU-0007', isActive: true },
        { _id: '8', name: 'Casual T-Shirt', category: 'Clothing', price: 29.99, cost: 10, stock: 456, sku: 'SKU-0008', isActive: true },
        { _id: '9', name: 'Jeans', category: 'Clothing', price: 79.99, cost: 35, stock: 234, sku: 'SKU-0009', isActive: true },
        { _id: '10', name: 'Coffee Maker', category: 'Home & Garden', price: 89.99, cost: 40, stock: 78, sku: 'SKU-0010', isActive: true },
      ];
      setProducts(mockProducts);
      
      // Calculate stats
      const categories = new Set(mockProducts.map(p => p.category));
      setStats({
        total: mockProducts.length,
        active: mockProducts.filter(p => p.isActive).length,
        lowStock: mockProducts.filter(p => p.stock < 20).length,
        categories: categories.size,
      });
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setProductsLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Electronics: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      Clothing: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      'Home & Garden': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      Sports: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      Books: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Health & Beauty': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
      Toys: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'Food & Beverage': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const calculateMargin = (price: number, cost: number) => {
    return ((price - cost) / price * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Products</h1>
        <p className="text-muted-foreground mt-1">
          Manage your product catalog and inventory.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Products
            </CardTitle>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-500">+5%</span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Products
            </CardTitle>
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <div className="text-xs text-muted-foreground mt-2">
              {((stats.active / stats.total) * 100).toFixed(0)}% of total
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Low Stock Alert
            </CardTitle>
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lowStock}</div>
            <div className="text-xs text-muted-foreground mt-2">
              Products need restocking
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Categories
            </CardTitle>
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.categories}</div>
            <div className="text-xs text-muted-foreground mt-2">
              Product categories
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders by Category Chart */}
      <OrdersByCategoryChart data={ordersByCategory} loading={loading} />

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                  <TableHead className="text-right">Margin</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productsLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Loading products...
                    </TableCell>
                  </TableRow>
                ) : products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        <Badge className={cn('font-normal', getCategoryColor(product.category))}>
                          {product.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                      <TableCell className="text-right">{formatCurrency(product.price)}</TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {formatCurrency(product.cost)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-emerald-600 dark:text-emerald-400">
                          {calculateMargin(product.price, product.cost)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={cn(
                          product.stock < 20 && 'text-red-600 font-medium'
                        )}>
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.isActive ? 'default' : 'secondary'}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
