import { apiRequest } from './client';

export interface CreateAlertPayload {
  symptom: string;
  count: number;
  window_days: number;
  message: string;
}

export async function logAlertEvent(payload: CreateAlertPayload): Promise<void> {
  try {
    await apiRequest('/me/alerts/', {
      method: 'POST',
      body: payload,
    });
  } catch (error) {
    console.warn('Failed to log alert event:', error);
  }
}
