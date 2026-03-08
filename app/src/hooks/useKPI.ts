import { useState, useEffect, useCallback } from 'react';
import type { KPIMetrics, ChartData, SalesFilter } from '@/types';
import { kpiService } from '@/services/kpiService';

export const useKPI = (filters?: SalesFilter) => {
  const [metrics, setMetrics] = useState<KPIMetrics | null>(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState<ChartData[]>([]);
  const [ordersByCategory, setOrdersByCategory] = useState<ChartData[]>([]);
  const [salesByRegion, setSalesByRegion] = useState<ChartData[]>([]);
  const [customerGrowth, setCustomerGrowth] = useState<ChartData[]>([]);
  const [dailyOrders, setDailyOrders] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        metricsRes,
        monthlyRes,
        categoryRes,
        regionRes,
        growthRes,
        dailyRes
      ] = await Promise.all([
        kpiService.getKPIMetrics(filters),
        kpiService.getMonthlyRevenue(),
        kpiService.getOrdersByCategory(filters),
        kpiService.getSalesByRegion(filters),
        kpiService.getCustomerGrowth(),
        kpiService.getDailyOrders()
      ]);

      console.log('KPI Data Response:', {
        metrics: metricsRes,
        monthly: monthlyRes,
        category: categoryRes,
        region: regionRes,
        growth: growthRes,
        daily: dailyRes
      });

      setMetrics(metricsRes.data);
      setMonthlyRevenue(monthlyRes.data || []);
      setOrdersByCategory(categoryRes.data || []);
      setSalesByRegion(regionRes.data || []);
      setCustomerGrowth(growthRes.data || []);
      setDailyOrders(dailyRes.data || []);
    } catch (err: any) {
      console.error('KPI Fetch Error:', err);
      setError(err.response?.data?.error || 'Failed to fetch KPI data');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const refetch = useCallback(() => {
    fetchAllData();
  }, [fetchAllData]);

  return {
    metrics,
    monthlyRevenue,
    ordersByCategory,
    salesByRegion,
    customerGrowth,
    dailyOrders,
    loading,
    error,
    refetch,
  };
};
