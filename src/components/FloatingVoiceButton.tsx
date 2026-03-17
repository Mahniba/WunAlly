import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scaleByHeight } from '../utils/layout';
import { colors } from '../theme';

interface FloatingVoiceButtonProps {
  onPress: () => void;
}

export function FloatingVoiceButton({ onPress }: FloatingVoiceButtonProps) {
  const insets = useSafeAreaInsets();
  const bottomOffset = Math.max(insets.bottom + scaleByHeight(24), 24);
  return (
    <TouchableOpacity
      style={[styles.fab, { bottom: bottomOffset }]}
      onPress={onPress}
      activeOpacity={0.9}
      accessible
      accessibilityRole="button"
      accessibilityLabel="Voice support"
    >
      <Text style={styles.icon}>⏺️</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    left: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.lavender,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.lavenderDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  icon: { fontSize: 26 },
});
