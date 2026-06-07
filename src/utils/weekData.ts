import { WeekInfo } from '../types';

export type BabySizeArtKey = 'banana' | 'watermelon' | 'mango' | 'coconut' | 'yam' | 'pregnant';

type WeekEntry = WeekInfo & { artKey: BabySizeArtKey };

/**
 * Offline-friendly weekly guidance (informational only).
 * Baby size comparisons use familiar foods common in Cameroon/West Africa
 * where possible (pawpaw, plantain, yam, mango, coconut, watermelon).
 * Do NOT use for diagnosis. Always refer to a care provider.
 */
const weekDatabase: Record<number, WeekEntry> = {
  1: { week: 1, trimester: 'first', babySize: 'a poppy seed', artKey: 'yam', development: 'Fertilization and early cell division.', tips: ['Start taking folate if you haven’t already.', 'Book your first prenatal visit.'] },
  2: { week: 2, trimester: 'first', babySize: 'a sesame seed', artKey: 'yam', development: 'The fertilized egg implants in the uterus.', tips: ['Avoid alcohol and smoking.', 'Eat a balanced diet.'] },
  3: { week: 3, trimester: 'first', babySize: 'a lentil', artKey: 'yam', development: 'Neural tube begins to form.', tips: ['Take 400–800 mcg folate daily.', 'Stay hydrated.'] },
  4: { week: 4, trimester: 'first', babySize: 'a grain of millet', artKey: 'yam', development: 'Heart and circulatory system start developing.', tips: ['Continue prenatal vitamins.', 'Rest when you feel tired.'] },
  5: { week: 5, trimester: 'first', babySize: 'a sweet pea', artKey: 'yam', development: 'Brain, spine, and heart are forming.', tips: ['Eat small meals if you have nausea.', 'Avoid raw or undercooked foods.'] },
  6: { week: 6, trimester: 'first', babySize: 'a sweet pea', artKey: 'yam', development: 'Face and limb buds appear.', tips: ['Ginger or small snacks may help nausea.', 'Stay in touch with your care provider.'] },
  7: { week: 7, trimester: 'first', babySize: 'a blueberry', artKey: 'yam', development: 'Baby’s brain is growing quickly.', tips: ['Rest when you need to.', 'Keep taking folate and vitamins.'] },
  8: { week: 8, trimester: 'first', babySize: 'a kidney bean', artKey: 'yam', development: 'Fingers and toes are forming.', tips: ['Eat iron-rich foods when you can.', 'Light walking is usually fine.'] },
  9: { week: 9, trimester: 'first', babySize: 'a grape', artKey: 'mango', development: 'Muscles and movements begin.', tips: ['Small, frequent meals help many people.', 'Drink plenty of water.'] },
  10: { week: 10, trimester: 'first', babySize: 'a small mango', artKey: 'mango', development: 'Organs are forming and growing.', tips: ['Schedule your first ultrasound if needed.', 'Rest and listen to your body.'] },
  11: { week: 11, trimester: 'first', babySize: 'a fig', artKey: 'mango', development: 'Baby is moving; you may not feel it yet.', tips: ['Continue prenatal care visits.', 'Eat a variety of fruits and vegetables.'] },
  12: { week: 12, trimester: 'first', babySize: 'a lime', artKey: 'mango', development: 'Reflexes and vocal cords develop.', tips: ['Nausea often improves around this time.', 'Stay active in ways that feel good.'] },
  13: { week: 13, trimester: 'first', babySize: 'a peach', artKey: 'mango', development: 'First trimester ends; baby is fully formed in miniature.', tips: ['You may have more energy now.', 'Keep up with vitamins and healthy eating.'] },
  14: { week: 14, trimester: 'second', babySize: 'a lemon', artKey: 'mango', development: 'Baby can make facial expressions.', tips: ['Second trimester often feels better.', 'Eat enough protein and iron.'] },
  15: { week: 15, trimester: 'second', babySize: 'an apple', artKey: 'mango', development: 'Bones are hardening; skin is sensitive to touch.', tips: ['Stay hydrated.', 'Light exercise is usually safe—ask your provider.'] },
  16: { week: 16, trimester: 'second', babySize: 'an avocado', artKey: 'mango', development: 'Baby may hear your voice and heartbeat.', tips: ['Talk or sing to your baby if you like.', 'Rest when you need to.'] },
  17: { week: 17, trimester: 'second', babySize: 'a pear', artKey: 'banana', development: 'Fat stores begin; baby is more active.', tips: ['Eat iron-rich foods: beans, greens, lean meat.', 'Sleep on your side if comfortable.'] },
  18: { week: 18, trimester: 'second', babySize: 'a sweet potato', artKey: 'yam', development: 'Ears are in place; baby may hear sounds.', tips: ['You might feel first movements.', 'Continue prenatal visits.'] },
  19: { week: 19, trimester: 'second', babySize: 'a mango', artKey: 'mango', development: 'Vernix protects the skin.', tips: ['Eat small, frequent meals if heartburn appears.', 'Stay active in a way that suits you.'] },
  20: { week: 20, trimester: 'second', babySize: 'a banana', artKey: 'banana', development: 'Halfway there; baby swallows and practices digestion.', tips: ['Mid-pregnancy scan is often around now.', 'Rest and eat well.'] },
  21: { week: 21, trimester: 'second', babySize: 'a carrot', artKey: 'banana', development: 'Bone marrow starts making blood cells.', tips: ['Iron and folate remain important.', 'Drink plenty of water.'] },
  22: { week: 22, trimester: 'second', babySize: 'a pawpaw (papaya)', artKey: 'mango', development: 'Senses are developing; baby may respond to light and sound.', tips: ['Eat calcium-rich foods.', 'Light walking can help energy and sleep.'] },
  23: { week: 23, trimester: 'second', babySize: 'a grapefruit', artKey: 'mango', development: 'Lungs are preparing for breathing.', tips: ['Rest when tired.', 'Keep taking prenatal vitamins.'] },
  24: { week: 24, trimester: 'second', babySize: 'a pawpaw (papaya)', artKey: 'mango', development: "Baby's senses are developing; they can hear and may respond to touch.", tips: ['Eat iron-rich foods and rest.', 'Stay hydrated.'] },
  25: { week: 25, trimester: 'second', babySize: 'a cauliflower', artKey: 'coconut', development: 'Baby is gaining weight; skin is smoothing.', tips: ['Continue prenatal vitamins.', 'Light walking is good for many.'] },
  26: { week: 26, trimester: 'second', babySize: 'a small coconut', artKey: 'coconut', development: 'Lungs are developing; baby practices breathing movements.', tips: ['Eat small, frequent meals.', 'Rest when you need to.'] },
  27: { week: 27, trimester: 'second', babySize: 'a cabbage', artKey: 'coconut', development: 'Brain is growing; sleep and wake cycles appear.', tips: ['Sleep on your side if comfortable.', 'Keep up with iron-rich foods.'] },
  28: { week: 28, trimester: 'third', babySize: 'an eggplant', artKey: 'coconut', development: 'Third trimester begins; baby’s eyes can open.', tips: ['You may have more checkups now.', 'Rest and eat well.'] },
  29: { week: 29, trimester: 'third', babySize: 'a large pawpaw', artKey: 'mango', development: 'Muscles and lungs are maturing.', tips: ['Stay hydrated.', 'Report any concerns to your care provider.'] },
  30: { week: 30, trimester: 'third', babySize: 'a cucumber', artKey: 'banana', development: 'Baby is gaining weight and getting stronger.', tips: ['Eat enough protein and calories.', 'Rest when you need to.'] },
  31: { week: 31, trimester: 'third', babySize: 'a coconut', artKey: 'coconut', development: 'Baby can turn toward light and recognize your voice.', tips: ['Sleep on your left side if possible.', 'Keep taking vitamins.'] },
  32: { week: 32, trimester: 'third', babySize: 'a coconut', artKey: 'coconut', development: 'Lungs are almost ready; baby practices breathing.', tips: ['Small meals can help heartburn.', 'Stay in touch with your care team.'] },
  33: { week: 33, trimester: 'third', babySize: 'a pineapple', artKey: 'mango', development: 'Bones are hardening; baby is less cramped for now.', tips: ['Rest when you can.', 'Eat iron-rich foods.'] },
  34: { week: 34, trimester: 'third', babySize: 'a cantaloupe', artKey: 'watermelon', development: 'Central nervous system and lungs are maturing.', tips: ['Drink plenty of water.', 'Light movement can help.'] },
  35: { week: 35, trimester: 'third', babySize: 'a honeydew melon', artKey: 'watermelon', development: 'Baby is putting on fat and getting rounder.', tips: ['Rest and save energy.', 'Continue prenatal visits.'] },
  36: { week: 36, trimester: 'third', babySize: 'a pawpaw (papaya)', artKey: 'mango', development: 'Baby may move down; lungs are nearly ready.', tips: ['Pack your bag if you plan to give birth at a facility.', 'Rest when you need to.'] },
  37: { week: 37, trimester: 'third', babySize: 'a large yam', artKey: 'yam', development: 'Full term; baby could arrive any time.', tips: ['Watch for signs of labor.', 'Stay calm and reach out to your provider with questions.'] },
  38: { week: 38, trimester: 'third', babySize: 'a plantain', artKey: 'banana', development: 'Baby is ready; brain and lungs are mature.', tips: ['Rest and eat well.', 'Have your support person and provider contacts ready.'] },
  39: { week: 39, trimester: 'third', babySize: 'a mini watermelon', artKey: 'watermelon', development: 'Baby is full term and may arrive soon.', tips: ['Stay hydrated.', 'Rest and listen to your body.'] },
  40: { week: 40, trimester: 'third', babySize: 'a watermelon', artKey: 'watermelon', development: 'Due week; baby is ready to meet you.', tips: ['Keep in touch with your care provider.', 'Rest and stay supported.'] },
  41: { week: 41, trimester: 'third', babySize: 'a small pumpkin', artKey: 'watermelon', development: 'Post-due; many babies arrive this week.', tips: ['Follow your provider’s guidance on monitoring.', 'Rest and stay calm.'] },
  42: { week: 42, trimester: 'third', babySize: 'a newborn', artKey: 'pregnant', development: 'Post-term; induction may be discussed with your provider.', tips: ['Stay in close contact with your care team.', 'Rest and prepare for birth.'] },
};

function buildWeek(week: number): WeekEntry {
  const stored = weekDatabase[week];
  if (stored) return stored;
  const trimester: 'first' | 'second' | 'third' =
    week < 14 ? 'first' : week < 28 ? 'second' : 'third';
  return {
    week,
    trimester,
    babySize: 'a small fruit',
    artKey: 'mango',
    development: 'Baby is growing every day.',
    tips: ['Take care of yourself.', 'Rest when you need to.'],
  };
}

export function getWeekInfo(week: number): WeekInfo {
  const w = Math.max(1, Math.min(42, Math.floor(week)));
  const { artKey: _artKey, ...info } = buildWeek(w);
  return info;
}

export function getBabySizeVisual(week: number): {
  babySize: string;
  development: string;
  artKey: BabySizeArtKey;
} {
  const entry = buildWeek(Math.max(1, Math.min(42, Math.floor(week))));
  return {
    babySize: entry.babySize,
    development: entry.development,
    artKey: entry.artKey,
  };
}

/** e.g. "a pawpaw (papaya)" → "Baby is about the size of a pawpaw (papaya)." */
export function formatBabySizeLine(babySize: string): string {
  const trimmed = babySize.trim();
  if (!trimmed) return 'Baby is growing every day.';
  const article = /^[aeiou]/i.test(trimmed) ? 'an' : 'a';
  const needsArticle = !/^(a|an)\s/i.test(trimmed);
  const phrase = needsArticle ? `${article} ${trimmed}` : trimmed;
  return `Baby is about the size of ${phrase}.`;
}

export function getTrimesterLabel(t: 'first' | 'second' | 'third'): string {
  const labels = { first: 'First Trimester', second: 'Second Trimester', third: 'Third Trimester' };
  return labels[t];
}

export function getAllWeeks(): number[] {
  return Array.from({ length: 42 }, (_, i) => i + 1);
}

/** @deprecated Use getBabySizeVisual instead. */
export function getAfricanFruitForWeek(week: number) {
  const visual = getBabySizeVisual(week);
  return { label: visual.babySize, artKey: visual.artKey };
}
