import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing } from '../theme';
import { MIN_TOUCH_TARGET } from '../constants';

interface ScreenHeaderProps {
  title: string;
  showBack?: boolean;
}

export function ScreenHeader({ title, showBack = true }: ScreenHeaderProps) {
  const navigation = useNavigation();
  return (
    <View style={styles.header}>
      {showBack ? (
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          accessible
          accessibilityLabel="Go back"
          accessibilityRole="button"
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.backBtn} />
      )}
      <Text style={styles.title} numberOfLines={1} allowFontScaling>
        {title}
      </Text>
      <View style={styles.backBtn} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.sm,
    minHeight: MIN_TOUCH_TARGET + spacing.sm,
  },
  backBtn: {
    minWidth: MIN_TOUCH_TARGET,
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: { fontSize: 24, color: colors.textPrimary },
  title: {
    flex: 1,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
