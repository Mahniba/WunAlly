import { create } from 'zustand';
import { storage } from '../services/storage';

interface AuthState {
  isAuthenticated: boolean;
  user: { id: string; email: string; name: string } | null;
  loading: boolean;
  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

const AUTH_KEY = '@wunally/auth_user';

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  loading: true,

  hydrate: async () => {
    try {
      set({ loading: true });
      const storedAuth = await storage.getItem(AUTH_KEY);
      if (storedAuth) {
        const user = JSON.parse(storedAuth);
        set({ user, isAuthenticated: true });
      }
    } catch (error) {
      console.error('Failed to hydrate auth:', error);
    } finally {
      set({ loading: false });
    }
  },

  login: async (email: string, password: string) => {
    try {
      set({ loading: true });
      // TODO: Call your auth API here
      // Example: const response = await authAPI.login(email, password);
      const mockUser = {
        id: '123',
        email,
        name: email.split('@')[0],
      };
      await storage.setItem(AUTH_KEY, JSON.stringify(mockUser));
      set({ user: mockUser, isAuthenticated: true });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signUp: async (email: string, password: string, name: string) => {
    try {
      set({ loading: true });
      // TODO: Call your auth API here
      // Example: const response = await authAPI.signUp(email, password, name);
      const mockUser = { id: '123', email, name };
      await storage.setItem(AUTH_KEY, JSON.stringify(mockUser));
      set({ user: mockUser, isAuthenticated: true });
    } catch (error) {
      console.error('Sign up failed:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      set({ loading: true });
      // TODO: Call your logout API here
      await storage.removeItem(AUTH_KEY);
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  setLoading: (loading: boolean) => set({ loading }),
}));
