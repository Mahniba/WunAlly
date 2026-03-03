/**
 * Placeholder for future chat API integration.
 * Chat requires internet; do not use for diagnosis.
 */

export interface SendMessagePayload {
  text: string;
  userId?: string;
}

export async function sendChatMessage(_payload: SendMessagePayload): Promise<{ text: string }> {
  // TODO: integrate with backend
  return { text: 'Support is here for you. In production, this would connect to your care team.' };
}
