import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Platform } from 'react-native';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { colors, typography } from '../theme';

export function CheckInTabButton(props: BottomTabBarButtonProps) {
  const { onPress, accessibilityState } = props as any;
  const focused = accessibilityState?.selected;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={accessibilityState}
      onPress={onPress}
      activeOpacity={0.85}
      style={styles.container}
    >
      <View style={[styles.pill, focused && styles.pillFocused]}>
        <Text style={[styles.icon, focused && styles.iconFocused]}>❤️</Text>
      </View>
      <Text style={[styles.label, focused && styles.labelFocused]}>Check In</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 72,
  },
  pill: {
    width: 44,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  pillFocused: {
    backgroundColor: colors.softPink,
  },
  icon: {
    fontSize: 18,
    color: colors.textMuted,
  },
  iconFocused: {
    color: colors.coralDark,
  },
  label: {
    marginTop: 4,
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: typography.weights.medium,
    textAlign: 'center',
  },
  labelFocused: {
    color: colors.coralDark,
    fontWeight: typography.weights.semibold,
  },
});
