import * as Calendar from 'expo-calendar';
import { Platform } from 'react-native';
import type { Reminder } from '../types';
import { buildTriggerDate, parseReminderTime } from '../utils/reminderTime';

async function getWritableCalendarId(): Promise<string | null> {
  if (Platform.OS === 'web') return null;

  const { status } = await Calendar.requestCalendarPermissionsAsync();
  if (status !== 'granted') return null;

  if (Platform.OS === 'ios') {
    const defaultCal = await Calendar.getDefaultCalendarAsync();
    return defaultCal?.id ?? null;
  }

  const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  const writable = calendars.find((c) => c.allowsModifications);
  return writable?.id ?? null;
}

export async function addReminderToCalendar(reminder: Reminder): Promise<string | null> {
  const parts = parseReminderTime(reminder.time);
  if (!parts) return null;

  const calendarId = await getWritableCalendarId();
  if (!calendarId) return null;

  const start = buildTriggerDate(reminder.scheduledDate, parts.hour, parts.minute);
  const end = new Date(start.getTime() + 60 * 60_000);

  const eventId = await Calendar.createEventAsync(calendarId, {
    title: `WunAlly: ${reminder.title}`,
    startDate: start,
    endDate: end,
    notes: 'Pregnancy reminder from WunAlly',
    alarms: [{ relativeOffset: reminder.iconType === 'doctor' ? -15 : -10 }],
    timeZone: undefined,
  });

  return eventId;
}

export async function removeCalendarEvent(eventId?: string): Promise<void> {
  if (!eventId || Platform.OS === 'web') return;
  try {
    await Calendar.deleteEventAsync(eventId);
  } catch {
    /* event may already be deleted */
  }
}
