import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { colors, typography, spacing } from '../theme';

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
  return (
    <Card>
      <View style={styles.header}>
        <Text style={styles.weekLabel} allowFontScaling>
          Week {week}
        </Text>
      </View>
      <View style={styles.content}>
        <View style={styles.illustration}>
          {illustration ?? <Text style={styles.illustrationPlaceholder}>🌽</Text>}
        </View>
        <Text style={styles.description} allowFontScaling>
          Your baby is as big as {babySizeDescription}.
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
