const DEFAULT_API_URL = 'http://localhost:8000/api/v1';

/**
 * Base URL for the Wunally API (no trailing slash).
 * Set EXPO_PUBLIC_API_URL in .env for device/emulator testing.
 */
export function getApiBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (fromEnv?.trim()) {
    return fromEnv.trim().replace(/\/$/, '');
  }
  return DEFAULT_API_URL;
}
