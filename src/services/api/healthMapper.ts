import type { MoodEntry, MoodType } from '../../store/useMoodStore';
import type { SymptomEntry } from '../../store/useSymptomsStore';
import type { ApiMoodEntry, ApiSymptomEntry } from './types';
import type { CreateMoodPayload } from './moods';
import type { CreateSymptomPayload } from './symptoms';

const MOOD_TYPES: MoodType[] = [
  'tired',
  'sleepy',
  'confused',
  'sad',
  'anxious',
  'stressed',
  'happy',
  'ok',
];

function isMoodType(value: string): value is MoodType {
  return MOOD_TYPES.includes(value as MoodType);
}

export function apiSymptomToLocal(api: ApiSymptomEntry): SymptomEntry {
  return {
    id: api.client_id ? String(api.client_id) : String(api.id),
    date: api.recorded_at,
    symptoms: api.symptoms ?? {},
    notes: api.notes || undefined,
    sleepHours: api.sleep_hours ?? undefined,
    painLevel: api.pain_level ?? undefined,
    foodNote: api.food_note || undefined,
  };
}

export function localSymptomToCreatePayload(
  entry: SymptomEntry,
  category = 'warning_signs'
): CreateSymptomPayload {
  return {
    recorded_at: entry.date,
    category,
    symptoms: entry.symptoms,
    notes: entry.notes,
    sleep_hours: entry.sleepHours,
    pain_level: entry.painLevel,
    food_note: entry.foodNote,
    client_id: entry.id,
  };
}

export function apiMoodToLocal(api: ApiMoodEntry): MoodEntry {
  const mood = isMoodType(api.mood) ? api.mood : 'ok';
  return {
    id: api.client_id ? String(api.client_id) : String(api.id),
    mood,
    timestamp: new Date(api.recorded_at).getTime(),
    note: api.note || undefined,
  };
}

export function localMoodToCreatePayload(entry: MoodEntry): CreateMoodPayload {
  return {
    mood: entry.mood,
    note: entry.note,
    recorded_at: new Date(entry.timestamp).toISOString(),
    client_id: entry.id,
  };
}

export function mergeSymptomEntries(local: SymptomEntry[], remote: SymptomEntry[]): SymptomEntry[] {
  const map = new Map<string, SymptomEntry>();
  for (const entry of local) {
    map.set(entry.id, entry);
  }
  for (const entry of remote) {
    map.set(entry.id, entry);
  }
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function mergeMoodEntries(local: MoodEntry[], remote: MoodEntry[]): MoodEntry[] {
  const map = new Map<string, MoodEntry>();
  for (const entry of local) {
    map.set(entry.id, entry);
  }
  for (const entry of remote) {
    map.set(entry.id, entry);
  }
  return Array.from(map.values()).sort((a, b) => b.timestamp - a.timestamp);
}
