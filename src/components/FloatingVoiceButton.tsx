import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppIcon } from './AppIcon';
import { scaleByHeight } from '../utils/layout';
import { colors, shadows } from '../theme';

interface FloatingVoiceButtonProps {
  onPress: () => void;
}

export function FloatingVoiceButton({ onPress }: FloatingVoiceButtonProps) {
  const insets = useSafeAreaInsets();
  // Keep the mic comfortably above the home indicator / tab bar.
  // Smaller offset = lower on screen (closer to bottom).
  const bottomOffset = Math.max(insets.bottom + scaleByHeight(10), 14);

  return (
    <TouchableOpacity
      style={[styles.fab, shadows.md, { bottom: bottomOffset }]}
      onPress={onPress}
      activeOpacity={0.9}
      accessible
      accessibilityRole="button"
      accessibilityLabel="Chat assistant"
    >
      <AppIcon name="mic" size={22} color={colors.lavenderDark} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    left: 24,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
