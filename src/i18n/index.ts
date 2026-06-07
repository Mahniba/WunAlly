import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import { STORAGE_KEYS } from '../constants';
import { storage } from '../services/storage';

import en from './locales/en';
import fr from './locales/fr';

const LANG_KEY = '@wunally/language';

export async function initI18n(): Promise<void> {
  const saved = await storage.getItem(LANG_KEY);
  const device = Localization.getLocales()[0]?.languageCode ?? 'en';
  const lng = saved === 'fr' || saved === 'en' ? saved : device.startsWith('fr') ? 'fr' : 'en';

  if (!i18n.isInitialized) {
    await i18n.use(initReactI18next).init({
      compatibilityJSON: 'v3',
      resources: { en: { translation: en }, fr: { translation: fr } },
      lng,
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
    });
  } else {
    await i18n.changeLanguage(lng);
  }
}

export async function setAppLanguage(code: 'en' | 'fr'): Promise<void> {
  await storage.setItem(LANG_KEY, code);
  await storage.setItem(STORAGE_KEYS.LANGUAGE_CHOSEN, 'true');
  await i18n.changeLanguage(code);
}

export function currentLanguage(): string {
  return i18n.language?.startsWith('fr') ? 'fr' : 'en';
}

export default i18n;
