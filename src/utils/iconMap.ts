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

const SYMPTOM_ICONS: Record<string, FeatherIconName> = {
  swelling: 'maximize-2',
  heartburn: 'zap',
  constipation: 'minus-circle',
  stretch_marks: 'git-commit',
  nausea: 'frown',
  headache: 'target',
  dizzy: 'rotate-cw',
  fatigue: 'moon',
  back_pain: 'minimize-2',
  reduced_baby_movement: 'heart',
  strong_kicks: 'activity',
  irregular_pattern: 'bar-chart-2',
  normal_discharge: 'droplet',
  unusual_discharge: 'alert-circle',
  itching: 'slash',
  odor: 'wind',
  severe_headache: 'alert-triangle',
  blurred_vision: 'eye-off',
  vaginal_bleeding: 'alert-octagon',
  severe_abdominal_pain: 'alert-triangle',
  fever: 'zap',
  severe_vomiting: 'alert-circle',
  insomnia: 'clock',
  foul_discharge: 'alert-triangle',
  difficulty_breathing: 'cloud',
  swelling_face_hands_feet: 'maximize-2',
  none_today: 'heart',
};

export function iconForSymptom(key: string): FeatherIconName {
  return SYMPTOM_ICONS[key] ?? 'circle';
}
