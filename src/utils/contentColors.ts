import { colors } from '../theme';

const COLOR_MAP: Record<string, string> = {
  chipTrack: colors.chipTrack,
  chipChat: colors.chipChat,
  chipReminders: colors.chipReminders,
  lavender: colors.lavender,
  sos: colors.sos,
  warning: '#FFF5E8',
  moodHappy: colors.moodHappy,
  moodOk: colors.moodOk,
  moodTired: colors.moodTired,
  moodSleepy: colors.moodSleepy,
  moodConfused: colors.moodConfused,
  moodSad: colors.moodSad,
  moodAnxious: colors.moodAnxious,
  moodStressed: colors.moodStressed,
};

export function colorFromKey(key: string, fallback = colors.chipTrack): string {
  return COLOR_MAP[key] ?? fallback;
}
