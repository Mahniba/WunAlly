import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { STORAGE_KEYS } from '../constants';
import { storage } from './storage';

export function configureNotificationHandler(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    if (!Device || !Device.isDevice) return false;
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    return finalStatus === 'granted';
  } catch {
    return false;
  }
}

export async function scheduleDailyReminder(hour = 9, minute = 0): Promise<string | number | undefined> {
  try {
    const existing = await storage.getItem(STORAGE_KEYS.DAILY_SYMPTOM_NOTIFICATION_ID);
    if (existing) {
      await Notifications.cancelScheduledNotificationAsync(existing);
    }
  } catch {
    /* ignore */
  }

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Daily symptom check',
      body: "Tap to record today's symptoms and mood.",
      sound: true,
      data: { type: 'daily_symptom' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });

  await storage.setItem(STORAGE_KEYS.DAILY_SYMPTOM_NOTIFICATION_ID, String(id));
  return id;
}

export async function cancelAllReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await storage.removeItem(STORAGE_KEYS.DAILY_SYMPTOM_NOTIFICATION_ID);
}
