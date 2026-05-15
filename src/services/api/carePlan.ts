import { apiRequest } from './client';

export interface ApiCarePlan {
  medical: string;
  labour_preferences: string;
  updated_at?: string;
}

export async function getCarePlan(): Promise<ApiCarePlan> {
  return apiRequest<ApiCarePlan>('/me/care-plan/');
}

export async function updateCarePlan(
  payload: Partial<ApiCarePlan>
): Promise<ApiCarePlan> {
  return apiRequest<ApiCarePlan>('/me/care-plan/', { method: 'PATCH', body: payload });
}
