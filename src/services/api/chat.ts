import { apiRequest } from './client';
import { currentLanguage } from '../../i18n';

export interface ChatResponse {
  text: string;
  disclaimer: string;
  escalated?: boolean;
  source?: string;
}

export interface ChatHistoryItem {
  id: number;
  role: string;
  text: string;
  mode: string;
  input_mode: string;
  created_at: string;
}

export interface SendChatOptions {
  text: string;
  mode?: 'ai' | 'nurse';
  inputMode?: 'text' | 'voice';
  providerId?: number | null;
}

export async function sendChatMessage(options: SendChatOptions): Promise<ChatResponse> {
  const { text, mode = 'ai', inputMode = 'text', providerId } = options;
  return apiRequest<ChatResponse>('/me/chat/messages/', {
    method: 'POST',
    body: {
      text,
      mode,
      input_mode: inputMode,
      language: currentLanguage(),
      provider_id: providerId ?? null,
    },
  });
}

export async function fetchChatHistory(mode?: 'ai' | 'nurse'): Promise<ChatHistoryItem[]> {
  const path = mode ? `/me/chat/messages/?mode=${mode}` : '/me/chat/messages/';
  return apiRequest<ChatHistoryItem[]>(path, { method: 'GET' });
}
