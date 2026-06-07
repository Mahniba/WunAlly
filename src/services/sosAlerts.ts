import * as SMS from 'expo-sms';
import * as Location from 'expo-location';
import { Linking } from 'react-native';
import { currentLanguage } from '../i18n';
import { OFFLINE_EMERGENCY } from '../assets/offlineEmergency';
import type { EmergencyGuide } from './api/content';
import { logSosEvent } from './api/sos';

export interface EmergencyContact {
  name: string;
  phone: string;
}

function smsTemplate(guide: EmergencyGuide | typeof OFFLINE_EMERGENCY, location: string, lang: string): string {
  const tpl = lang.startsWith('fr')
    ? ('sms_template_fr' in guide ? guide.sms_template_fr : OFFLINE_EMERGENCY.sms_template_fr)
    : ('sms_template_en' in guide ? guide.sms_template_en : OFFLINE_EMERGENCY.sms_template_en);
  return tpl.replace('{location}', location || (lang.startsWith('fr') ? 'non partagée' : 'not shared'));
}

export async function getCurrentCoords(): Promise<{ latitude: number; longitude: number } | null> {
  const perm = await Location.requestForegroundPermissionsAsync();
  if (perm.status !== 'granted') return null;
  const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
  return { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
}

export function mapsLink(lat: number, lng: number): string {
  return `https://maps.google.com/?q=${lat},${lng}`;
}

export async function notifyContactsViaSms(
  contacts: EmergencyContact[],
  guide: EmergencyGuide | typeof OFFLINE_EMERGENCY,
  coords?: { latitude: number; longitude: number } | null,
): Promise<{ sent: number; available: boolean }> {
  const phones = contacts.map((c) => c.phone.trim()).filter(Boolean);
  if (phones.length === 0) return { sent: 0, available: false };

  const lang = currentLanguage();
  const location =
    coords != null ? mapsLink(coords.latitude, coords.longitude) : lang.startsWith('fr') ? 'non partagée' : 'not shared';
  const message = smsTemplate(guide, location, lang);

  const available = await SMS.isAvailableAsync();
  if (!available) {
    for (const phone of phones) {
      const body = encodeURIComponent(message);
      const url = `sms:${phone}?body=${body}`;
      await Linking.openURL(url);
    }
    return { sent: phones.length, available: false };
  }

  const result = await SMS.sendSMSAsync(phones, message);
  const sent = result.status === 'sent' ? phones.length : 0;
  return { sent, available: true };
}

export async function triggerSosAlert(
  contacts: EmergencyContact[],
  guide: EmergencyGuide | typeof OFFLINE_EMERGENCY,
  options?: { fetchLocation?: boolean; offline?: boolean },
): Promise<{ smsSent: boolean; notified: number; coords: { latitude: number; longitude: number } | null }> {
  let coords: { latitude: number; longitude: number } | null = null;
  if (options?.fetchLocation !== false) {
    try {
      coords = await getCurrentCoords();
    } catch {
      coords = null;
    }
  }

  const { sent, available } = await notifyContactsViaSms(contacts, guide, coords);

  await logSosEvent({
    shared_location: coords != null,
    contacts_notified_count: sent,
    sms_sent: available && sent > 0,
    offline_mode: options?.offline ?? false,
    latitude: coords?.latitude ?? null,
    longitude: coords?.longitude ?? null,
  });

  return { smsSent: available && sent > 0, notified: sent, coords };
}

export async function callFirstContact(contacts: EmergencyContact[]): Promise<boolean> {
  const first = contacts[0];
  if (!first?.phone) return false;
  const tel = `tel:${first.phone}`;
  const can = await Linking.canOpenURL(tel);
  if (!can) return false;
  await Linking.openURL(tel);
  return true;
}
