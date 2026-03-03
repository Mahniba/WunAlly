import { create } from 'zustand';
import { UserProfile } from '../types';
import { getStoredProfile, setStoredProfile } from '../services/storage';

interface ProfileState {
  profile: UserProfile | null;
  setProfile: (p: UserProfile | null) => void;
  hydrate: () => Promise<void>;
  persist: () => Promise<void>;
}

const defaultProfile: UserProfile = {
  name: '',
  age: '',
  weeksPregnant: 24,
  dueDate: '',
  healthConditions: '',
};

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  setProfile: (profile) => set({ profile: profile ?? null }),
  hydrate: async () => {
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
  persist: async () => {
    const { profile } = get();
    if (profile) await setStoredProfile(JSON.stringify(profile));
  },
}));

export function getDefaultProfile(): UserProfile {
  return { ...defaultProfile };
}
