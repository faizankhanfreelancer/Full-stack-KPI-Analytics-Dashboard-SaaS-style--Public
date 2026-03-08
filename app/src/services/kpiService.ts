import api from './api';
import type { KPIMetrics, ChartData, SalesFilter } from '@/types';

export const kpiService = {
  getKPIMetrics: async (filters?: SalesFilter): Promise<{ success: boolean; data: KPIMetrics }> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    
    const response = await api.get(`/kpi/metrics?${params.toString()}`);
    return response.data;
  },

  getMonthlyRevenue: async (year?: number): Promise<{ success: boolean; data: ChartData[] }> => {
    const params = year ? `?year=${year}` : '';
    const response = await api.get(`/kpi/monthly-revenue${params}`);
    return response.data;
  },

  getOrdersByCategory: async (filters?: SalesFilter): Promise<{ success: boolean; data: ChartData[] }> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && (key === 'startDate' || key === 'endDate')) {
          params.append(key, String(value));
        }
      });
    }
    
    const response = await api.get(`/kpi/orders-by-category?${params.toString()}`);
    return response.data;
  },

  getSalesByRegion: async (filters?: SalesFilter): Promise<{ success: boolean; data: ChartData[] }> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && (key === 'startDate' || key === 'endDate')) {
          params.append(key, String(value));
        }
      });
    }
    
    const response = await api.get(`/kpi/sales-by-region?${params.toString()}`);
    return response.data;
  },

  getCustomerGrowth: async (year?: number): Promise<{ success: boolean; data: ChartData[] }> => {
    const params = year ? `?year=${year}` : '';
    const response = await api.get(`/kpi/customer-growth${params}`);
    return response.data;
  },

  getDailyOrders: async (days?: number): Promise<{ success: boolean; data: ChartData[] }> => {
    const params = days ? `?days=${days}` : '';
    const response = await api.get(`/kpi/daily-orders${params}`);
    return response.data;
  },
};
