import { apiRequest } from './client';

export interface PersonalizedTip {
  title: string;
  body: string;
  source: string;
}

export interface TipsResponse {
  week: number;
  tips: PersonalizedTip[];
}

export async function fetchPersonalizedTips(week?: number): Promise<TipsResponse> {
  const path = week !== undefined ? `/me/tips/?week=${week}` : '/me/tips/';
  return apiRequest<TipsResponse>(path);
}
