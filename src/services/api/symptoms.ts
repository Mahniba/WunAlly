import type { ApiSymptomEntry, PaginatedResponse } from './types';
import { apiRequest } from './client';

export interface CreateSymptomPayload {
  recorded_at?: string;
  category?: string;
  symptoms: Record<string, boolean>;
  notes?: string;
  sleep_hours?: number;
  pain_level?: number;
  food_note?: string;
  client_id?: string;
}

export interface ListSymptomsParams {
  from?: string;
  to?: string;
}

/** GET /me/symptoms/ — implemented in Phase 2. */
export async function listSymptoms(
  params: ListSymptomsParams = {}
): Promise<ApiSymptomEntry[]> {
  const query = new URLSearchParams();
  if (params.from) query.set('from', params.from);
  if (params.to) query.set('to', params.to);
  const qs = query.toString();
  const path = qs ? `/me/symptoms/?${qs}` : '/me/symptoms/';

  const data = await apiRequest<PaginatedResponse<ApiSymptomEntry> | ApiSymptomEntry[]>(path);

  if (Array.isArray(data)) return data;
  return data.results ?? [];
}

/** POST /me/symptoms/ — implemented in Phase 2. */
export async function createSymptom(payload: CreateSymptomPayload): Promise<ApiSymptomEntry> {
  return apiRequest<ApiSymptomEntry>('/me/symptoms/', {
    method: 'POST',
    body: payload,
  });
}
