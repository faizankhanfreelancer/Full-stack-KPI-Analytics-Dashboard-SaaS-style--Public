import { useState, useEffect, useCallback } from 'react';
import type { Sale, SalesFilter, FilterOptions } from '@/types';
import { salesService } from '@/services/salesService';

export const useSales = (initialFilters?: SalesFilter) => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    total: 0,
  });
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    categories: [],
    regions: [],
    salespeople: [],
    products: [],
  });
  const [filters, setFilters] = useState<SalesFilter>(initialFilters || {});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSales = useCallback(async (page = 1, limit = 10, sort = '-date') => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await salesService.getSales({
        ...filters,
        page,
        limit,
        sort,
      });
      
      setSales(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch sales data');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchFilterOptions = useCallback(async () => {
    try {
      const response = await salesService.getFilterOptions();
      setFilterOptions(response.data);
    } catch (err) {
      console.error('Failed to fetch filter options:', err);
    }
  }, []);

  useEffect(() => {
    fetchSales();
    fetchFilterOptions();
  }, [fetchSales, fetchFilterOptions]);

  const updateFilters = useCallback((newFilters: SalesFilter) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const createSale = useCallback(async (saleData: Omit<Sale, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await salesService.createSale(saleData);
      await fetchSales();
      await fetchFilterOptions();
      return { success: true, data: response.data };
    } catch (err: any) {
      // include network or message-based errors if response not defined
      const errorMsg =
        err.response?.data?.error || err.message || 'Failed to create sale';
      return { success: false, error: errorMsg };
    }
  }, [fetchSales]);

  const updateSale = useCallback(async (id: string, saleData: Partial<Sale>) => {
    try {
      const response = await salesService.updateSale(id, saleData);
      await fetchSales();
      await fetchFilterOptions();
      return { success: true, data: response.data };
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error || err.message || 'Failed to update sale';
      return { success: false, error: errorMsg };
    }
  }, [fetchSales]);

  const deleteSale = useCallback(async (id: string) => {
    try {
      await salesService.deleteSale(id);
      await fetchSales();
      await fetchFilterOptions();
      return { success: true };
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error || err.message || 'Failed to delete sale';
      return { success: false, error: errorMsg };
    }
  }, [fetchSales]);

  return {
    sales,
    pagination,
    filterOptions,
    filters,
    loading,
    error,
    fetchSales,
    updateFilters,
    clearFilters,
    createSale,
    updateSale,
    deleteSale,
  };
};
