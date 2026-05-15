import { apiRequest } from './client';

export async function logSosEvent(sharedLocation = false): Promise<void> {
  try {
    await apiRequest('/me/sos-events/', {
      method: 'POST',
      body: { shared_location: sharedLocation },
    });
  } catch (error) {
    console.warn('Failed to log SOS event:', error);
  }
}
