import { currentLanguage } from '../i18n';

export function localizedText(block: object, field: string, lang?: string): string {
  const record = block as Record<string, unknown>;
  const lng = lang ?? currentLanguage();
  const fr = lng.startsWith('fr');
  const localizedKey = fr ? `${field}_fr` : `${field}_en`;
  const englishKey = `${field}_en`;

  const value = record[localizedKey] ?? record[englishKey] ?? record[field];
  return typeof value === 'string' ? value : '';
}

export function formatTemplate(
  template: string,
  vars: Record<string, string | number>
): string {
  return Object.entries(vars).reduce(
    (result, [key, value]) => result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value)),
    template
  );
}

export function localizedCount(
  block: object,
  field: string,
  count: number,
  lang?: string
): string {
  const pluralField = count === 1 ? field : `${field}_plural`;
  const template = localizedText(block, pluralField, lang) || localizedText(block, field, lang);
  return formatTemplate(template, { count });
}
