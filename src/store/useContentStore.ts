import { create } from 'zustand';
import {
  fetchAppContent,
  type AppContent,
  type CheckInCategory,
  type ChatConfig,
  type HomeAction,
  type MoodOption,
  type SymptomOption,
} from '../services/api/content';
import { storage } from '../services/storage';

const CONTENT_CACHE_KEY = '@wunally/app_content';

const FALLBACK: AppContent = {
  check_in_categories: [],
  symptom_catalogs: {},
  moods: [],
  home_actions: [],
  chat: {
    welcome_message: 'Hi! How can I support you today?',
    voice_prompts: ["I'd like some support.", 'Can you give me a quick tip?'],
    input_placeholder: 'Type your message...',
  },
  chat_support_options: [],
};

interface ContentState {
  loaded: boolean;
  content: AppContent;
  hydrate: () => Promise<void>;
  getSymptoms: (category: string) => SymptomOption[];
  getCategory: (id: string) => CheckInCategory | undefined;
}

async function loadCache(): Promise<AppContent | null> {
  const raw = await storage.getItem(CONTENT_CACHE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AppContent;
  } catch {
    return null;
  }
}

async function saveCache(content: AppContent): Promise<void> {
  await storage.setItem(CONTENT_CACHE_KEY, JSON.stringify(content));
}

export const useContentStore = create<ContentState>((set, get) => ({
  loaded: false,
  content: FALLBACK,

  hydrate: async () => {
    const cached = await loadCache();
    if (cached) {
      set({ content: cached, loaded: true });
    }

    try {
      const fresh = await fetchAppContent();
      await saveCache(fresh);
      set({ content: fresh, loaded: true });
    } catch (error) {
      console.warn('Failed to fetch app content:', error);
      if (!cached) {
        set({ content: FALLBACK, loaded: true });
      }
    }
  },

  getSymptoms: (category: string) => get().content.symptom_catalogs[category] ?? [],

  getCategory: (id: string) =>
    get().content.check_in_categories.find((c) => c.id === id),
}));

export type { CheckInCategory, HomeAction, MoodOption, SymptomOption, ChatConfig };
