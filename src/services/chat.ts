import { sendChatMessage as sendChatApi, type SendChatOptions } from './api/chat';
import { getReplyForMessage } from '../utils/chatReplies';
import { hasAccessToken } from './api/session';
import { currentLanguage } from '../i18n';

export interface ChatReply {
  text: string;
  disclaimer?: string;
  escalated?: boolean;
}

export async function sendChatMessage(options: SendChatOptions): Promise<ChatReply> {
  if (await hasAccessToken()) {
    try {
      const res = await sendChatApi(options);
      return {
        text: res.text,
        disclaimer: res.disclaimer,
        escalated: res.escalated,
      };
    } catch (error) {
      console.warn('Chat API failed, using local fallback:', error);
    }
  }
  return {
    text: getReplyForMessage(options.text),
    disclaimer: currentLanguage().startsWith('fr')
      ? 'Ceci est une information générale, pas un avis médical.'
      : 'This response is for general information only and is not medical advice.',
  };
}
