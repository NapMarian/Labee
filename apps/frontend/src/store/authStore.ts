import { create } from 'zustand';
import { User, UserType } from '@/types';
import api from '@/lib/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  clearError: () => void;
}

interface RegisterData {
  email: string;
  password: string;
  userType: UserType;
  name: string;
  location?: string;
  companyName?: string;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post<any>('/auth/login', { email, password });

      if (response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data;
        api.setTokens(accessToken, refreshToken);
        set({ user, isAuthenticated: true, isLoading: false });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  register: async (data: RegisterData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post<any>('/auth/register', data);

      if (response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data;
        api.setTokens(accessToken, refreshToken);
        set({ user, isAuthenticated: true, isLoading: false });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al registrarse';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      api.clearTokens();
      set({ user: null, isAuthenticated: false });
    }
  },

  fetchUser: async () => {
    const token = api.getAccessToken();
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }

    set({ isLoading: true });
    try {
      const response = await api.get<User>('/auth/me');
      if (response.success && response.data) {
        set({ user: response.data, isAuthenticated: true, isLoading: false });
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      api.clearTokens();
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
