import { create } from 'zustand';
import { getMoodEntries, setMoodEntries } from '../services/storage';

export type MoodType = 'tired' | 'sleepy' | 'confused' | 'sad' | 'anxious' | 'stressed' | 'happy' | 'ok';

export interface MoodEntry {
  id: string;
  mood: MoodType;
  timestamp: number;
  note?: string;
}

interface MoodState {
  entries: MoodEntry[];
  addEntry: (mood: MoodType, note?: string) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
  hydrate: () => Promise<void>;
  clear: () => Promise<void>;
}

export const useMoodStore = create<MoodState>((set, get) => ({
  entries: [],
  addEntry: async (mood, note) => {
    const e = { id: `${Date.now()}`, mood, timestamp: Date.now(), note } as MoodEntry;
    const next = [e, ...get().entries];
    set({ entries: next });
    try {
      await setMoodEntries(JSON.stringify(next));
    } catch {}
  },
  removeEntry: async (id) => {
    const next = get().entries.filter((x) => x.id !== id);
    set({ entries: next });
    try {
      await setMoodEntries(JSON.stringify(next));
    } catch {}
  },
  hydrate: async () => {
    try {
      const raw = await getMoodEntries();
      if (raw) {
        const parsed = JSON.parse(raw) as MoodEntry[];
        set({ entries: parsed });
      }
    } catch {
      set({ entries: [] });
    }
  },
  clear: async () => {
    set({ entries: [] });
    try {
      await setMoodEntries(JSON.stringify([]));
    } catch {}
  },
}));
