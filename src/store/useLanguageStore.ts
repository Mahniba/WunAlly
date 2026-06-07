import { create } from 'zustand';
import { getLanguageChosen, getOnboardingDone, setLanguageChosen } from '../services/storage';

interface LanguageState {
  chosen: boolean | null;
  hydrate: () => Promise<void>;
  markChosen: () => Promise<void>;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  chosen: null,
  hydrate: async () => {
    let chosen = await getLanguageChosen();
    // Existing users who completed onboarding before the language screen was added.
    if (!chosen && (await getOnboardingDone())) {
      await setLanguageChosen();
      chosen = true;
    }
    set({ chosen });
  },
  markChosen: async () => {
    await setLanguageChosen();
    set({ chosen: true });
  },
}));
