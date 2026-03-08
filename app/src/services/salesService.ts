import api from './api';
import type { OrderLocation, Sale, SalesResponse, SalesFilter, FilterOptions } from '@/types';

export const salesService = {
  getSales: async (filters?: SalesFilter & { page?: number; limit?: number; sort?: string }): Promise<SalesResponse> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    
    const response = await api.get(`/sales?${params.toString()}`);
    return response.data;
  },

  getSale: async (id: string): Promise<{ success: boolean; data: Sale }> => {
    const response = await api.get(`/sales/${id}`);
    return response.data;
  },

  createSale: async (saleData: Omit<Sale, '_id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; data: Sale }> => {
    const response = await api.post('/sales', saleData);
    return response.data;
  },

  updateSale: async (id: string, saleData: Partial<Sale>): Promise<{ success: boolean; data: Sale }> => {
    const response = await api.put(`/sales/${id}`, saleData);
    return response.data;
  },

  deleteSale: async (id: string): Promise<{ success: boolean; data: {} }> => {
    const response = await api.delete(`/sales/${id}`);
    return response.data;
  },

  getFilterOptions: async (): Promise<{ success: boolean; data: FilterOptions }> => {
    const response = await api.get('/sales/filters/options');
    return response.data;
  },

  getOrderLocations: async (): Promise<{ success: boolean; data: OrderLocation[] }> => {
    const response = await api.get('/orders/locations');
    return response.data;
  },
};
