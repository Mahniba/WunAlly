import { create } from 'zustand';
import * as authApi from '../services/api/auth';
import { restoreSession, clearTokens } from '../services/api/client';
import { getErrorMessage } from '../services/api/errors';
import { TOKEN_KEYS } from '../constants';
import { storage, secureStorage } from '../services/storage';
import { useProfileStore } from './useProfileStore';
import { useSymptomsStore } from './useSymptomsStore';
import { useMoodStore } from './useMoodStore';
import { useRemindersStore } from './useRemindersStore';
import { useContactsStore } from './useContactsStore';
import { useCarePlanStore } from './useCarePlanStore';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  loading: boolean;
  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

const AUTH_USER_KEY = '@wunally/auth_user';

function normalizeUser(raw: { id: string | number; email: string; name: string }): AuthUser {
  return {
    id: String(raw.id),
    email: raw.email,
    name: raw.name,
  };
}

async function persistUser(user: AuthUser): Promise<void> {
  await storage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

/** Clear login state only (keep local health data for offline use). */
async function clearAuthOnly(): Promise<void> {
  await clearTokens();
  await storage.removeItem(AUTH_USER_KEY);
}

async function clearSession(): Promise<void> {
  await clearAuthOnly();
  await useProfileStore.getState().clearProfile();
  await useSymptomsStore.getState().clearAll();
  await useMoodStore.getState().clear();
  await useRemindersStore.getState().clearAll();
  await useContactsStore.getState().clearAll();
  await useCarePlanStore.getState().clear();
}

async function syncUserData(): Promise<void> {
  await Promise.all([
    useSymptomsStore.getState().syncFromApi(),
    useMoodStore.getState().syncFromApi(),
    useRemindersStore.getState().syncFromApi(),
    useContactsStore.getState().syncFromApi(),
    useCarePlanStore.getState().syncFromApi(),
  ]);
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  loading: true,

  hydrate: async () => {
    try {
      set({ loading: true });

      const stored = await storage.getItem(AUTH_USER_KEY);
      const refresh = await secureStorage.getToken(TOKEN_KEYS.REFRESH);

      if (!stored || !refresh) {
        set({ user: null, isAuthenticated: false });
        return;
      }

      const user = normalizeUser(JSON.parse(stored));
      // Restore UI immediately from local session
      set({ user, isAuthenticated: true });

      const session = await restoreSession();
      if (session === 'invalid') {
        await clearAuthOnly();
        set({ user: null, isAuthenticated: false });
        return;
      }

      // Sync when online; offline keeps cached data
      if (session === 'ok') {
        try {
          await useProfileStore.getState().syncFromApi();
          await syncUserData();
        } catch (error) {
          console.warn('Background sync after hydrate failed:', error);
        }
      }
    } catch (error) {
      console.error('Failed to hydrate auth:', error);
      // Do not wipe all local data on hydrate errors
      const stored = await storage.getItem(AUTH_USER_KEY);
      const refresh = await secureStorage.getToken(TOKEN_KEYS.REFRESH);
      if (stored && refresh) {
        try {
          set({
            user: normalizeUser(JSON.parse(stored)),
            isAuthenticated: true,
          });
        } catch {
          await clearAuthOnly();
          set({ user: null, isAuthenticated: false });
        }
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } finally {
      set({ loading: false });
    }
  },

  login: async (email: string, password: string) => {
    try {
      set({ loading: true });
      const data = await authApi.login({
        email: email.trim().toLowerCase(),
        password,
      });
      const user = normalizeUser(data.user);
      await persistUser(user);
      set({ user, isAuthenticated: true });
      await useProfileStore.getState().syncFromApi();
      await syncUserData();
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Login failed. Please try again.'));
    } finally {
      set({ loading: false });
    }
  },

  signUp: async (email: string, password: string, name: string) => {
    try {
      set({ loading: true });
      const data = await authApi.register({
        email: email.trim().toLowerCase(),
        password,
        name: name.trim(),
      });
      const user = normalizeUser(data.user);
      await persistUser(user);
      set({ user, isAuthenticated: true });
      useProfileStore.getState().setProfile(null);
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Sign up failed. Please try again.'));
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      set({ loading: true });
      await authApi.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      await clearSession();
      set({ user: null, isAuthenticated: false, loading: false });
    }
  },

  setLoading: (loading: boolean) => set({ loading }),
}));
