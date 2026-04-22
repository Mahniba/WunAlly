import type { UserProfile } from '../types';
import type { MoodEntry } from '../store/useMoodStore';
import type { SymptomEntry, SymptomKeys } from '../store/useSymptomsStore';

type Tip = { title: string; body: string };

function mostRecentMood(entries: MoodEntry[]): MoodEntry | null {
  if (!entries || entries.length === 0) return null;
  return entries.reduce((a, b) => (a.timestamp >= b.timestamp ? a : b));
}

function countSymptoms(entries: SymptomEntry[], windowDays: number) {
  const since = Date.now() - windowDays * 24 * 60 * 60 * 1000;
  const base: Record<SymptomKeys, number> = { nausea: 0, headache: 0, dizzy: 0 };
  for (const e of entries) {
    const t = new Date(e.date).getTime();
    if (!Number.isFinite(t) || t < since) continue;
    for (const k of Object.keys(base) as SymptomKeys[]) {
      if (e.symptoms?.[k]) base[k] += 1;
    }
  }
  return base;
}

function avgRecent(entries: SymptomEntry[], key: 'sleepHours' | 'painLevel', windowDays: number) {
  const since = Date.now() - windowDays * 24 * 60 * 60 * 1000;
  const vals: number[] = [];
  for (const e of entries) {
    const t = new Date(e.date).getTime();
    if (!Number.isFinite(t) || t < since) continue;
    const v = e[key];
    if (typeof v === 'number' && Number.isFinite(v)) vals.push(v);
  }
  if (vals.length === 0) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

export function getPersonalizedTips(args: {
  profile: UserProfile | null;
  moodEntries: MoodEntry[];
  symptomEntries: SymptomEntry[];
  week: number;
}): Tip[] {
  const { profile, moodEntries, symptomEntries, week } = args;
  const tips: Tip[] = [];

  const ageNum = profile?.age ? Number(profile.age) : null;
  const health = (profile?.healthConditions || '').trim();

  const mood = mostRecentMood(moodEntries);
  const counts7 = countSymptoms(symptomEntries, 7);
  const sleepAvg7 = avgRecent(symptomEntries, 'sleepHours', 7);
  const painAvg7 = avgRecent(symptomEntries, 'painLevel', 7);

  // 1) Mood-aware support
  if (mood?.mood === 'anxious' || mood?.mood === 'stressed') {
    tips.push({
      title: 'Stress support (quick reset)',
      body: 'Try 4–6 slow breaths, shoulder rolls, and a short walk if you can. If worry feels intense or constant, consider reaching out to your provider or support person today.',
    });
  } else if (mood?.mood === 'sad') {
    tips.push({
      title: 'Gentle check-in',
      body: 'You’ve logged a low mood recently. Small steps help: message a friend, step into fresh air, drink water, and rest. If sadness is persistent, your provider can help with safe options.',
    });
  } else if (mood?.mood === 'tired' || mood?.mood === 'sleepy') {
    tips.push({
      title: 'Energy & sleep',
      body: 'Plan one “rest block” today. Try side-sleeping with a pillow between knees, and keep a small snack + water nearby to reduce wakeups.',
    });
  }

  // 2) Symptoms trends
  const topSymptom = (Object.entries(counts7).sort((a, b) => b[1] - a[1])[0] ?? null) as
    | [SymptomKeys, number]
    | null;
  if (topSymptom && topSymptom[1] > 0) {
    const [k, c] = topSymptom;
    const label = k === 'dizzy' ? 'dizziness' : k;
    tips.push({
      title: `Symptom focus: ${label}`,
      body:
        k === 'nausea'
          ? `You logged nausea ${c} time(s) this week. Try smaller meals, ginger/peppermint if it helps, and avoid long gaps without food. If you can’t keep fluids down, contact your provider.`
          : k === 'headache'
          ? `You logged headaches ${c} time(s) this week. Hydration + regular meals often help. If headaches are severe, sudden, or with vision changes, contact your provider urgently.`
          : `You logged dizziness ${c} time(s) this week. Sit/stand slowly, hydrate, and eat regularly. If dizziness is frequent or you faint, contact your provider.`,
    });
  }

  // 3) Sleep & pain signals (from Daily Symptom Check)
  if (sleepAvg7 !== null && sleepAvg7 < 6.5) {
    tips.push({
      title: 'Sleep target',
      body: `Your recent sleep average is about ${sleepAvg7.toFixed(1)}h. Aim for a consistent bedtime, side-sleeping, and a short wind-down (dim lights, no scrolling) for 20 minutes.`,
    });
  }
  if (painAvg7 !== null && painAvg7 >= 5) {
    tips.push({
      title: 'Pain plan',
      body: `Your recent pain average is about ${painAvg7.toFixed(1)}/10. Try gentle stretching, warm shower/heat (if OK), and changing positions often. If pain is severe or worsening, contact your provider.`,
    });
  }

  // 4) Week context (light personalization)
  tips.push({
    title: `This week (Week ${week})`,
    body: 'Focus on hydration, iron-rich foods, and short walks if comfortable. Small, consistent habits tend to work better than big changes.',
  });

  // 5) Profile context
  if (typeof ageNum === 'number' && Number.isFinite(ageNum) && ageNum >= 35) {
    tips.push({
      title: 'Appointments & monitoring',
      body: 'If you’re 35+, your provider may recommend extra monitoring. Keep your appointments and ask what warning signs should prompt a call.',
    });
  }
  if (health) {
    tips.push({
      title: 'Health conditions note',
      body: `You noted: “${health}”. Keep a short list of questions for your next appointment so your plan stays personalized.`,
    });
  }

  // Deduplicate by title, cap for UI
  const seen = new Set<string>();
  const unique = tips.filter((t) => (seen.has(t.title) ? false : (seen.add(t.title), true)));
  return unique.slice(0, 6);
}

