import type { UserProfile } from '../../types';
import type { ApiProfile } from './types';

export function apiProfileToUserProfile(api: ApiProfile): UserProfile {
  return {
    name: api.name ?? '',
    age: api.age != null && api.age !== '' ? String(api.age) : '',
    weeksPregnant: api.weeks_pregnant ?? 24,
    dueDate: api.due_date ?? '',
    healthConditions: api.health_conditions ?? '',
    dueDateSet: api.due_date_set ?? false,
  };
}

export function userProfileToApiProfile(profile: UserProfile): Partial<ApiProfile> {
  return {
    name: profile.name,
    age: profile.age || null,
    weeks_pregnant: profile.weeksPregnant,
    due_date: profile.dueDate || null,
    health_conditions: profile.healthConditions,
    due_date_set: profile.dueDateSet ?? !!profile.dueDate,
  };
}
