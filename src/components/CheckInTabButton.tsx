import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { AppIcon } from './AppIcon';
import { colors, typography, shadows } from '../theme';

export function CheckInTabButton(props: BottomTabBarButtonProps) {
  const { t } = useTranslation();
  const { onPress, accessibilityState } = props as BottomTabBarButtonProps & {
    onPress?: () => void;
  };
  const focused = accessibilityState?.selected;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={accessibilityState}
      onPress={onPress}
      activeOpacity={0.9}
      style={styles.container}
    >
      <View style={[styles.fab, focused && styles.fabFocused, shadows.md]}>
        <AppIcon
          name="heart"
          size={22}
          color={focused ? '#FFFFFF' : colors.coralDark}
        />
      </View>
      <Text style={[styles.label, focused && styles.labelFocused]}>{t('tabs.checkIn')}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    top: -14,
    width: 72,
  },
  fab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.coralDark,
  },
  fabFocused: {
    backgroundColor: colors.coralDark,
    borderColor: colors.coralDark,
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
