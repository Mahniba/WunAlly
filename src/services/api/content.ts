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

export interface AppContent {
  check_in_categories: CheckInCategory[];
  symptom_catalogs: Record<string, SymptomOption[]>;
  moods: MoodOption[];
  home_actions: HomeAction[];
  chat: ChatConfig;
  chat_support_options: ChatSupportOption[];
}

export async function fetchAppContent(): Promise<AppContent> {
  return apiRequest<AppContent>('/content/', { method: 'GET', anonymous: true });
}
