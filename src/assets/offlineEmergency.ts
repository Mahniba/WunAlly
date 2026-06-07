/** Bundled offline emergency content (fallback if API unavailable). */
export const OFFLINE_EMERGENCY = {
  title: 'Emergency steps (offline)',
  disclaimer:
    'General guidance only — not medical diagnosis. Call emergency services or go to a facility when in danger.',
  steps: [
    {
      title: 'Stay calm and get help',
      body_en:
        'Ask someone nearby to stay with you. Use SOS to alert your contacts and share your location if possible.',
      body_fr:
        "Demandez à une personne proche de rester avec vous. Utilisez SOS pour alerter vos contacts et partager votre position si possible.",
    },
    {
      title: 'Call or go to a facility',
      body_en:
        'Heavy bleeding, severe pain, fits, fever, breathing difficulty, or reduced baby movement — go to hospital or call emergency help immediately.',
      body_fr:
        "Saignement important, douleur sévère, convulsions, fièvre, difficulté à respirer ou mouvements du bébé réduits — allez à l'hôpital ou appelez les urgences.",
    },
  ],
  danger_signs_en: [
    'Heavy vaginal bleeding',
    'Severe headache with blurred vision',
    'Severe abdominal pain',
    'Reduced baby movement',
    'High fever',
    'Difficulty breathing',
  ],
  danger_signs_fr: [
    'Saignement vaginal abondant',
    'Mal de tête sévère avec vision trouble',
    'Douleur abdominale sévère',
    'Mouvements du bébé réduits',
    'Fièvre élevée',
    'Difficulté à respirer',
  ],
  sms_template_en:
    'SOS from WunAlly: I need urgent help during pregnancy. My location: {location}. Please call me or help me reach a hospital.',
  sms_template_fr:
    "SOS WunAlly : j'ai besoin d'aide urgente pendant la grossesse. Ma position : {location}. Appelez-moi ou aidez-moi à rejoindre un hôpital.",
};
