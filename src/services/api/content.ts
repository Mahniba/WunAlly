import { apiRequest } from './client';

export interface SymptomOption {
  key: string;
  label: string;
  emoji: string;
}

export interface CheckInCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color_key: string;
  screen: string;
  symptom_category?: string;
  show_extras?: boolean;
}

export interface MoodOption {
  key: string;
  label: string;
  emoji: string;
  color_key: string;
}

export interface HomeAction {
  key: string;
  title: string;
  nav: string;
  color_key: string;
}

export interface ChatConfig {
  welcome_message: string;
  voice_prompts: string[];
  input_placeholder: string;
}

export interface ChatSupportOption {
  key: string;
  title: string;
  description: string;
  icon: string;
  screen: string;
}

export interface NetworkHubCopy {
  title_en: string;
  title_fr: string;
  subtitle_en: string;
  subtitle_fr: string;
}

export interface NurseDirectoryCopy {
  title_en: string;
  title_fr: string;
  subtitle_en: string;
  subtitle_fr: string;
  scanning_en: string;
  scanning_fr: string;
  hub_scanning_en: string;
  hub_scanning_fr: string;
  hub_you_en: string;
  hub_you_fr: string;
  found_online_en: string;
  found_online_plural_en: string;
  found_online_fr: string;
  found_online_plural_fr: string;
  scan_again_en: string;
  scan_again_fr: string;
  more_nurses_en: string;
  more_nurses_fr: string;
  empty_title_en: string;
  empty_title_fr: string;
  empty_body_en: string;
  empty_body_fr: string;
  status_offline_en: string;
  status_offline_fr: string;
  online_en: string;
  online_fr: string;
  offline_en: string;
  offline_fr: string;
  pick_nurse_en: string;
  pick_nurse_fr: string;
  languages_en: string;
  languages_fr: string;
  no_assignment_en: string;
  no_assignment_fr: string;
}

export interface FacilitiesDirectoryCopy {
  subtitle_en: string;
  subtitle_fr: string;
  empty_title_en: string;
  empty_title_fr: string;
  empty_body_en: string;
  empty_body_fr: string;
  services_en: string;
  services_fr: string;
  call_en: string;
  call_fr: string;
}

export interface NetworkHubFeature {
  key: string;
  title?: string;
  description?: string;
  title_en: string;
  title_fr: string;
  description_en: string;
  description_fr: string;
  icon: string;
  screen: string;
  params?: Record<string, unknown>;
}

export interface EmergencyGuide {
  title: string;
  disclaimer: string;
  steps: { title: string; body_en: string; body_fr: string }[];
  danger_signs_en: string[];
  danger_signs_fr: string[];
  sms_template_en: string;
  sms_template_fr: string;
}

export interface ReminderPreset {
  key: string;
  title: string;
  icon_type: string;
}

export interface AppContent {
  check_in_categories: CheckInCategory[];
  symptom_catalogs: Record<string, SymptomOption[]>;
  moods: MoodOption[];
  home_actions: HomeAction[];
  chat: ChatConfig;
  chat_support_options: ChatSupportOption[];
  network_hub: NetworkHubCopy;
  nurse_directory: NurseDirectoryCopy;
  facilities_directory: FacilitiesDirectoryCopy;
  network_hub_features: NetworkHubFeature[];
  emergency_guide: EmergencyGuide;
  reminder_presets: ReminderPreset[];
}

export async function fetchAppContent(): Promise<AppContent> {
  return apiRequest<AppContent>('/content/', { method: 'GET', anonymous: true });
}
