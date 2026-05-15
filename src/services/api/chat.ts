import { apiRequest } from './client';

export interface ChatResponse {
  text: string;
  disclaimer: string;
}

export async function sendChatMessage(text: string): Promise<ChatResponse> {
  return apiRequest<ChatResponse>('/me/chat/messages/', {
    method: 'POST',
    body: { text },
  });
}
