import type { FeatherIconName } from '../components/AppIcon';

const HOME_ACTION_ICONS: Record<string, FeatherIconName> = {
  track: 'trending-up',
  chat: 'message-circle',
  reminders: 'bell',
  sos: 'alert-circle',
};

const CHECK_IN_ICONS: Record<string, FeatherIconName> = {
  mood: 'smile',
  general: 'activity',
  warning_signs: 'alert-triangle',
  baby_monitoring: 'heart',
  body_changes: 'user',
  vaginal_health: 'droplet',
};

const NETWORK_ICONS: Record<string, FeatherIconName> = {
  find_nurse: 'search',
  nurse_chat: 'user-check',
  ai_chat: 'message-square',
  facilities: 'map-pin',
  danger_signs: 'alert-triangle',
  warning_checkin: 'clipboard',
};

const SIDEBAR_ICONS: Record<string, FeatherIconName> = {
  Profile: 'user',
  EmergencyContacts: 'phone',
  Privacy: 'shield',
  Logout: 'log-out',
};

export function iconForHomeAction(key: string): FeatherIconName {
  return HOME_ACTION_ICONS[key] ?? 'circle';
}

export function iconForCheckIn(id: string): FeatherIconName {
  return CHECK_IN_ICONS[id] ?? 'check-circle';
}

export function iconForNetwork(key: string): FeatherIconName {
  return NETWORK_ICONS[key] ?? 'circle';
}

export function iconForSidebar(screen: string): FeatherIconName {
  return SIDEBAR_ICONS[screen] ?? 'chevron-right';
}
