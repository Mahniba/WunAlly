import { apiRequest } from './client';
import { currentLanguage } from '../../i18n';

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
  const lang = currentLanguage();
  const params = new URLSearchParams({ language: lang });
  if (week !== undefined) params.set('week', String(week));
  return apiRequest<TipsResponse>(`/me/tips/?${params.toString()}`);
}
