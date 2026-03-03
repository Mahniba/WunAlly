import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scaleByHeight } from '../utils/layout';
import { colors, typography } from '../theme';

interface FloatingSOSButtonProps {
  onPress: () => void;
}

export function FloatingSOSButton({ onPress }: FloatingSOSButtonProps) {
  const insets = useSafeAreaInsets();
  const bottomOffset = Math.max(insets.bottom + scaleByHeight(24), 24);
  return (
    <TouchableOpacity
      style={[styles.fab, { bottom: bottomOffset }]}
      onPress={onPress}
      activeOpacity={0.9}
      accessible
      accessibilityRole="button"
      accessibilityLabel="Emergency SOS"
    >
      <Text style={styles.fabText}>SOS</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.sos,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.sos,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: '#FFFFFF',
  },
});
