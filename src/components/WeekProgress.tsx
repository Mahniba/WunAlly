import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Card } from './Card';
import { FruitMilestoneImage } from './FruitMilestoneImage';
import { colors, typography, spacing } from '../theme';
import { getBabySizeVisual } from '../utils/weekData';

interface WeekProgressProps {
  week: number;
}

export function WeekProgress({ week }: WeekProgressProps) {
  const { t } = useTranslation();
  const { babySize, development, fruitComparison, measurements } = getBabySizeVisual(week);

  return (
    <Card variant="outlined">
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{t('home.weekBadge', { week })}</Text>
      </View>
      <View style={styles.content}>
        <FruitMilestoneImage fruitComparison={fruitComparison} size={64} />
        <View style={styles.textBlock}>
          <Text style={styles.description} allowFontScaling>
            {t('home.babySize', { size: babySize })}
          </Text>
          {measurements ? (
            <Text style={styles.measurements} allowFontScaling>
              {measurements}
            </Text>
          ) : null}
          {development ? (
            <Text style={styles.subdescription} allowFontScaling numberOfLines={3}>
              {development}
            </Text>
          ) : null}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  badgeText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.coralDark,
    letterSpacing: 0.2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  textBlock: { flex: 1 },
  description: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  measurements: {
    fontSize: typography.sizes.sm,
    color: colors.coralDark,
    fontWeight: typography.weights.medium,
    marginTop: spacing.xxs,
    lineHeight: 18,
  },
  subdescription: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
    lineHeight: 18,
  },
});
