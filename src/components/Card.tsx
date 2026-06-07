import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'elevated' | 'outlined' | 'flat';
}

export function Card({ children, style, onPress, variant = 'elevated' }: CardProps) {
  const Wrapper = onPress ? TouchableOpacity : View;
  const variantStyle =
    variant === 'outlined'
      ? styles.outlined
      : variant === 'flat'
      ? styles.flat
      : styles.elevated;

  return (
    <Wrapper
      style={[styles.card, variantStyle, style]}
      onPress={onPress}
      activeOpacity={0.92}
      accessible={!!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
    >
      {children}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  elevated: {
    ...shadows.sm,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  flat: {
    backgroundColor: colors.backgroundSecondary,
  },
});
