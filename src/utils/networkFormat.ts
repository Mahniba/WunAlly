import type { HealthProvider } from '../services/api/network';

const ROLE_LABELS: Record<string, { en: string; fr: string }> = {
  midwife: { en: 'Midwife', fr: 'Sage-femme' },
  nurse: { en: 'Nurse', fr: 'Infirmière' },
};

const LANGUAGE_LABELS: Record<string, { en: string; fr: string }> = {
  en: { en: 'English', fr: 'Anglais' },
  fr: { en: 'French', fr: 'Français' },
};

export function formatProviderRole(role: string, lang: string): string {
  const labels = ROLE_LABELS[role];
  if (!labels) return role;
  return lang.startsWith('fr') ? labels.fr : labels.en;
}

export function formatLanguageList(languages: string[], lang: string): string {
  if (!languages.length) return '';
  const fr = lang.startsWith('fr');
  return languages
    .map((code) => {
      const label = LANGUAGE_LABELS[code];
      return label ? (fr ? label.fr : label.en) : code.toUpperCase();
    })
    .join(', ');
}

export function providerInitials(provider: HealthProvider): string {
  return provider.name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}
