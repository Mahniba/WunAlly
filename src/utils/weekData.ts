import { WeekInfo } from '../types';

/**
 * Offline-friendly weekly guidance (informational only).
 * Do NOT use for diagnosis. Always refer to a care provider.
 */
const weekDatabase: Record<number, WeekInfo> = {
  1: { week: 1, trimester: 'first', babySize: 'a poppy seed', development: 'Fertilization and early cell division.', tips: ['Start taking folate if you haven’t already.', 'Book your first prenatal visit.'] },
  2: { week: 2, trimester: 'first', babySize: 'a sesame seed', development: 'The fertilized egg implants in the uterus.', tips: ['Avoid alcohol and smoking.', 'Eat a balanced diet.'] },
  3: { week: 3, trimester: 'first', babySize: 'a lentil', development: 'Neural tube begins to form.', tips: ['Take 400–800 mcg folate daily.', 'Stay hydrated.'] },
  4: { week: 4, trimester: 'first', babySize: 'a blueberry', development: 'Heart and circulatory system start developing.', tips: ['Continue prenatal vitamins.', 'Rest when you feel tired.'] },
  5: { week: 5, trimester: 'first', babySize: 'a raspberry', development: 'Brain, spine, and heart are forming.', tips: ['Eat small meals if you have nausea.', 'Avoid raw or undercooked foods.'] },
  6: { week: 6, trimester: 'first', babySize: 'a sweet pea', development: 'Face and limb buds appear.', tips: ['Ginger or small snacks may help nausea.', 'Stay in touch with your care provider.'] },
  7: { week: 7, trimester: 'first', babySize: 'a blueberry', development: 'Baby’s brain is growing quickly.', tips: ['Rest when you need to.', 'Keep taking folate and vitamins.'] },
  8: { week: 8, trimester: 'first', babySize: 'a kidney bean', development: 'Fingers and toes are forming.', tips: ['Eat iron-rich foods when you can.', 'Light walking is usually fine.'] },
  9: { week: 9, trimester: 'first', babySize: 'a grape', development: 'Muscles and movements begin.', tips: ['Small, frequent meals help many people.', 'Drink plenty of water.'] },
  10: { week: 10, trimester: 'first', babySize: 'a strawberry', development: 'Organs are forming and growing.', tips: ['Schedule your first ultrasound if needed.', 'Rest and listen to your body.'] },
  11: { week: 11, trimester: 'first', babySize: 'a fig', development: 'Baby is moving; you may not feel it yet.', tips: ['Continue prenatal care visits.', 'Eat a variety of fruits and vegetables.'] },
  12: { week: 12, trimester: 'first', babySize: 'a lime', development: 'Reflexes and vocal cords develop.', tips: ['Nausea often improves around this time.', 'Stay active in ways that feel good.'] },
  13: { week: 13, trimester: 'first', babySize: 'a peach', development: 'First trimester ends; baby is fully formed in miniature.', tips: ['You may have more energy now.', 'Keep up with vitamins and healthy eating.'] },
  14: { week: 14, trimester: 'second', babySize: 'a lemon', development: 'Baby can make facial expressions.', tips: ['Second trimester often feels better.', 'Eat enough protein and iron.'] },
  15: { week: 15, trimester: 'second', babySize: 'an apple', development: 'Bones are hardening; skin is sensitive to touch.', tips: ['Stay hydrated.', 'Light exercise is usually safe—ask your provider.'] },
  16: { week: 16, trimester: 'second', babySize: 'an avocado', development: 'Baby may hear your voice and heartbeat.', tips: ['Talk or sing to your baby if you like.', 'Rest when you need to.'] },
  17: { week: 17, trimester: 'second', babySize: 'a pear', development: 'Fat stores begin; baby is more active.', tips: ['Eat iron-rich foods: beans, greens, lean meat.', 'Sleep on your side if comfortable.'] },
  18: { week: 18, trimester: 'second', babySize: 'a sweet potato', development: 'Ears are in place; baby may hear sounds.', tips: ['You might feel first movements.', 'Continue prenatal visits.'] },
  19: { week: 19, trimester: 'second', babySize: 'a mango', development: 'Vernix protects the skin.', tips: ['Eat small, frequent meals if heartburn appears.', 'Stay active in a way that suits you.'] },
  20: { week: 20, trimester: 'second', babySize: 'a banana', development: 'Halfway there; baby swallows and practices digestion.', tips: ['Mid-pregnancy scan is often around now.', 'Rest and eat well.'] },
  21: { week: 21, trimester: 'second', babySize: 'a carrot', development: 'Bone marrow starts making blood cells.', tips: ['Iron and folate remain important.', 'Drink plenty of water.'] },
  22: { week: 22, trimester: 'second', babySize: 'a papaya', development: 'Senses are developing; baby may respond to light and sound.', tips: ['Eat calcium-rich foods.', 'Light walking can help energy and sleep.'] },
  23: { week: 23, trimester: 'second', babySize: 'a grapefruit', development: 'Lungs are preparing for breathing.', tips: ['Rest when tired.', 'Keep taking prenatal vitamins.'] },
  24: { week: 24, trimester: 'second', babySize: 'an ear of corn', development: "Baby's senses are developing; they can hear and may respond to touch.", tips: ['Eat iron-rich foods and rest.', 'Stay hydrated.'] },
  25: { week: 25, trimester: 'second', babySize: 'a cauliflower', development: 'Baby is gaining weight; skin is smoothing.', tips: ['Continue prenatal vitamins.', 'Light walking is good for many.'] },
  26: { week: 26, trimester: 'second', babySize: 'a lettuce head', development: 'Lungs are developing; baby practices breathing movements.', tips: ['Eat small, frequent meals.', 'Rest when you need to.'] },
  27: { week: 27, trimester: 'second', babySize: 'a cabbage', development: 'Brain is growing; sleep and wake cycles appear.', tips: ['Sleep on your side if comfortable.', 'Keep up with iron-rich foods.'] },
  28: { week: 28, trimester: 'third', babySize: 'an eggplant', development: 'Third trimester begins; baby’s eyes can open.', tips: ['You may have more checkups now.', 'Rest and eat well.'] },
  29: { week: 29, trimester: 'third', babySize: 'a butternut squash', development: 'Muscles and lungs are maturing.', tips: ['Stay hydrated.', 'Report any concerns to your care provider.'] },
  30: { week: 30, trimester: 'third', babySize: 'a cucumber', development: 'Baby is gaining weight and getting stronger.', tips: ['Eat enough protein and calories.', 'Rest when you need to.'] },
  31: { week: 31, trimester: 'third', babySize: 'a coconut', development: 'Baby can turn toward light and recognize your voice.', tips: ['Sleep on your left side if possible.', 'Keep taking vitamins.'] },
  32: { week: 32, trimester: 'third', babySize: 'a jicama', development: 'Lungs are almost ready; baby practices breathing.', tips: ['Small meals can help heartburn.', 'Stay in touch with your care team.'] },
  33: { week: 33, trimester: 'third', babySize: 'a pineapple', development: 'Bones are hardening; baby is less cramped for now.', tips: ['Rest when you can.', 'Eat iron-rich foods.'] },
  34: { week: 34, trimester: 'third', babySize: 'a cantaloupe', development: 'Central nervous system and lungs are maturing.', tips: ['Drink plenty of water.', 'Light movement can help.'] },
  35: { week: 35, trimester: 'third', babySize: 'a honeydew', development: 'Baby is putting on fat and getting rounder.', tips: ['Rest and save energy.', 'Continue prenatal visits.'] },
  36: { week: 36, trimester: 'third', babySize: 'a papaya', development: 'Baby may move down; lungs are nearly ready.', tips: ['Pack your bag if you plan to give birth at a facility.', 'Rest when you need to.'] },
  37: { week: 37, trimester: 'third', babySize: 'a bunch of Swiss chard', development: 'Full term; baby could arrive any time.', tips: ['Watch for signs of labor.', 'Stay calm and reach out to your provider with questions.'] },
  38: { week: 38, trimester: 'third', babySize: 'a leek', development: 'Baby is ready; brain and lungs are mature.', tips: ['Rest and eat well.', 'Have your support person and provider contacts ready.'] },
  39: { week: 39, trimester: 'third', babySize: 'a mini watermelon', development: 'Baby is full term and may arrive soon.', tips: ['Stay hydrated.', 'Rest and listen to your body.'] },
  40: { week: 40, trimester: 'third', babySize: 'a watermelon', development: 'Due week; baby is ready to meet you.', tips: ['Keep in touch with your care provider.', 'Rest and stay supported.'] },
  41: { week: 41, trimester: 'third', babySize: 'a small pumpkin', development: 'Post-due; many babies arrive this week.', tips: ['Follow your provider’s guidance on monitoring.', 'Rest and stay calm.'] },
  42: { week: 42, trimester: 'third', babySize: 'a newborn', development: 'Post-term; induction may be discussed with your provider.', tips: ['Stay in close contact with your care team.', 'Rest and prepare for birth.'] },
};

function buildWeek(week: number): WeekInfo {
  const stored = weekDatabase[week];
  if (stored) return stored;
  const trimester: 'first' | 'second' | 'third' =
    week < 14 ? 'first' : week < 28 ? 'second' : 'third';
  return {
    week,
    trimester,
    babySize: 'a small fruit',
    development: 'Baby is growing every day.',
    tips: ['Take care of yourself.', 'Rest when you need to.'],
  };
}

export function getWeekInfo(week: number): WeekInfo {
  const w = Math.max(1, Math.min(42, Math.floor(week)));
  return buildWeek(w);
}

export function getTrimesterLabel(t: 'first' | 'second' | 'third'): string {
  const labels = { first: 'First Trimester', second: 'Second Trimester', third: 'Third Trimester' };
  return labels[t];
}

export function getAllWeeks(): number[] {
  return Array.from({ length: 42 }, (_, i) => i + 1);
}

export function getAfricanFruitForWeek(week: number): { label: string; emoji: string; artKey?: string } {
  const w = Math.max(1, Math.min(42, Math.floor(week)));
  const map: Record<number, { label: string; emoji: string; artKey?: string }> = {
    1: { label: 'a tiny seed', emoji: '🌱', artKey: 'yam' },
    4: { label: 'a grain of millet', emoji: '🌾', artKey: 'yam' },
    10: { label: 'a small mango', emoji: '🥭', artKey: 'mango' },
    15: { label: 'an avocado', emoji: '🥑', artKey: 'mango' },
    20: { label: 'a banana', emoji: '🍌', artKey: 'banana' },
    22: { label: 'a pawpaw (papaya)', emoji: '🥭', artKey: 'mango' },
    24: { label: 'an ear of corn', emoji: '🌽', artKey: 'yam' },
    28: { label: 'a coconut', emoji: '🥥', artKey: 'coconut' },
    31: { label: 'a coconut', emoji: '🥥', artKey: 'coconut' },
    33: { label: 'a pineapple', emoji: '🍍', artKey: 'mango' },
    36: { label: 'a big yam', emoji: '🍠', artKey: 'yam' },
    39: { label: 'a mini watermelon', emoji: '🍉', artKey: 'watermelon' },
    40: { label: 'a watermelon', emoji: '🍉', artKey: 'watermelon' },
    42: { label: 'ready to meet you', emoji: '👶', artKey: 'pregnant' },
  };

  const keys = Object.keys(map).map((k) => parseInt(k, 10)).sort((a, b) => a - b);
  let chosen = map[1];
  for (const k of keys) {
    if (w >= k) chosen = map[k];
  }
  return chosen;
}
