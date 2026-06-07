import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Card } from './Card';
import { colors, typography, spacing } from '../theme';
import { getBabySizeVisual } from '../utils/weekData';
import BananaSvg from './art/BananaSvg';
import WatermelonSvg from './art/WatermelonSvg';
import MangoSvg from './art/MangoSvg';
import CoconutSvg from './art/CoconutSvg';
import YamSvg from './art/YamSvg';
import PregnantIllustration from './art/PregnantIllustration';

interface WeekProgressProps {
  week: number;
}

const ART_MAP = {
  banana: BananaSvg,
  watermelon: WatermelonSvg,
  mango: MangoSvg,
  coconut: CoconutSvg,
  yam: YamSvg,
  pregnant: PregnantIllustration,
} as const;

export function WeekProgress({ week }: WeekProgressProps) {
  const { t } = useTranslation();
  const { babySize, development, artKey } = getBabySizeVisual(week);
  const Art = ART_MAP[artKey];

  return (
    <Card variant="outlined">
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{t('home.weekBadge', { week })}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.illustration}>
          <Art size={48} />
        </View>
        <View style={styles.textBlock}>
          <Text style={styles.description} allowFontScaling>
            {t('home.babySize', { size: babySize })}
          </Text>
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
  illustration: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBlock: { flex: 1 },
  description: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  subdescription: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
    lineHeight: 18,
  },
});
