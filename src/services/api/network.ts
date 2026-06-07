import { apiRequest } from './client';

export interface HealthProvider {
  id: number;
  name: string;
  role: string;
  facility: string;
  phone: string;
  languages: string[];
  avatar_emoji: string;
  is_online: boolean;
  last_seen: string;
  bio: string;
}

export interface NurseAssignment {
  id: number;
  provider: HealthProvider;
  assigned_at: string;
  active: boolean;
}

export interface HealthFacility {
  id: number;
  name: string;
  city: string;
  region: string;
  phone: string;
  services: string;
}

export async function listProviders(onlineOnly = false): Promise<HealthProvider[]> {
  const q = onlineOnly ? '?online=1' : '';
  return apiRequest<HealthProvider[]>(`/me/providers/${q}`, { method: 'GET' });
}

export async function listFacilities(): Promise<HealthFacility[]> {
  return apiRequest<HealthFacility[]>('/me/facilities/', { method: 'GET' });
}

export async function assignProvider(providerId: number): Promise<NurseAssignment> {
  return apiRequest<NurseAssignment>('/me/assign/', {
    method: 'POST',
    body: { provider_id: providerId },
  });
}

export async function getMyAssignment(): Promise<NurseAssignment | null> {
  return apiRequest<NurseAssignment | null>('/me/assignment/', { method: 'GET' });
}
