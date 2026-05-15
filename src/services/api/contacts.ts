import type { PaginatedResponse } from './types';
import { apiRequest } from './client';

export interface ApiContact {
  id: number;
  name: string;
  phone: string;
  client_id?: string;
}

export interface CreateContactPayload {
  name: string;
  phone: string;
  client_id?: string;
}

function unwrapList(data: PaginatedResponse<ApiContact> | ApiContact[]): ApiContact[] {
  if (Array.isArray(data)) return data;
  return data.results ?? [];
}

export async function listContacts(): Promise<ApiContact[]> {
  const data = await apiRequest<PaginatedResponse<ApiContact> | ApiContact[]>('/me/contacts/');
  return unwrapList(data);
}

export async function createContact(payload: CreateContactPayload): Promise<ApiContact> {
  return apiRequest<ApiContact>('/me/contacts/', { method: 'POST', body: payload });
}

export async function deleteContact(serverId: number): Promise<void> {
  await apiRequest(`/me/contacts/${serverId}/`, { method: 'DELETE' });
}
