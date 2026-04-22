import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    // If not running on a physical device, skip permission flow
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
  // Cancel existing daily reminders (caller can manage tokens if needed)
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {}

  const trigger = {
    hour,
    minute,
    repeats: true,
  } as any;

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Daily symptom check",
      body: 'Tap to record today\'s symptoms (nausea, headache, dizziness).',
      sound: true,
    },
    trigger,
  });

  return id;
}

export async function cancelAllReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
