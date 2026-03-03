import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme';
import { MIN_TOUCH_TARGET } from '../constants';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'coral' | 'lavender' | 'sos';
}

export function PrimaryButton({
  title,
  onPress,
  disabled,
  loading,
  style,
  textStyle,
  variant = 'coral',
}: PrimaryButtonProps) {
  const bg = variant === 'sos' ? colors.sos : variant === 'lavender' ? colors.lavender : colors.coral;
  const minHeight = Math.max(MIN_TOUCH_TARGET, 52);
  return (
    <TouchableOpacity
      accessible
      accessibilityRole="button"
      accessibilityLabel={title}
      style={[
        styles.button,
        { backgroundColor: bg, minHeight },
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color="#FFF" />
      ) : (
        <Text
          style={[
            styles.text,
            variant === 'sos' && styles.textSos,
            textStyle,
          ]}
          allowFontScaling
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  disabled: { opacity: 0.6 },
  text: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: '#FFFFFF',
  },
  textSos: {
    fontWeight: typography.weights.bold,
  },
});
