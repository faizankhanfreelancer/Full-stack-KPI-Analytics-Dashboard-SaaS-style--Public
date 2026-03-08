import api from './api';
import type { User } from '@/types';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

interface AuthResponse {
  success: boolean;
  data: {
    id: string;
    name: string;
    email: string;
    role: string;
    preferences: {
      theme: 'light' | 'dark';
      notifications: boolean;
    };
    token: string;
  };
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  getMe: async (): Promise<{ success: boolean; data: User }> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updatePreferences: async (preferences: { theme?: string; notifications?: boolean }): Promise<{ success: boolean; data: any }> => {
    const response = await api.put('/auth/preferences', preferences);
    return response.data;
  },

  forgotPassword: async (email: string): Promise<{ success: boolean; data: string }> => {
    const response = await api.post('/auth/forgotpassword', { email });
    return response.data;
  },
};
