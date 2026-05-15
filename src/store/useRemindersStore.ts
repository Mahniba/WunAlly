import { create } from 'zustand';
import { Reminder } from '../types';
import {
  createReminder,
  deleteReminder,
  listReminders,
  updateReminder,
} from '../services/api/reminders';
import {
  apiReminderToLocal,
  localReminderToCreatePayload,
  mergeReminders,
  type ReminderLocal,
} from '../services/api/careMapper';
import { hasAccessToken } from '../services/api/session';
import { getStoredReminders, setStoredReminders } from '../services/storage';

function randomId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

interface RemindersState {
  reminders: ReminderLocal[];
  setReminders: (r: Reminder[]) => void;
  addReminder: (r: Omit<Reminder, 'id' | 'completed'>) => Promise<void>;
  toggleReminder: (id: string) => Promise<void>;
  removeReminder: (id: string) => Promise<void>;
  hydrate: () => Promise<void>;
  syncFromApi: () => Promise<void>;
  persist: () => Promise<void>;
  clearAll: () => Promise<void>;
}

async function loadLocal(): Promise<ReminderLocal[]> {
  const raw = await getStoredReminders();
  if (!raw) return [];
  try {
    return JSON.parse(raw) as ReminderLocal[];
  } catch {
    return [];
  }
}

async function uploadMissing(local: ReminderLocal[], remote: ReminderLocal[]): Promise<ReminderLocal[]> {
  const remoteIds = new Set(remote.map((r) => r.id));
  const uploaded: ReminderLocal[] = [];
  for (const item of local) {
    if (remoteIds.has(item.id)) continue;
    try {
      const api = await createReminder(localReminderToCreatePayload(item));
      uploaded.push(apiReminderToLocal(api));
    } catch (e) {
      console.error('Failed to upload reminder:', e);
      uploaded.push(item);
    }
  }
  return uploaded;
}

export const useRemindersStore = create<RemindersState>((set, get) => ({
  reminders: [],

  setReminders: (reminders) => {
    set({ reminders: reminders as ReminderLocal[] });
    get().persist();
  },

  addReminder: async (r) => {
    const reminder: ReminderLocal = {
      ...r,
      id: randomId(),
      completed: false,
      iconType: r.iconType ?? 'general',
    };
    set({ reminders: [...get().reminders, reminder] });
    await get().persist();

    if (await hasAccessToken()) {
      try {
        const api = await createReminder(localReminderToCreatePayload(reminder));
        const synced = apiReminderToLocal(api);
        set({
          reminders: get().reminders.map((x) => (x.id === reminder.id ? synced : x)),
        });
        await get().persist();
      } catch (e) {
        console.error('Failed to sync new reminder:', e);
      }
    }
  },

  toggleReminder: async (id) => {
    const current = get().reminders.find((x) => x.id === id);
    if (!current) return;

    const updated = { ...current, completed: !current.completed };
    set({
      reminders: get().reminders.map((x) => (x.id === id ? updated : x)),
    });
    await get().persist();

    if (await hasAccessToken() && updated.serverId) {
      try {
        const api = await updateReminder(updated.serverId, { completed: updated.completed });
        const synced = apiReminderToLocal(api);
        set({
          reminders: get().reminders.map((x) => (x.id === id ? synced : x)),
        });
        await get().persist();
      } catch (e) {
        console.error('Failed to sync reminder toggle:', e);
      }
    }
  },

  removeReminder: async (id) => {
    const current = get().reminders.find((x) => x.id === id);
    set({ reminders: get().reminders.filter((x) => x.id !== id) });
    await get().persist();

    if (await hasAccessToken() && current?.serverId) {
      try {
        await deleteReminder(current.serverId);
      } catch (e) {
        console.error('Failed to delete reminder on server:', e);
      }
    }
  },

  hydrate: async () => {
    if (await hasAccessToken()) {
      await get().syncFromApi();
      return;
    }

    const local = await loadLocal();
    set({ reminders: local });
  },

  syncFromApi: async () => {
    if (!(await hasAccessToken())) return;

    const local = get().reminders.length > 0 ? get().reminders : await loadLocal();

    try {
      let remote = (await listReminders()).map(apiReminderToLocal);
      const uploaded = await uploadMissing(local, remote);
      if (uploaded.length > 0) {
        remote = (await listReminders()).map(apiReminderToLocal);
      }
      const merged = mergeReminders(local, remote);
      set({ reminders: merged });
      await setStoredReminders(JSON.stringify(merged));
    } catch (e) {
      console.error('Failed to sync reminders:', e);
      set({ reminders: local });
    }
  },

  persist: async () => {
    await setStoredReminders(JSON.stringify(get().reminders));
  },

  clearAll: async () => {
    set({ reminders: [] });
    await setStoredReminders(JSON.stringify([]));
  },
}));
