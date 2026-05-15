import type { UserProfile } from '../types';
import type { MoodEntry, MoodType } from '../store/useMoodStore';
import type { SymptomEntry } from '../store/useSymptomsStore';
import type { PersonalizedTip } from '../services/api/tips';

type Tip = PersonalizedTip;

const SYMPTOM_GUIDANCE: Record<string, string> = {
  nausea: 'Try smaller meals and ginger if it helps. If you cannot keep fluids down, contact your provider.',
  headache:
    'Hydration and regular meals often help. Severe or sudden headaches with vision changes need urgent care.',
  dizzy: 'Sit and stand slowly, hydrate, and eat regularly. Frequent dizziness or fainting needs a provider call.',
  dizziness: 'Sit and stand slowly, hydrate, and eat regularly. Frequent dizziness or fainting needs a provider call.',
  severe_headache:
    'Severe headaches in pregnancy should be evaluated — contact your provider, especially with vision changes.',
  vaginal_bleeding: 'Any bleeding should be reported to your provider promptly.',
  reduced_baby_movement: "If baby's movements feel reduced, contact your provider today for guidance.",
  fever: 'Fever in pregnancy should be checked — contact your provider for safe next steps.',
};

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

function mostRecentMood(entries: MoodEntry[]): MoodEntry | null {
  if (!entries?.length) return null;
  return entries.reduce((a, b) => (a.timestamp >= b.timestamp ? a : b));
}

function countAllSymptoms(entries: SymptomEntry[], windowDays: number): Map<string, number> {
  const since = Date.now() - windowDays * 24 * 60 * 60 * 1000;
  const counts = new Map<string, number>();
  for (const e of entries) {
    const t = new Date(e.date).getTime();
    if (!Number.isFinite(t) || t < since) continue;
    for (const [key, active] of Object.entries(e.symptoms ?? {})) {
      if (active) counts.set(key, (counts.get(key) || 0) + 1);
    }
  }
  return counts;
}

function avgRecent(
  entries: SymptomEntry[],
  key: 'sleepHours' | 'painLevel',
  windowDays: number
): number | null {
  const since = Date.now() - windowDays * 24 * 60 * 60 * 1000;
  const vals: number[] = [];
  for (const e of entries) {
    const t = new Date(e.date).getTime();
    if (!Number.isFinite(t) || t < since) continue;
    const v = e[key];
    if (typeof v === 'number' && Number.isFinite(v)) vals.push(v);
  }
  if (!vals.length) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function weekBandTip(week: number): Tip {
  if (week <= 13) {
    return {
      title: `First trimester focus (Week ${week})`,
      body: 'Folate, rest when tired, and small frequent meals if nauseous. Keep your prenatal visits.',
      source: 'week',
    };
  }
  if (week <= 27) {
    return {
      title: `Second trimester focus (Week ${week})`,
      body: 'Gentle activity, iron-rich foods, and noting baby movements as they begin.',
      source: 'week',
    };
  }
  return {
    title: `Third trimester focus (Week ${week})`,
    body: 'Rest when needed, sleep on your side if comfortable, and know your warning signs.',
    source: 'week',
  };
}

function moodTip(mood: MoodType): Tip | null {
  const map: Partial<Record<MoodType, Tip>> = {
    anxious: {
      title: 'Stress support (quick reset)',
      body: 'Try slow breaths and a short walk. Reach out to your provider if worry feels constant.',
      source: 'mood',
    },
    stressed: {
      title: 'Stress support (quick reset)',
      body: 'Try slow breaths and a short walk. Reach out to your provider if worry feels constant.',
      source: 'mood',
    },
    sad: {
      title: 'Gentle check-in',
      body: 'Small steps help: rest, hydrate, and connect with someone you trust.',
      source: 'mood',
    },
    tired: {
      title: 'Energy & sleep',
      body: 'Plan a rest block today and side-sleep with a pillow between knees if comfortable.',
      source: 'mood',
    },
    sleepy: {
      title: 'Energy & sleep',
      body: 'Plan a rest block today and side-sleep with a pillow between knees if comfortable.',
      source: 'mood',
    },
  };
  return map[mood] ?? null;
}

/** Offline fallback when /me/tips/ is unavailable. */
export function getPersonalizedTipsLocal(args: {
  profile: UserProfile | null;
  moodEntries: MoodEntry[];
  symptomEntries: SymptomEntry[];
  week: number;
}): Tip[] {
  const { profile, moodEntries, symptomEntries, week } = args;
  const tips: Tip[] = [];
  const seen = new Set<string>();

  const add = (tip: Tip) => {
    if (seen.has(tip.title)) return;
    seen.add(tip.title);
    tips.push(tip);
  };

  const mood = mostRecentMood(moodEntries);
  if (mood) {
    const mt = moodTip(mood.mood);
    if (mt) add(mt);
  }

  const counts7 = countAllSymptoms(symptomEntries, 7);
  const warnings = [...counts7.keys()].filter((k) => WARNING_KEYS.has(k) && (counts7.get(k) || 0) > 0);
  if (warnings.length) {
    add({
      title: 'Important symptoms logged',
      body: `You recently noted warning signs. Contact your care provider if concerned or symptoms worsen.`,
      source: 'warning',
    });
  }

  const sorted = [...counts7.entries()].sort((a, b) => b[1] - a[1]);
  if (sorted.length && sorted[0][1] > 0) {
    const [key, count] = sorted[0];
    const label = key.replace(/_/g, ' ');
    add({
      title: `Symptom focus: ${label}`,
      body:
        SYMPTOM_GUIDANCE[key] ||
        `You logged ${label} ${count} time(s) this week. Discuss persistent symptoms with your provider.`,
      source: 'symptom',
    });
  }

  const sleepAvg = avgRecent(symptomEntries, 'sleepHours', 7);
  if (sleepAvg !== null && sleepAvg < 6.5) {
    add({
      title: 'Sleep target',
      body: `Your recent sleep average is about ${sleepAvg.toFixed(1)}h. Try a consistent bedtime routine.`,
      source: 'sleep',
    });
  }

  const painAvg = avgRecent(symptomEntries, 'painLevel', 7);
  if (painAvg !== null && painAvg >= 5) {
    add({
      title: 'Pain plan',
      body: `Your recent pain average is about ${painAvg.toFixed(1)}/10. Contact your provider if pain is severe.`,
      source: 'pain',
    });
  }

  const ageNum = profile?.age ? Number(profile.age) : null;
  if (typeof ageNum === 'number' && Number.isFinite(ageNum) && ageNum >= 35) {
    add({
      title: 'Appointments & monitoring',
      body: 'If you are 35+, your provider may recommend extra monitoring. Keep your appointments.',
      source: 'profile',
    });
  }

  if (profile?.healthConditions?.trim()) {
    add({
      title: 'Your health note',
      body: `You noted: "${profile.healthConditions.trim()}". Bring questions to your next visit.`,
      source: 'profile',
    });
  }

  add(weekBandTip(week));
  return tips.slice(0, 8);
}
