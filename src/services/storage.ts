import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from '../constants';

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
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async setToken(key: string, value: string): Promise<void> {
    await SecureStore.setItemAsync(key, value);
  },
  async deleteToken(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
  },
};

export async function getStoredProfile(): Promise<string | null> {
  return storage.getItem(STORAGE_KEYS.USER_PROFILE);
}

export async function setStoredProfile(json: string): Promise<void> {
  await storage.setItem(STORAGE_KEYS.USER_PROFILE, json);
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
