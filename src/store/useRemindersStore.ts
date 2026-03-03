import { create } from 'zustand';
import { Reminder } from '../types';
import { getStoredReminders, setStoredReminders } from '../services/storage';
import { defaultRemindersDisplay } from '../constants/defaultReminders';

function randomId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

interface RemindersState {
  reminders: Reminder[];
  setReminders: (r: Reminder[]) => void;
  addReminder: (r: Omit<Reminder, 'id'>) => void;
  toggleReminder: (id: string) => void;
  removeReminder: (id: string) => void;
  hydrate: () => Promise<void>;
  persist: () => Promise<void>;
}

export const useRemindersStore = create<RemindersState>((set, get) => ({
  reminders: [],
  setReminders: (reminders) => {
    set({ reminders });
    get().persist();
  },
  addReminder: (r) => {
    const reminder: Reminder = { ...r, id: randomId(), completed: false };
    set({ reminders: [...get().reminders, reminder] });
    get().persist();
  },
  toggleReminder: (id) => {
    set({
      reminders: get().reminders.map((x) =>
        x.id === id ? { ...x, completed: !x.completed } : x
      ),
    });
    get().persist();
  },
  removeReminder: (id) => {
    set({ reminders: get().reminders.filter((x) => x.id !== id) });
    get().persist();
  },
  hydrate: async () => {
    const raw = await getStoredReminders();
    if (raw) {
      try {
        const reminders = JSON.parse(raw) as Reminder[];
        set({ reminders });
      } catch {
        set({ reminders: [] });
      }
    } else {
      const seeded = defaultRemindersDisplay.map((r) => ({
        id: r.id,
        title: r.title,
        time: r.time,
        completed: r.completed,
        iconType: r.iconType,
      }));
      set({ reminders: seeded });
      await setStoredReminders(JSON.stringify(seeded));
    }
  },
  persist: async () => {
    await setStoredReminders(JSON.stringify(get().reminders));
  },
}));
