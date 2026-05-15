import type { PaginatedResponse } from './types';
import { apiRequest } from './client';

export interface ApiReminder {
  id: number;
  title: string;
  time: string;
  completed: boolean;
  icon_type?: string;
  client_id?: string;
}

export interface CreateReminderPayload {
  title: string;
  time: string;
  completed?: boolean;
  icon_type?: string;
  client_id?: string;
}

export type UpdateReminderPayload = Partial<CreateReminderPayload>;

function unwrapList(data: PaginatedResponse<ApiReminder> | ApiReminder[]): ApiReminder[] {
  if (Array.isArray(data)) return data;
  return data.results ?? [];
}

export async function listReminders(): Promise<ApiReminder[]> {
  const data = await apiRequest<PaginatedResponse<ApiReminder> | ApiReminder[]>('/me/reminders/');
  return unwrapList(data);
}

export async function createReminder(payload: CreateReminderPayload): Promise<ApiReminder> {
  return apiRequest<ApiReminder>('/me/reminders/', { method: 'POST', body: payload });
}

export async function updateReminder(
  serverId: number,
  payload: UpdateReminderPayload
): Promise<ApiReminder> {
  return apiRequest<ApiReminder>(`/me/reminders/${serverId}/`, {
    method: 'PATCH',
    body: payload,
  });
}

export async function deleteReminder(serverId: number): Promise<void> {
  await apiRequest(`/me/reminders/${serverId}/`, { method: 'DELETE' });
}
