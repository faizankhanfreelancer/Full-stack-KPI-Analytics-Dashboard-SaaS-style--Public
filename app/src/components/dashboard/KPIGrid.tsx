import React from 'react';
import { KPICard } from './KPICard';
import type { KPIMetrics } from '@/types';

interface KPIGridProps {
  metrics: KPIMetrics | null;
  loading?: boolean;
}

export const KPIGrid: React.FC<KPIGridProps> = ({ metrics, loading }) => {
  if (loading || !metrics) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-32 bg-card rounded-lg border border-border animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <KPICard
        title="Total Revenue"
        metric={metrics.totalRevenue}
        icon="revenue"
        format="currency"
      />
      <KPICard
        title="Total Orders"
        metric={metrics.totalOrders}
        icon="orders"
        format="number"
      />
      <KPICard
        title="Total Profit"
        metric={metrics.totalProfit}
        icon="profit"
        format="currency"
      />
      <KPICard
        title="Avg Order Value"
        metric={metrics.avgOrderValue}
        icon="aov"
        format="currency"
      />
      <KPICard
        title="Active Customers"
        metric={metrics.activeCustomers}
        icon="customers"
        format="number"
      />
      <KPICard
        title="Conversion Rate"
        metric={metrics.conversionRate}
        icon="conversion"
        format="percentage"
      />
    </div>
  );
};
