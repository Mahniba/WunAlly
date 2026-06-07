import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from '../constants';

/** AsyncStorage fallback when SecureStore is unavailable (e.g. some web reloads). */
const TOKEN_BACKUP_PREFIX = 'wunally_token_backup_';

export const storage = {
  async getItem(key: string): Promise<string | null> {
    return AsyncStorage.getItem(key);
  },
  async setItem(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  },
  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },
};

export const secureStorage = {
  async getToken(key: string): Promise<string | null> {
    try {
      const secure = await SecureStore.getItemAsync(key);
      if (secure) return secure;
    } catch {
      // SecureStore may be unavailable on web or after reload
    }
    return storage.getItem(TOKEN_BACKUP_PREFIX + key);
  },

  async setToken(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {
      // fall through to backup
    }
    await storage.setItem(TOKEN_BACKUP_PREFIX + key, value);
  },

  async deleteToken(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {
      // ignore
    }
    await storage.removeItem(TOKEN_BACKUP_PREFIX + key);
  },
};

export async function getStoredProfile(): Promise<string | null> {
  return storage.getItem(STORAGE_KEYS.USER_PROFILE);
}

export async function setStoredProfile(json: string): Promise<void> {
  await storage.setItem(STORAGE_KEYS.USER_PROFILE, json);
}

export async function getLanguageChosen(): Promise<boolean> {
  const v = await storage.getItem(STORAGE_KEYS.LANGUAGE_CHOSEN);
  return v === 'true';
}

export async function setLanguageChosen(): Promise<void> {
  await storage.setItem(STORAGE_KEYS.LANGUAGE_CHOSEN, 'true');
}

export async function getOnboardingDone(): Promise<boolean> {
  const v = await storage.getItem(STORAGE_KEYS.ONBOARDING_DONE);
  return v === 'true';
}

export async function setOnboardingDone(): Promise<void> {
  await storage.setItem(STORAGE_KEYS.ONBOARDING_DONE, 'true');
}

export async function resetOnboarding(): Promise<void> {
  await storage.removeItem(STORAGE_KEYS.ONBOARDING_DONE);
}

export async function getStoredReminders(): Promise<string | null> {
  return storage.getItem(STORAGE_KEYS.REMINDERS);
}

export async function setStoredReminders(json: string): Promise<void> {
  await storage.setItem(STORAGE_KEYS.REMINDERS, json);
}

export async function getEmergencyContacts(): Promise<string | null> {
  return storage.getItem(STORAGE_KEYS.EMERGENCY_CONTACTS);
}

export async function setEmergencyContacts(json: string): Promise<void> {
  await storage.setItem(STORAGE_KEYS.EMERGENCY_CONTACTS, json);
}

export async function getCarePlanNotes(): Promise<string | null> {
  return storage.getItem(STORAGE_KEYS.CARE_PLAN_NOTES);
}

export async function setCarePlanNotes(json: string): Promise<void> {
  await storage.setItem(STORAGE_KEYS.CARE_PLAN_NOTES, json);
}

export async function getMoodEntries(): Promise<string | null> {
  return storage.getItem(STORAGE_KEYS.MOOD_ENTRIES);
}

export async function setMoodEntries(json: string): Promise<void> {
  await storage.setItem(STORAGE_KEYS.MOOD_ENTRIES, json);
}

export async function getSymptomEntries(): Promise<string | null> {
  return storage.getItem(STORAGE_KEYS.SYMPTOM_ENTRIES);
}

export async function setSymptomEntries(json: string): Promise<void> {
  await storage.setItem(STORAGE_KEYS.SYMPTOM_ENTRIES, json);
}

export async function getSymptomReminderTime(): Promise<string | null> {
  return storage.getItem(STORAGE_KEYS.SYMPTOM_REMINDER_TIME);
}

export async function setSymptomReminderTime(value: string): Promise<void> {
  await storage.setItem(STORAGE_KEYS.SYMPTOM_REMINDER_TIME, value);
}
