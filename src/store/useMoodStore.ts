import { create } from 'zustand';
import { TOKEN_KEYS } from '../constants';
import { createMood, listMoods } from '../services/api/moods';
import {
  apiMoodToLocal,
  localMoodToCreatePayload,
  mergeMoodEntries,
} from '../services/api/healthMapper';
import { getMoodEntries, setMoodEntries, secureStorage } from '../services/storage';

export type MoodType =
  | 'tired'
  | 'sleepy'
  | 'confused'
  | 'sad'
  | 'anxious'
  | 'stressed'
  | 'happy'
  | 'ok';

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
  syncFromApi: () => Promise<void>;
  clear: () => Promise<void>;
}

async function hasAccessToken(): Promise<boolean> {
  const token = await secureStorage.getToken(TOKEN_KEYS.ACCESS);
  return Boolean(token);
}

async function loadLocalEntries(): Promise<MoodEntry[]> {
  const raw = await getMoodEntries();
  if (!raw) return [];
  try {
    return JSON.parse(raw) as MoodEntry[];
  } catch {
    return [];
  }
}

export const useMoodStore = create<MoodState>((set, get) => ({
  entries: [],

  addEntry: async (mood, note) => {
    const entry: MoodEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      mood,
      timestamp: Date.now(),
      note,
    };
    const next = [entry, ...get().entries];
    set({ entries: next });
    await setMoodEntries(JSON.stringify(next));

    if (await hasAccessToken()) {
      try {
        const api = await createMood(localMoodToCreatePayload(entry));
        const synced = apiMoodToLocal(api);
        set({
          entries: get().entries.map((x) => (x.id === entry.id ? synced : x)),
        });
        await setMoodEntries(JSON.stringify(get().entries));
      } catch (error) {
        console.error('Failed to sync mood entry:', error);
      }
    }
  },

  removeEntry: async (id) => {
    const next = get().entries.filter((x) => x.id !== id);
    set({ entries: next });
    await setMoodEntries(JSON.stringify(next));
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
      const remote = (await listMoods()).map(apiMoodToLocal);
      const merged = mergeMoodEntries(local, remote);
      set({ entries: merged });
      await setMoodEntries(JSON.stringify(merged));
    } catch (error) {
      console.error('Failed to sync moods from API:', error);
      set({ entries: local });
    }
  },

  clear: async () => {
    set({ entries: [] });
    await setMoodEntries(JSON.stringify([]));
  },
}));
