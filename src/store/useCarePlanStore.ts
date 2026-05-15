import { create } from 'zustand';
import { STORAGE_KEYS } from '../constants';
import { getCarePlan, updateCarePlan } from '../services/api/carePlan';
import { ApiError } from '../services/api/errors';
import { hasAccessToken } from '../services/api/session';
import { storage } from '../services/storage';

interface CarePlanState {
  medical: string;
  labourPrefs: string;
  loading: boolean;
  hydrate: () => Promise<void>;
  save: (medical: string, labourPrefs: string) => Promise<void>;
  syncFromApi: () => Promise<void>;
  clear: () => Promise<void>;
}

async function loadLocal(): Promise<{ medical: string; labourPrefs: string }> {
  try {
    const raw = await storage.getItem(STORAGE_KEYS.CARE_PLAN_NOTES);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        medical: parsed.medical ?? '',
        labourPrefs: parsed.labourPrefs ?? '',
      };
    }
  } catch {
    // ignore
  }
  return { medical: '', labourPrefs: '' };
}

async function saveLocal(medical: string, labourPrefs: string): Promise<void> {
  await storage.setItem(
    STORAGE_KEYS.CARE_PLAN_NOTES,
    JSON.stringify({ medical, labourPrefs })
  );
}

export const useCarePlanStore = create<CarePlanState>((set, get) => ({
  medical: '',
  labourPrefs: '',
  loading: false,

  hydrate: async () => {
    set({ loading: true });
    try {
      if (await hasAccessToken()) {
        await get().syncFromApi();
      } else {
        const local = await loadLocal();
        set(local);
      }
    } finally {
      set({ loading: false });
    }
  },

  syncFromApi: async () => {
    if (!(await hasAccessToken())) return;

    try {
      const api = await getCarePlan();
      set({
        medical: api.medical ?? '',
        labourPrefs: api.labour_preferences ?? '',
      });
      await saveLocal(api.medical ?? '', api.labour_preferences ?? '');
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        const local = await loadLocal();
        set(local);
        return;
      }
      const local = await loadLocal();
      set(local);
    }
  },

  save: async (medical, labourPrefs) => {
    set({ medical, labourPrefs });
    await saveLocal(medical, labourPrefs);

    if (await hasAccessToken()) {
      const api = await updateCarePlan({
        medical,
        labour_preferences: labourPrefs,
      });
      set({
        medical: api.medical ?? '',
        labourPrefs: api.labour_preferences ?? '',
      });
      await saveLocal(api.medical ?? '', api.labour_preferences ?? '');
    }
  },

  clear: async () => {
    set({ medical: '', labourPrefs: '' });
    await storage.removeItem(STORAGE_KEYS.CARE_PLAN_NOTES);
  },
}));
