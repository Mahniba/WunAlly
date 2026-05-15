import { sendChatMessage as sendChatApi } from './api/chat';
import { getReplyForMessage } from '../utils/chatReplies';
import { hasAccessToken } from './api/session';

export interface SendMessagePayload {
  text: string;
  userId?: string;
}

export interface ChatReply {
  text: string;
  disclaimer?: string;
}

/**
 * Send a chat message. Uses the API when logged in; falls back to local replies offline.
 */
export async function sendChatMessage(payload: SendMessagePayload): Promise<ChatReply> {
  if (await hasAccessToken()) {
    try {
      const res = await sendChatApi(payload.text);
      return { text: res.text, disclaimer: res.disclaimer };
    } catch (error) {
      console.warn('Chat API failed, using local fallback:', error);
    }
  }
  return {
    text: getReplyForMessage(payload.text),
    disclaimer: 'This response is for general information only and is not medical advice.',
  };
}
