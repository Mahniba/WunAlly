import type { ApiMoodEntry, PaginatedResponse } from './types';
import { apiRequest } from './client';

export interface CreateMoodPayload {
  mood: string;
  note?: string;
  recorded_at?: string;
  client_id?: string;
}

/** GET /me/moods/ — implemented in Phase 2. */
export async function listMoods(): Promise<ApiMoodEntry[]> {
  const data = await apiRequest<PaginatedResponse<ApiMoodEntry> | ApiMoodEntry[]>('/me/moods/');

  if (Array.isArray(data)) return data;
  return data.results ?? [];
}

/** POST /me/moods/ — implemented in Phase 2. */
export async function createMood(payload: CreateMoodPayload): Promise<ApiMoodEntry> {
  return apiRequest<ApiMoodEntry>('/me/moods/', {
    method: 'POST',
    body: payload,
  });
}
