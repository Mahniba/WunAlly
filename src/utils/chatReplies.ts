/**
 * Mock replies for chat (informational only). Not for diagnosis.
 * In production, replace with real AI/care team API.
 */

export interface ReplyMatch {
  keywords: string[];
  reply: string;
}

export const chatReplies: ReplyMatch[] = [
  {
    keywords: ['eat', 'food', 'diet', 'nutrition', 'meal', 'hungry'],
    reply: 'Focus on iron-rich foods like spinach, beans, and lean meat. Small, frequent meals can help with nausea. Stay hydrated. If you have dietary restrictions, your care provider can suggest a plan.',
  },
  {
    keywords: ['pain', 'hurt', 'ache', 'cramp', 'uncomfortable'],
    reply: 'Some discomfort is common in pregnancy. If pain is severe, doesn’t go away, or you’re worried, please contact your care provider right away. They can tell you what’s normal for you.',
  },
  {
    keywords: ['sleep', 'tired', 'rest', 'exhausted'],
    reply: 'Rest when you can. Sleeping on your left side in the second half of pregnancy can help. Avoid long periods on your back. If sleep is a big problem, your provider can suggest safe options.',
  },
  {
    keywords: ['vitamin', 'prenatal', 'folate', 'iron', 'supplement'],
    reply: 'Prenatal vitamins with folate (or folic acid) and iron are usually recommended. Take them as your provider suggests. If they upset your stomach, try with a small snack or ask for another formulation.',
  },
  {
    keywords: ['exercise', 'walk', 'workout', 'active'],
    reply: 'Light to moderate activity is usually fine—like walking or prenatal exercise. Listen to your body and stop if something doesn’t feel right. Your care provider can suggest what’s safe for you.',
  },
  {
    keywords: ['nausea', 'sick', 'vomit', 'morning sickness'],
    reply: 'Nausea is common, especially in the first trimester. Small, bland snacks, ginger, and avoiding strong smells can help. If you can’t keep fluids down or lose weight, see your provider.',
  },
  {
    keywords: ['due', 'date', 'when', 'birth'],
    reply: 'Your due date is an estimate. Many babies arrive a bit before or after. Your care provider can explain how they calculated it and what to expect as you get closer.',
  },
  {
    keywords: ['baby move', 'movement', 'kicking', 'felt'],
    reply: 'Most people feel movements between 18–25 weeks. If you’ve been feeling them and they slow down or stop, contact your care team. They can check that everything is okay.',
  },
  {
    keywords: ['stress', 'anxious', 'worry', 'nervous'],
    reply: 'It’s normal to feel worried sometimes. Rest, gentle activity, and talking to someone you trust can help. If anxiety is affecting your daily life, your provider can suggest support.',
  },
  {
    keywords: ['bleed', 'bleeding', 'spotting'],
    reply: 'Any bleeding in pregnancy should be checked. Contact your care provider or go to the nearest clinic so they can see what’s going on.',
  },
  {
    keywords: ['heartburn', 'reflux', 'acid'],
    reply: 'Heartburn is common. Small meals, avoiding lying down right after eating, and foods that don’t trigger you can help. Your provider can suggest pregnancy-safe options if needed.',
  },
  {
    keywords: ['swell', 'swelling', 'ankle', 'feet'],
    reply: 'Some swelling in the feet and ankles is common. Rest with feet up, stay hydrated, and avoid standing too long. Sudden or severe swelling, especially with headache or vision changes, needs urgent care.',
  },
];

export function getReplyForMessage(userMessage: string): string {
  const lower = userMessage.toLowerCase().trim();
  for (const { keywords, reply } of chatReplies) {
    if (keywords.some((k) => lower.includes(k))) return reply;
  }
  return 'Thanks for your message. This is a support chat—for personal advice, please talk to your care provider. You can ask about eating well, rest, vitamins, or general pregnancy tips.';
}
