import { create } from 'zustand';
import { UserProfile } from '../types';
import { STORAGE_KEYS } from '../constants';
import { getStoredProfile, setStoredProfile, storage } from '../services/storage';
import { getProfile, updateProfile } from '../services/api/profile';
import { apiProfileToUserProfile, userProfileToApiProfile } from '../services/api/profileMapper';
import { ApiError } from '../services/api/errors';
import { TOKEN_KEYS } from '../constants';
import { secureStorage } from '../services/storage';

interface ProfileState {
  profile: UserProfile | null;
  setProfile: (p: UserProfile | null) => void;
  hydrate: () => Promise<void>;
  persist: () => Promise<void>;
  syncFromApi: () => Promise<void>;
  clearProfile: () => Promise<void>;
}

const defaultProfile: UserProfile = {
  name: '',
  age: '',
  weeksPregnant: 24,
  dueDate: '',
  healthConditions: '',
  dueDateSet: false,
};

async function hasAccessToken(): Promise<boolean> {
  const token = await secureStorage.getToken(TOKEN_KEYS.ACCESS);
  return Boolean(token);
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  setProfile: (profile) => set({ profile: profile ?? null }),

  hydrate: async () => {
    if (await hasAccessToken()) {
      await get().syncFromApi();
      return;
    }

    const raw = await getStoredProfile();
    if (raw) {
      try {
        const profile = JSON.parse(raw) as UserProfile;
        set({ profile });
      } catch {
        set({ profile: null });
      }
    } else {
      set({ profile: null });
    }
  },

  syncFromApi: async () => {
    if (!(await hasAccessToken())) return;

    try {
      const api = await getProfile();
      const profile = apiProfileToUserProfile(api);
      set({ profile });
      await setStoredProfile(JSON.stringify(profile));
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        set({ profile: null });
        await storage.removeItem(STORAGE_KEYS.USER_PROFILE);
        return;
      }
      const raw = await getStoredProfile();
      if (raw) {
        try {
          set({ profile: JSON.parse(raw) as UserProfile });
        } catch {
          set({ profile: null });
        }
      }
    }
  },

  persist: async () => {
    const { profile } = get();
    if (!profile) return;

    if (await hasAccessToken()) {
      const api = await updateProfile(userProfileToApiProfile(profile));
      const updated = apiProfileToUserProfile(api);
      set({ profile: updated });
      await setStoredProfile(JSON.stringify(updated));
      return;
    }

    await setStoredProfile(JSON.stringify(profile));
  },

  clearProfile: async () => {
    set({ profile: null });
    await storage.removeItem(STORAGE_KEYS.USER_PROFILE);
  },
}));

export function getDefaultProfile(): UserProfile {
  return { ...defaultProfile };
}
