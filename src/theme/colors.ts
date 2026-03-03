/**
 * Wunally design system — soft, warm, reassuring.
 * Red reserved for SOS only.
 */
export const colors = {
  // Primary palette
  coral: '#E8A598',
  coralDark: '#D4897A',
  lavender: '#B8A9C9',
  lavenderDark: '#9B8BB0',
  softPink: '#F5E6E8',
  softPurple: '#E8E0F0',

  // Backgrounds
  background: '#FDF8F9',
  backgroundSecondary: '#F5EFF1',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',

  // Text — high contrast for accessibility
  textPrimary: '#2D2A2B',
  textSecondary: '#5C5658',
  textMuted: '#8A8385',

  // Semantic
  success: '#6B9B7A',
  warning: '#C9A227',
  error: '#C75C5C',
  /** Use only for SOS / emergency. */
  sos: '#C0392B',

  // Chips / accents (dashboard action cards)
  chipTrack: '#E8D4D8',
  chipChat: '#D4E4F0',
  chipReminders: '#F0E4D4',
  /** Orange for Reminders action card */
  accentOrange: '#E8A87A',
} as const;

export type Colors = typeof colors;
