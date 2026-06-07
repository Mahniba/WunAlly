import { apiRequest } from './client';

export interface SosLogPayload {
  shared_location?: boolean;
  contacts_notified_count?: number;
  sms_sent?: boolean;
  offline_mode?: boolean;
  latitude?: number | null;
  longitude?: number | null;
}

export async function logSosEvent(payload: SosLogPayload = {}): Promise<void> {
  try {
    await apiRequest('/me/sos-events/', {
      method: 'POST',
      body: {
        shared_location: payload.shared_location ?? false,
        contacts_notified_count: payload.contacts_notified_count ?? 0,
        sms_sent: payload.sms_sent ?? false,
        offline_mode: payload.offline_mode ?? false,
        latitude: payload.latitude ?? null,
        longitude: payload.longitude ?? null,
      },
    });
  } catch (error) {
    console.warn('Failed to log SOS event:', error);
  }
}
