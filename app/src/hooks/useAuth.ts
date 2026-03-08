import { useState, useEffect, useCallback } from 'react';
import type { User, AuthState } from '@/types';
import { authService } from '@/services/authService';

const getStoredAuth = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return {
    token,
    user: user ? JSON.parse(user) : null,
  };
};

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const { token, user } = getStoredAuth();
    if (token && user) {
      setState({
        user,
        token,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
    } else {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await authService.login({ email, password });
      
      const { token, ...userData } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setState({
        user: userData as User,
        token,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
      
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, role?: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await authService.register({ name, email, password, role });
      
      const { token, ...userData } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setState({
        user: userData as User,
        token,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
      
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
  }, []);

  const updateUserPreferences = useCallback(async (preferences: { theme?: 'light' | 'dark'; notifications?: boolean }) => {
    try {
      await authService.updatePreferences(preferences);
      if (state.user) {
        const updatedUser = { ...state.user, preferences: { ...state.user.preferences, ...preferences } };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setState(prev => ({ ...prev, user: updatedUser }));
      }
    } catch (error) {
      console.error('Failed to update preferences:', error);
    }
  }, [state.user]);

  return {
    ...state,
    login,
    register,
    logout,
    updateUserPreferences,
  };
};
