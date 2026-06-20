/** Non-diagnostic descriptions — fallback when API content has no `description`. */
export const SYMPTOM_DESCRIPTIONS: Record<string, Record<string, string>> = {
  body_changes: {
    swelling:
      'Puffiness in hands, feet, or face from fluid retention and increased blood volume.',
    heartburn: 'A burning feeling in the chest caused by stomach acid rising upward.',
    constipation:
      'Difficulty with bowel movements caused by hormonal shifts and growing uterine pressure.',
    stretch_marks:
      'Fine lines appearing on belly, hips, or breasts as skin stretches with growth.',
  },
  general: {
    nausea:
      'Feeling queasy or like you might vomit — very common especially in early pregnancy.',
    headache:
      'Throbbing or tension headaches, often linked to hormonal changes and blood flow.',
    dizzy:
      'Feeling lightheaded or faint, often from blood pressure changes or standing too fast.',
    fatigue: 'Feeling very tired or drained, even after resting — your body is working hard.',
    back_pain:
      'Aching in the lower back as your posture shifts to support your growing belly.',
  },
  baby_monitoring: {
    strong_kicks: "You're feeling your baby move, kick, or roll — a reassuring daily sign.",
    reduced_baby_movement:
      'Baby feels less active than usual — worth tracking and mentioning to your midwife.',
    irregular_pattern:
      'Rhythmic fluttering or movement that feels different from your usual pattern.',
  },
  vaginal_health: {
    normal_discharge:
      'Clear or milky white discharge — healthy and normal throughout pregnancy.',
    unusual_discharge:
      'Yellow, green, grey, or strong-smelling discharge — worth checking with your provider.',
    itching:
      'Discomfort, itching, or a burning sensation that may indicate irritation or infection.',
    odor: 'A smell that is stronger or different than what is usual for you.',
  },
  warning_signs: {
    severe_headache:
      'Very strong headache that does not ease with rest — especially with vision changes.',
    blurred_vision:
      'Blurred vision, seeing spots, or light sensitivity — seek care right away.',
    vaginal_bleeding:
      'Any spotting or bleeding beyond light implantation — important to report.',
    severe_abdominal_pain:
      "Intense or sharp pain anywhere that doesn't feel like normal pregnancy discomfort.",
    nausea: 'Ongoing nausea that affects eating or drinking throughout the day.',
    fever: 'Temperature that feels higher than normal for you.',
    severe_vomiting: 'Vomiting that prevents keeping fluids down.',
    reduced_baby_movement: 'Noticeably fewer baby movements than you usually feel.',
    dizziness: 'Feeling faint, weak, or unsteady at rest or when standing.',
    insomnia: 'Difficulty sleeping most nights despite feeling tired.',
    foul_discharge: 'Discharge with a strong unpleasant smell.',
    difficulty_breathing: 'Shortness of breath at rest or with little activity.',
    swelling_face_hands_feet:
      'Rapid swelling of the face or hands — could be a sign of high blood pressure.',
  },
};

export const MOOD_DESCRIPTIONS: Record<string, string> = {
  happy: 'Feeling joyful, content, or excited about your pregnancy journey.',
  ok: 'Feeling steady and generally alright today — neither high nor low.',
  tired: 'Low energy or needing more rest than usual.',
  sleepy: 'Feeling drowsy or wanting to sleep more than usual.',
  confused: 'Feeling unsure, foggy, or having trouble focusing on things.',
  sad: 'Feeling low, tearful, or emotionally drained — common during hormonal changes.',
  anxious: 'Feeling worried or uneasy about pregnancy, birth, or what lies ahead.',
  stressed: 'Feeling easily frustrated or under pressure — a natural effect of big life changes.',
};

export const CATEGORY_CHECK_IN_PROMPTS: Record<string, string> = {
  body_changes:
    "Select any symptoms you've been feeling today. You can select more than one.",
  general: "Any physical symptoms you're noticing today?",
  baby_monitoring: 'How is your baby doing today?',
  vaginal_health: 'Any changes in vaginal discharge or comfort today?',
  warning_signs: "Tell us if you've noticed anything concerning today.",
  mood: 'How are you feeling emotionally today?',
};

export const NONE_TODAY_COPY = {
  label: 'None today',
  description: "I haven't experienced any of these.",
};
