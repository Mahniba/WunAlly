import { create } from 'zustand';
import { getOnboardingDone, setOnboardingDone } from '../services/storage';

interface OnboardingState {
  done: boolean | null;
  setDone: (value: boolean) => void;
  hydrate: () => Promise<void>;
  complete: () => Promise<void>;
}

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  done: null,
  setDone: (done) => set({ done }),
  hydrate: async () => {
    const done = await getOnboardingDone();
    set({ done });
  },
  complete: async () => {
    await setOnboardingDone();
    set({ done: true });
  },
}));
