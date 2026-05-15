import { create } from 'zustand';
import { TOKEN_KEYS } from '../constants';
import { createSymptom, listSymptoms } from '../services/api/symptoms';
import {
  apiSymptomToLocal,
  localSymptomToCreatePayload,
  mergeSymptomEntries,
} from '../services/api/healthMapper';
import { getSymptomEntries, setSymptomEntries, secureStorage } from '../services/storage';

export interface SymptomEntry {
  id: string;
  date: string; // ISO date
  symptoms: Record<string, boolean>;
  notes?: string;
  sleepHours?: number;
  painLevel?: number;
  foodNote?: string;
}

interface SymptomsState {
  entries: SymptomEntry[];
  addEntry: (
    e: Omit<SymptomEntry, 'id' | 'date'> & { date?: string; category?: string }
  ) => Promise<void>;
  hydrate: () => Promise<void>;
  syncFromApi: () => Promise<void>;
  persist: () => Promise<void>;
  clearAll: () => Promise<void>;
}

function newLocalId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

async function hasAccessToken(): Promise<boolean> {
  const token = await secureStorage.getToken(TOKEN_KEYS.ACCESS);
  return Boolean(token);
}

async function loadLocalEntries(): Promise<SymptomEntry[]> {
  const raw = await getSymptomEntries();
  if (!raw) return [];
  try {
    return JSON.parse(raw) as SymptomEntry[];
  } catch {
    return [];
  }
}

export const useSymptomsStore = create<SymptomsState>((set, get) => ({
  entries: [],

  addEntry: async (e) => {
    const entry: SymptomEntry = {
      id: newLocalId(),
      date: e.date ? new Date(e.date).toISOString() : new Date().toISOString(),
      symptoms: e.symptoms,
      notes: e.notes,
      sleepHours: e.sleepHours,
      painLevel: e.painLevel,
      foodNote: e.foodNote,
    };

    set({ entries: [...get().entries, entry] });
    await get().persist();

    if (await hasAccessToken()) {
      try {
        const api = await createSymptom(
          localSymptomToCreatePayload(entry, e.category ?? 'warning_signs')
        );
        const synced = apiSymptomToLocal(api);
        const merged = get().entries.map((x) => (x.id === entry.id ? synced : x));
        set({ entries: merged });
        await get().persist();
      } catch (error) {
        console.error('Failed to sync symptom entry:', error);
      }
    }
  },

  hydrate: async () => {
    if (await hasAccessToken()) {
      await get().syncFromApi();
      return;
    }
    set({ entries: await loadLocalEntries() });
  },

  syncFromApi: async () => {
    if (!(await hasAccessToken())) return;

    const local = await loadLocalEntries();
    try {
      const from = new Date();
      from.setDate(from.getDate() - 30);
      const remote = (await listSymptoms({ from: from.toISOString() })).map(apiSymptomToLocal);
      const merged = mergeSymptomEntries(local, remote);
      set({ entries: merged });
      await setSymptomEntries(JSON.stringify(merged));
    } catch (error) {
      console.error('Failed to sync symptoms from API:', error);
      set({ entries: local });
    }
  },

  persist: async () => {
    await setSymptomEntries(JSON.stringify(get().entries));
  },

  clearAll: async () => {
    set({ entries: [] });
    await setSymptomEntries(JSON.stringify([]));
  },
}));
