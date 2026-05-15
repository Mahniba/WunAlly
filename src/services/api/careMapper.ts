import type { Reminder } from '../../types';
import type { EmergencyContact } from '../../store/useContactsStore';
import type { ApiContact } from './contacts';
import type { CreateReminderPayload } from './reminders';
import type { ApiReminder } from './reminders';

export interface ReminderLocal extends Reminder {
  serverId?: number;
}

export function apiReminderToLocal(api: ApiReminder): ReminderLocal {
  return {
    id: api.client_id ? String(api.client_id) : String(api.id),
    serverId: api.id,
    title: api.title,
    time: api.time,
    completed: api.completed,
    iconType: (api.icon_type as Reminder['iconType']) || 'general',
  };
}

export function localReminderToCreatePayload(reminder: ReminderLocal): CreateReminderPayload {
  return {
    title: reminder.title,
    time: reminder.time,
    completed: reminder.completed,
    icon_type: reminder.iconType ?? 'general',
    client_id: reminder.id,
  };
}

export function mergeReminders(local: ReminderLocal[], remote: ReminderLocal[]): ReminderLocal[] {
  const map = new Map<string, ReminderLocal>();
  for (const entry of local) {
    map.set(entry.id, entry);
  }
  for (const entry of remote) {
    map.set(entry.id, entry);
  }
  return Array.from(map.values());
}

export function apiContactToLocal(api: ApiContact): EmergencyContact & { serverId?: number } {
  return {
    id: api.client_id ? String(api.client_id) : String(api.id),
    serverId: api.id,
    name: api.name,
    phone: api.phone,
  };
}

export function mergeContacts(
  local: (EmergencyContact & { serverId?: number })[],
  remote: (EmergencyContact & { serverId?: number })[]
): EmergencyContact[] {
  const map = new Map<string, EmergencyContact & { serverId?: number }>();
  for (const entry of local) {
    map.set(entry.id, entry);
  }
  for (const entry of remote) {
    map.set(entry.id, entry);
  }
  return Array.from(map.values());
}
