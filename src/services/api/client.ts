import { getApiBaseUrl } from '../../config/env';
import { TOKEN_KEYS } from '../../constants';
import { secureStorage } from '../storage';
import { ApiError } from './errors';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type SessionStatus = 'ok' | 'invalid' | 'offline';

export interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  /** Skip Authorization header (e.g. login/register). */
  anonymous?: boolean;
  /** Skip automatic token refresh on 401. */
  skipRefresh?: boolean;
}

let refreshPromise: Promise<string | null> | null = null;

async function getAccessToken(): Promise<string | null> {
  return secureStorage.getToken(TOKEN_KEYS.ACCESS);
}

async function getRefreshToken(): Promise<string | null> {
  return secureStorage.getToken(TOKEN_KEYS.REFRESH);
}

export async function setTokens(access: string, refresh: string): Promise<void> {
  await secureStorage.setToken(TOKEN_KEYS.ACCESS, access);
  await secureStorage.setToken(TOKEN_KEYS.REFRESH, refresh);
}

export async function clearTokens(): Promise<void> {
  await secureStorage.deleteToken(TOKEN_KEYS.ACCESS);
  await secureStorage.deleteToken(TOKEN_KEYS.REFRESH);
}

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refresh = await getRefreshToken();
    if (!refresh) return null;

    try {
      const res = await fetch(`${getApiBaseUrl()}/auth/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ refresh }),
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          await clearTokens();
        }
        return null;
      }

      const data = (await res.json()) as { access: string; refresh?: string };
      await secureStorage.setToken(TOKEN_KEYS.ACCESS, data.access);
      if (data.refresh) {
        await secureStorage.setToken(TOKEN_KEYS.REFRESH, data.refresh);
      }
      return data.access;
    } catch {
      // Network error — keep tokens so a reload/offline mode can retry
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

async function parseResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) return undefined as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new ApiError('Invalid JSON response from server', res.status, text);
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = 'GET', body, anonymous = false, skipRefresh = false } = options;
  const url = `${getApiBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (!anonymous) {
    const token = await getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const doFetch = async (authHeaders: Record<string, string>) => {
    return fetch(url, {
      method,
      headers: { ...headers, ...authHeaders },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  };

  let res = await doFetch({});

  if (res.status === 401 && !anonymous && !skipRefresh) {
    const newAccess = await refreshAccessToken();
    if (newAccess) {
      res = await doFetch({ Authorization: `Bearer ${newAccess}` });
    }
  }

  const data = await parseResponse<unknown>(res);

  if (!res.ok) {
    const message =
      typeof data === 'object' && data !== null && 'detail' in data
        ? String((data as { detail: unknown }).detail)
        : `Request failed (${res.status})`;
    throw new ApiError(message, res.status, data);
  }

  return data as T;
}

/** Public health check — verifies API reachability. */
export async function checkApiHealth(): Promise<{ status: string; service: string; version: string }> {
  return apiRequest('/health/', { anonymous: true });
}

/**
 * Restore session on app start.
 * - ok: access token available (or refreshed)
 * - invalid: refresh token missing or rejected
 * - offline: tokens present but server unreachable
 */
export async function restoreSession(): Promise<SessionStatus> {
  const refresh = await getRefreshToken();
  if (!refresh) return 'invalid';

  const access = await getAccessToken();
  if (access) return 'ok';

  const refreshed = await refreshAccessToken();
  if (refreshed) return 'ok';

  // Still have refresh in storage but could not reach server
  const stillHasRefresh = await getRefreshToken();
  return stillHasRefresh ? 'offline' : 'invalid';
}

/** @deprecated Use restoreSession() */
export async function ensureValidSession(): Promise<boolean> {
  const status = await restoreSession();
  return status === 'ok';
}
