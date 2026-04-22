import type { SymptomEntry, SymptomKeys } from '../store/useSymptomsStore';

export interface RuleAlert {
  symptom: keyof SymptomEntry['symptoms'];
  count: number;
  windowDays: number;
  message: string;
}

// Simple rule evaluation: return alerts when occurrences exceed thresholds
export function evaluateSymptomRules(entries: SymptomEntry[]): RuleAlert[] {
  const alerts: RuleAlert[] = [];
  const now = new Date();

  function countInWindow(days: number, key: SymptomKeys) {
    const thresholdDate = new Date();
    thresholdDate.setDate(now.getDate() - (days - 1));
    return entries.filter((e) => {
      const ed = new Date(e.date);
      return ed >= thresholdDate && e.symptoms[key];
    }).length;
  }

  // rule examples: if >=4 in 7 days or >=6 in 14 days -> suggest doctor
  const symptoms = Object.keys(entries[0]?.symptoms || { nausea: false, headache: false, dizzy: false }) as SymptomKeys[];
  for (const s of symptoms) {
    const c7 = countInWindow(7, s);
    if (c7 >= 4) {
      alerts.push({ symptom: s, count: c7, windowDays: 7, message: `You've reported ${s} ${c7} times in the past 7 days. Consider contacting your provider.` });
      continue;
    }
    const c14 = countInWindow(14, s);
    if (c14 >= 6) {
      alerts.push({ symptom: s, count: c14, windowDays: 14, message: `You've reported ${s} ${c14} times in the past 14 days. Consider contacting your provider.` });
    }
  }

  return alerts;
}
