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

  /**
   * Backwards-compatible tokens used across screens/components.
   * Keep these stable to prevent "invisible" UI when a key is missing.
   */
  coral: '#FF9A8B',
  coralDark: '#E96D7E',
  lavender: '#E8E0F0',
  lavenderDark: '#6B5FA6',

  // Backgrounds (brand prefers white)
  background: '#FFFFFF',
  backgroundSecondary: '#FFF8F6',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',

  // Borders / dividers
  border: '#E9E3E5',

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
  /** Back-compat: used by some screens for reminders */
  accentOrange: '#FFB089',

  // Mood palette (kept soft + brand-aligned)
  moodHappy: '#6B9B7A',
  moodOk: '#6B5FA6',
  moodTired: '#C9A227',
  moodSleepy: '#8A7BBE',
  moodConfused: '#E96D7E',
  moodSad: '#4E79A7',
  moodAnxious: '#C75C5C',
  moodStressed: '#7A5C57',
} as const;

export type Colors = typeof colors;
