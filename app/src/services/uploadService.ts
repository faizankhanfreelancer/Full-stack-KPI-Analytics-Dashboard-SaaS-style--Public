import api from './api';

export const uploadService = {
  uploadSales: async (file: File): Promise<{ success: boolean; message: string; imported: number; errors?: string[] }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/upload/sales', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  exportSales: async (format: 'xlsx' | 'csv' = 'xlsx', filters?: { startDate?: string; endDate?: string; category?: string; region?: string }): Promise<Blob> => {
    const params = new URLSearchParams();
    params.append('format', format);
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    
    const response = await api.get(`/upload/export?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  getTemplate: async (): Promise<Blob> => {
    const response = await api.get('/upload/template', {
      responseType: 'blob',
    });
    return response.data;
  },
};
