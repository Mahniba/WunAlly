/**
 * What the expectant mother should expect each trimester. Informational only.
 * Focus: experiences and symptoms, not mitigation.
 */

export interface TrimesterExpectation {
  trimester: 'first' | 'second' | 'third';
  title: string;
  /** What the expectant mother should expect (symptoms, body changes, experiences). */
  expectations: string[];
  mitigation: string[];
}

export const trimesterExpectations: TrimesterExpectation[] = [
  {
    trimester: 'first',
    title: 'First Trimester (Weeks 1–13)',
    expectations: [
      'Nausea or morning sickness, especially in the first few weeks.',
      'Feeling very tired or exhausted.',
      'Tender or sore breasts.',
      'Needing to pass urine more often.',
      'Food aversions or strong cravings.',
      'Mood swings or feeling emotional.',
      'Some spotting or light bleeding (always report to your provider).',
      'Bloating or mild cramping.',
    ],
    mitigation: [],
  },
  {
    trimester: 'second',
    title: 'Second Trimester (Weeks 14–27)',
    expectations: [
      'More energy for many; nausea often eases.',
      'Feeling your baby move (quickening), usually by 18–25 weeks.',
      'Your belly grows and you may see stretch marks.',
      'Stuffy nose or nosebleeds.',
      'Heartburn or indigestion.',
      'Backache or round ligament pain (sides of belly).',
      'Skin changes (line on belly, patches).',
      'Braxton Hicks (practice contractions) later in this trimester.',
    ],
    mitigation: [],
  },
  {
    trimester: 'third',
    title: 'Third Trimester (Weeks 28–40+)',
    expectations: [
      'Shortness of breath as the baby grows upward.',
      'Trouble sleeping or finding a comfortable position.',
      'Swelling in feet, ankles, or hands.',
      'Braxton Hicks contractions more noticeable.',
      'Needing the bathroom very often.',
      'Fatigue may return.',
      'Baby “dropping” (moving lower) closer to due date.',
      'Leaking colostrum from breasts (normal).',
    ],
    mitigation: [],
  },
];

export function getTrimesterExpectation(trimester: 'first' | 'second' | 'third'): TrimesterExpectation {
  return trimesterExpectations.find((t) => t.trimester === trimester) ?? trimesterExpectations[0];
}
