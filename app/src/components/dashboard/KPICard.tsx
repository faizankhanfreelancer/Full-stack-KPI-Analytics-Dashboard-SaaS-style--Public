import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Percent, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { KPIMetric } from '@/types';

interface KPICardProps {
  title: string;
  metric: KPIMetric;
  icon: 'revenue' | 'orders' | 'profit' | 'customers' | 'conversion' | 'aov';
  format?: 'currency' | 'number' | 'percentage';
}

const iconMap = {
  revenue: DollarSign,
  orders: ShoppingCart,
  profit: DollarSign,
  customers: Users,
  conversion: Percent,
  aov: Activity,
};

const formatValue = (value: number | string, format?: string): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (format === 'currency') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numValue);
  }
  
  if (format === 'percentage') {
    return `${numValue.toFixed(1)}%`;
  }
  
  return new Intl.NumberFormat('en-US').format(numValue);
};

export const KPICard: React.FC<KPICardProps> = ({
  title,
  metric,
  icon,
  format = 'number',
}) => {
  const Icon = iconMap[icon];
  const isPositive = metric.trend === 'up';
  const changeValue = parseFloat(metric.change);

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">
          {formatValue(metric.value, format)}
        </div>
        <div className="flex items-center gap-1 mt-2">
          <div
            className={cn(
              'flex items-center gap-0.5 text-xs font-medium',
              isPositive ? 'text-emerald-500' : 'text-red-500'
            )}
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>{Math.abs(changeValue).toFixed(1)}%</span>
          </div>
          <span className="text-xs text-muted-foreground">vs last period</span>
        </div>
      </CardContent>
    </Card>
  );
};
