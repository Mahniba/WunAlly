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
import { requestNotificationPermissions } from '../services/notifications';
import {
  cancelReminderNotifications,
  rescheduleAllReminderNotifications,
  scheduleReminderNotifications,
} from '../services/reminderNotifications';
import { addReminderToCalendar, removeCalendarEvent } from '../services/calendarEvents';

function randomId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

type AddReminderInput = Omit<Reminder, 'id' | 'completed'> & {
  addToCalendar?: boolean;
};

interface RemindersState {
  reminders: ReminderLocal[];
  setReminders: (r: Reminder[]) => void;
  addReminder: (r: AddReminderInput) => Promise<void>;
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

async function finalizeReminder(reminder: ReminderLocal, addToCalendar?: boolean): Promise<ReminderLocal> {
  let next = { ...reminder };

  if (addToCalendar && !next.calendarEventId) {
    try {
      const eventId = await addReminderToCalendar(next);
      if (eventId) next = { ...next, calendarEventId: eventId };
    } catch (e) {
      console.error('Failed to add calendar event:', e);
    }
  }

  await requestNotificationPermissions();
  await cancelReminderNotifications(next.notificationIds);
  const notificationIds = await scheduleReminderNotifications(next);
  return { ...next, notificationIds };
}

async function persistAndSchedule(
  set: (partial: Partial<RemindersState>) => void,
  get: () => RemindersState,
  reminders: ReminderLocal[],
): Promise<ReminderLocal[]> {
  const scheduled = await rescheduleAllReminderNotifications(reminders);
  set({ reminders: scheduled });
  await setStoredReminders(JSON.stringify(scheduled));
  return scheduled;
}

export const useRemindersStore = create<RemindersState>((set, get) => ({
  reminders: [],

  setReminders: (reminders) => {
    void persistAndSchedule(set, get, reminders as ReminderLocal[]);
  },

  addReminder: async (r) => {
    const { addToCalendar, ...fields } = r;
    let reminder: ReminderLocal = {
      ...fields,
      id: randomId(),
      completed: false,
      iconType: fields.iconType ?? 'general',
    };

    reminder = await finalizeReminder(reminder, addToCalendar);
    const next = [...get().reminders, reminder];
    set({ reminders: next });
    await get().persist();

    if (await hasAccessToken()) {
      try {
        const api = await createReminder(localReminderToCreatePayload(reminder));
        const synced: ReminderLocal = {
          ...apiReminderToLocal(api),
          notificationIds: reminder.notificationIds,
          calendarEventId: reminder.calendarEventId,
        };
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

    const updated: ReminderLocal = { ...current, completed: !current.completed };
    if (updated.completed) {
      await cancelReminderNotifications(updated.notificationIds);
      updated.notificationIds = [];
    } else {
      const withNotifs = await finalizeReminder(updated, false);
      Object.assign(updated, withNotifs);
    }

    set({
      reminders: get().reminders.map((x) => (x.id === id ? updated : x)),
    });
    await get().persist();

    if (await hasAccessToken() && updated.serverId) {
      try {
        const api = await updateReminder(updated.serverId, { completed: updated.completed });
        const synced = apiReminderToLocal(api);
        set({
          reminders: get().reminders.map((x) =>
            x.id === id
              ? {
                  ...synced,
                  notificationIds: updated.notificationIds,
                  calendarEventId: x.calendarEventId,
                }
              : x,
          ),
        });
        await get().persist();
      } catch (e) {
        console.error('Failed to sync reminder toggle:', e);
      }
    }
  },

  removeReminder: async (id) => {
    const current = get().reminders.find((x) => x.id === id);
    await cancelReminderNotifications(current?.notificationIds);
    await removeCalendarEvent(current?.calendarEventId);

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
    const scheduled = await rescheduleAllReminderNotifications(local);
    set({ reminders: scheduled });
    await setStoredReminders(JSON.stringify(scheduled));
  },

  syncFromApi: async () => {
    if (!(await hasAccessToken())) return;

    const local = get().reminders.length > 0 ? get().reminders : await loadLocal();

    try {
      let remote = (await listReminders()).map(apiReminderToLocal);
      await uploadMissing(local, remote);
      remote = (await listReminders()).map(apiReminderToLocal);
      const merged = mergeReminders(local, remote);
      await persistAndSchedule(set, get, merged);
    } catch (e) {
      console.error('Failed to sync reminders:', e);
      const scheduled = await rescheduleAllReminderNotifications(local);
      set({ reminders: scheduled });
    }
  },

  persist: async () => {
    await setStoredReminders(JSON.stringify(get().reminders));
  },

  clearAll: async () => {
    for (const reminder of get().reminders) {
      await cancelReminderNotifications(reminder.notificationIds);
      await removeCalendarEvent(reminder.calendarEventId);
    }
    set({ reminders: [] });
    await setStoredReminders(JSON.stringify([]));
  },
}));
