const PHRASES = [
  'wunally emergency',
  'emergency wunally',
  'wun ally emergency',
  'help me emergency',
  'send sos',
  'sos emergency',
  'need emergency help',
  'urgence wunally',
  'wunally urgence',
  'aide urgence',
  'envoyer sos',
  'sos urgence',
  'aidez moi urgence',
];

export function matchesEmergencyPhrase(text: string): boolean {
  const normalized = text.trim().toLowerCase().replace(/[^\w\sàâäéèêëïîôùûüç-]/gi, '');
  if (!normalized) return false;
  return PHRASES.some((phrase) => normalized.includes(phrase));
}
