import { create } from 'zustand';
import { getSymptomEntries, setSymptomEntries } from '../services/storage';

export type SymptomKeys = 'nausea' | 'headache' | 'dizzy';

export interface SymptomEntry {
  id: string;
  date: string; // ISO date
  symptoms: Record<SymptomKeys, boolean>;
  notes?: string;
  /**
   * Lightweight wellness signals to personalize tips.
   * These are optional to remain backward-compatible with stored entries.
   */
  sleepHours?: number; // last night
  painLevel?: number; // 0-10
  foodNote?: string;
}

interface SymptomsState {
  entries: SymptomEntry[];
  addEntry: (e: Omit<SymptomEntry, 'id' | 'date'> & { date?: string }) => void;
  hydrate: () => Promise<void>;
  persist: () => Promise<void>;
  clearAll: () => void;
}

export const useSymptomsStore = create<SymptomsState>((set, get) => ({
  entries: [],
  addEntry: (e) => {
    const entry: SymptomEntry = {
      id: Math.random().toString(36).slice(2) + Date.now().toString(36),
      date: e.date ? new Date(e.date).toISOString() : new Date().toISOString(),
      symptoms: e.symptoms,
      notes: e.notes,
      sleepHours: e.sleepHours,
      painLevel: e.painLevel,
      foodNote: e.foodNote,
    };
    set({ entries: [...get().entries, entry] });
    get().persist();
  },
  hydrate: async () => {
    const raw = await getSymptomEntries();
    if (!raw) {
      set({ entries: [] });
      return;
    }
    try {
      const parsed = JSON.parse(raw) as SymptomEntry[];
      set({ entries: parsed });
    } catch {
      set({ entries: [] });
    }
  },
  persist: async () => {
    await setSymptomEntries(JSON.stringify(get().entries));
  },
  clearAll: () => {
    set({ entries: [] });
    get().persist();
  },
}));
