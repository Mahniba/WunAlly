import { apiRequest } from './client';

export async function exportMyData(): Promise<Record<string, unknown>> {
  return apiRequest<Record<string, unknown>>('/me/export/', { method: 'GET' });
}

export async function deleteMyAccount(password: string): Promise<void> {
  await apiRequest('/me/account/', {
    method: 'DELETE',
    body: { password },
  });
}

export async function submitStudyConsent(version = '1.0'): Promise<void> {
  await apiRequest('/me/consent/', {
    method: 'POST',
    body: { consent_version: version },
  });
}

export async function getStudyConsent(): Promise<{ consented: boolean }> {
  return apiRequest<{ consented: boolean }>('/me/consent/', { method: 'GET' });
}

export async function submitEvaluation(payload: {
  instrument: string;
  scores: Record<string, number>;
  participant_code?: string;
  notes?: string;
}): Promise<void> {
  await apiRequest('/me/evaluation/', {
    method: 'POST',
    body: payload,
  });
}
