import type { ApiProfile } from './types';
import { apiRequest } from './client';

/** GET /me/profile/ — implemented in Phase 1. */
export async function getProfile(): Promise<ApiProfile> {
  return apiRequest<ApiProfile>('/me/profile/');
}

/** PATCH /me/profile/ — implemented in Phase 1. */
export async function updateProfile(payload: Partial<ApiProfile>): Promise<ApiProfile> {
  return apiRequest<ApiProfile>('/me/profile/', {
    method: 'PATCH',
    body: payload,
  });
}
