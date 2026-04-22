import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { colors, typography, spacing } from '../theme';
import { getAfricanFruitForWeek } from '../utils/weekData';
import BananaSvg from './art/BananaSvg';
import WatermelonSvg from './art/WatermelonSvg';
import MangoSvg from './art/MangoSvg';
import CoconutSvg from './art/CoconutSvg';
import YamSvg from './art/YamSvg';
import PregnantIllustration from './art/PregnantIllustration';

interface WeekProgressProps {
  week: number;
  babySizeDescription: string;
  illustration?: React.ReactNode;
}

export function WeekProgress({
  week,
  babySizeDescription,
  illustration,
}: WeekProgressProps) {
  const fruit = getAfricanFruitForWeek(week);
  const artMap: Record<string, React.ReactNode> = {
    banana: <BananaSvg size={56} />,
    watermelon: <WatermelonSvg size={56} />,
    mango: <MangoSvg size={56} />,
    coconut: <CoconutSvg size={56} />,
    yam: <YamSvg size={56} />,
    pregnant: <PregnantIllustration size={56} />,
  };
  return (
    <Card>
      <View style={styles.header}>
        <Text style={styles.weekLabel} allowFontScaling>
          Week {week}
        </Text>
      </View>
      <View style={styles.content}>
        <View style={styles.illustration}>
          {illustration ?? (fruit.artKey ? artMap[fruit.artKey] ?? <Text style={styles.illustrationPlaceholder}>{fruit.emoji}</Text> : <Text style={styles.illustrationPlaceholder}>{fruit.emoji}</Text>)}
        </View>
        <Text style={styles.description} allowFontScaling>
          Your baby is as big as {fruit.label}.
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: spacing.xs },
  weekLabel: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  content: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  illustration: { width: 56, height: 56, justifyContent: 'center', alignItems: 'center' },
  illustrationPlaceholder: { fontSize: 32 },
  description: {
    flex: 1,
    fontSize: typography.sizes.base,
    color: colors.textSecondary,
  },
});
