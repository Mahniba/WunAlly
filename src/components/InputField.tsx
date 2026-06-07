import React from 'react';
import { View, TextInput, Text, StyleSheet, ViewStyle, TextInputProps } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme';

interface InputFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  rightIcon?: React.ReactNode;
}

export function InputField({
  label,
  containerStyle,
  inputStyle,
  rightIcon,
  placeholderTextColor = colors.textMuted,
  ...rest
}: InputFieldProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label} allowFontScaling>
        {label}
      </Text>
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, rightIcon ? styles.inputWithIcon : null, inputStyle]}
          placeholderTextColor={placeholderTextColor}
          accessible
          accessibilityLabel={label}
          {...rest}
        />
        {rightIcon ? <View style={styles.icon}>{rightIcon}</View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    letterSpacing: 0.1,
  },
  inputRow: { position: 'relative' },
  input: {
    fontSize: typography.sizes.base,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  inputWithIcon: { paddingRight: 48 },
  icon: {
    position: 'absolute',
    right: spacing.sm,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
});
