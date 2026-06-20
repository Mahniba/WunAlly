import type { SymptomEntry } from '../store/useSymptomsStore';

export interface RuleAlert {
  symptom: string;
  count: number;
  windowDays: number;
  message: string;
}

const WARNING_KEYS = new Set([
  'severe_headache',
  'blurred_vision',
  'vaginal_bleeding',
  'severe_abdominal_pain',
  'fever',
  'severe_vomiting',
  'reduced_baby_movement',
  'dizziness',
  'difficulty_breathing',
  'swelling_face_hands_feet',
]);

const SYMPTOM_LABELS: Record<string, string> = {
  nausea: 'nausea',
  headache: 'headache',
  dizzy: 'dizziness',
  severe_headache: 'severe headache',
  vaginal_bleeding: 'bleeding',
  reduced_baby_movement: 'reduced baby movement',
  fever: 'fever',
};

function allSymptomKeys(entries: SymptomEntry[]): string[] {
  const keys = new Set<string>();
  for (const e of entries) {
    for (const k of Object.keys(e.symptoms ?? {})) keys.add(k);
  }
  return Array.from(keys);
}

function countInWindow(entries: SymptomEntry[], days: number, key: string): number {
  const now = new Date();
  const thresholdDate = new Date();
  thresholdDate.setDate(now.getDate() - (days - 1));
  return entries.filter((e) => {
    const ed = new Date(e.date);
    return ed >= thresholdDate && Boolean(e.symptoms?.[key]);
  }).length;
}

/** Rule evaluation: alerts when symptom frequency exceeds thresholds (warning signs prioritized). */
export function evaluateSymptomRules(entries: SymptomEntry[]): RuleAlert[] {
  if (!entries.length) return [];

  const alerts: RuleAlert[] = [];
  const keys = allSymptomKeys(entries).sort((a, b) => {
    const aw = WARNING_KEYS.has(a) ? 0 : 1;
    const bw = WARNING_KEYS.has(b) ? 0 : 1;
    return aw - bw;
  });

  for (const s of keys) {
    const label = SYMPTOM_LABELS[s] ?? s.replace(/_/g, ' ');
    const c7 = countInWindow(entries, 7, s);
    const warnThreshold7 = WARNING_KEYS.has(s) ? 1 : 4;
    const warnThreshold14 = WARNING_KEYS.has(s) ? 2 : 6;

    if (c7 >= warnThreshold7) {
      alerts.push({
        symptom: s,
        count: c7,
        windowDays: 7,
        message: WARNING_KEYS.has(s)
          ? `You logged ${label} recently. Contact your care provider if you are worried or symptoms worsen.`
          : `You've reported ${label} ${c7} times in the past 7 days. Consider contacting your provider.`,
      });
      continue;
    }
    const c14 = countInWindow(entries, 14, s);
    if (c14 >= warnThreshold14) {
      alerts.push({
        symptom: s,
        count: c14,
        windowDays: 14,
        message: `You've reported ${label} ${c14} times in the past 14 days. Consider contacting your provider.`,
      });
    }
  }

  return alerts;
}
