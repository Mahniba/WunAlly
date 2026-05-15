export interface ApiUser {
  id: string | number;
  email: string;
  name: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthResponse {
  user: ApiUser;
  access: string;
  refresh: string;
}

export interface ApiProfile {
  name: string;
  age: string | number | null;
  weeks_pregnant: number;
  due_date: string | null;
  health_conditions: string;
  due_date_set?: boolean;
}

export interface ApiSymptomEntry {
  id: string | number;
  recorded_at: string;
  category?: string;
  symptoms: Record<string, boolean>;
  notes?: string;
  sleep_hours?: number | null;
  pain_level?: number | null;
  food_note?: string;
  client_id?: string;
}

export interface ApiMoodEntry {
  id: string | number;
  mood: string;
  note?: string;
  recorded_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
