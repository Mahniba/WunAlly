import { TOKEN_KEYS } from '../../constants';
import { secureStorage } from '../storage';
import type { AuthResponse } from './types';
import { apiRequest, clearTokens, setTokens } from './client';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

/** POST /auth/register/ — implemented in Phase 1. */
export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const data = await apiRequest<AuthResponse>('/auth/register/', {
    method: 'POST',
    body: payload,
    anonymous: true,
  });
  await setTokens(data.access, data.refresh);
  return data;
}

/** POST /auth/login/ — implemented in Phase 1. */
export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const data = await apiRequest<AuthResponse>('/auth/login/', {
    method: 'POST',
    body: payload,
    anonymous: true,
  });
  await setTokens(data.access, data.refresh);
  return data;
}

/** POST /auth/logout/ — best-effort; clears local tokens regardless. */
export async function logout(): Promise<void> {
  try {
    const refresh = await secureStorage.getToken(TOKEN_KEYS.REFRESH);
    if (refresh) {
      await apiRequest('/auth/logout/', {
        method: 'POST',
        body: { refresh },
        skipRefresh: true,
      });
    }
  } catch {
    // Server may not implement logout yet (Phase 1)
  } finally {
    await clearTokens();
  }
}

export async function requestPasswordReset(email: string): Promise<void> {
  await apiRequest('/auth/password/reset/', {
    method: 'POST',
    body: { email },
    anonymous: true,
  });
}
