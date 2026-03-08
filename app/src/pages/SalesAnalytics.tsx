import React from 'react';
import { MonthlyRevenueChart } from '@/components/charts/MonthlyRevenueChart';
import { DailyOrdersChart } from '@/components/charts/DailyOrdersChart';
import { SalesByRegionChart } from '@/components/charts/SalesByRegionChart';
import { useKPI } from '@/hooks/useKPI';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, BarChart3 } from 'lucide-react';

export const SalesAnalytics: React.FC = () => {
  const { metrics, monthlyRevenue, salesByRegion, dailyOrders, loading } = useKPI();

  const formatCurrency = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numValue);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Sales Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Detailed analysis of your sales performance and trends.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics ? formatCurrency(metrics.totalRevenue.value) : '-'}
            </div>
            <div className="flex items-center gap-1 mt-2">
              {metrics?.totalRevenue.trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className={metrics?.totalRevenue.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}>
                {metrics ? Math.abs(parseFloat(metrics.totalRevenue.change)).toFixed(1) : 0}%
              </span>
              <span className="text-xs text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics ? new Intl.NumberFormat('en-US').format(Number(metrics.totalOrders.value)) : '-'}
            </div>
            <div className="flex items-center gap-1 mt-2">
              {metrics?.totalOrders.trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className={metrics?.totalOrders.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}>
                {metrics ? Math.abs(parseFloat(metrics.totalOrders.change)).toFixed(1) : 0}%
              </span>
              <span className="text-xs text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Order Value
            </CardTitle>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics ? formatCurrency(metrics.avgOrderValue.value) : '-'}
            </div>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-xs text-muted-foreground">Per transaction</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Conversion Rate
            </CardTitle>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics ? `${Number(metrics.conversionRate.value).toFixed(1)}%` : '-'}
            </div>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-xs text-muted-foreground">Of total visitors</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyRevenueChart data={monthlyRevenue} loading={loading} />
        <SalesByRegionChart data={salesByRegion} loading={loading} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <DailyOrdersChart data={dailyOrders} loading={loading} />
      </div>
    </div>
  );
};
