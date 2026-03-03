import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme';
import { MIN_TOUCH_TARGET } from '../constants';

interface SecondaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function SecondaryButton({
  title,
  onPress,
  disabled,
  style,
  textStyle,
}: SecondaryButtonProps) {
  return (
    <TouchableOpacity
      accessible
      accessibilityRole="button"
      accessibilityLabel={title}
      style={[styles.button, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
    >
      <Text style={[styles.text, textStyle]} allowFontScaling>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: MIN_TOUCH_TARGET,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.lavender,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  disabled: { opacity: 0.6 },
  text: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.lavenderDark,
  },
});
