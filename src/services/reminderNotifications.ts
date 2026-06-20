import * as Notifications from 'expo-notifications';
import type { Reminder } from '../types';
import { buildTriggerDate, parseReminderTime } from '../utils/reminderTime';

const MIN_LEAD_MS = 60_000;

export async function cancelReminderNotifications(notificationIds?: string[]): Promise<void> {
  if (!notificationIds?.length) return;
  await Promise.all(
    notificationIds.map(async (id) => {
      try {
        await Notifications.cancelScheduledNotificationAsync(id);
      } catch {
        /* ignore stale ids */
      }
    }),
  );
}

async function scheduleAt(
  title: string,
  body: string,
  triggerDate: Date,
): Promise<string | null> {
  if (triggerDate.getTime() - Date.now() < MIN_LEAD_MS) return null;

  return Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
      data: { type: 'user_reminder' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
    },
  });
}

async function scheduleDaily(
  title: string,
  body: string,
  hour: number,
  minute: number,
): Promise<string | null> {
  return Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
      data: { type: 'user_reminder' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

/**
 * Doctor/appointment reminders notify 15 minutes early; others fire at the set time.
 * Reminders without a parseable time are skipped.
 */
export async function scheduleReminderNotifications(reminder: Reminder): Promise<string[]> {
  if (reminder.completed) return [];

  const parts = parseReminderTime(reminder.time);
  if (!parts) return [];

  const ids: string[] = [];
  const atTimeBody = reminder.scheduledDate
    ? `${reminder.title} — today at ${reminder.time}`
    : `${reminder.title} — ${reminder.time}`;

  if (reminder.scheduledDate) {
    const atTime = buildTriggerDate(reminder.scheduledDate, parts.hour, parts.minute);
    const atId = await scheduleAt(reminder.title, atTimeBody, atTime);
    if (atId) ids.push(atId);

    if (reminder.iconType === 'doctor') {
      const early = new Date(atTime.getTime() - 15 * 60_000);
      const earlyId = await scheduleAt(
        reminder.title,
        `Starting in 15 minutes (${reminder.time})`,
        early,
      );
      if (earlyId) ids.push(earlyId);
    }
  } else {
    const dailyId = await scheduleDaily(reminder.title, atTimeBody, parts.hour, parts.minute);
    if (dailyId) ids.push(dailyId);
  }

  return ids;
}

export async function rescheduleAllReminderNotifications(
  reminders: Array<Reminder & { notificationIds?: string[] }>,
): Promise<Array<Reminder & { notificationIds?: string[] }>> {
  const next: Array<Reminder & { notificationIds?: string[] }> = [];

  for (const reminder of reminders) {
    await cancelReminderNotifications(reminder.notificationIds);
    if (reminder.completed) {
      next.push({ ...reminder, notificationIds: [] });
      continue;
    }
    const notificationIds = await scheduleReminderNotifications(reminder);
    next.push({ ...reminder, notificationIds });
  }

  return next;
}
