/**
 * Wunally design system — soft, warm, reassuring.
 * Red reserved for SOS only.
 */
export const colors = {
  // Primary palette — brand: peach & white
  peach: '#FFC9A3',
  peachDark: '#FFB089',
  softPink: '#FFF1EE',
  softPurple: '#E8E0F0',

  // Backgrounds (brand prefers white)
  background: '#FFFFFF',
  backgroundSecondary: '#FFF8F6',
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
  chipTrack: '#FFF0E8',
  chipChat: '#F8F4FF',
  chipReminders: '#FFF4EB',
  /** Peach accent for actions */
  accentPeach: '#FFC9A3',
} as const;

export type Colors = typeof colors;
