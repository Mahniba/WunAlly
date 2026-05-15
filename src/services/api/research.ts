import { apiRequest } from './client';

export async function exportMyData(): Promise<Record<string, unknown>> {
  return apiRequest<Record<string, unknown>>('/me/export/');
}

export async function deleteMyAccount(password: string): Promise<void> {
  await apiRequest('/me/account/', {
    method: 'DELETE',
    body: { password },
  });
}
