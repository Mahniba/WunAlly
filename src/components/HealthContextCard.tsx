import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useMoodStore } from '../store/useMoodStore';
import { useSymptomsStore } from '../store/useSymptomsStore';
import { useContentStore } from '../store/useContentStore';
import { colors, typography } from '../theme';
import { useResponsive } from '../hooks/useResponsive';

const WARNING_KEYS = new Set([
  'severe_headache',
  'blurred_vision',
  'vaginal_bleeding',
  'severe_abdominal_pain',
  'fever',
  'severe_vomiting',
  'reduced_baby_movement',
  'dizziness',
  'difficulty_breathing',
  'swelling_face_hands_feet',
]);

export function HealthContextCard() {
  const { t } = useTranslation();
  const moodEntries = useMoodStore((s) => s.entries);
  const symptomEntries = useSymptomsStore((s) => s.entries);
  const moodOptions = useContentStore((s) => s.content.moods);
  const { s, font } = useResponsive();

  const latestMood = moodEntries.length
    ? moodEntries.reduce((a, b) => (a.timestamp >= b.timestamp ? a : b))
    : null;
  const moodMeta = latestMood
    ? moodOptions.find((m) => m.key === latestMood.mood)
    : null;

  const since7 = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recentSymptoms = new Set<string>();
  for (const entry of symptomEntries) {
    if (new Date(entry.date).getTime() < since7) continue;
    for (const [key, active] of Object.entries(entry.symptoms ?? {})) {
      if (active) recentSymptoms.add(key);
    }
  }
  const warnings = [...recentSymptoms].filter((k) => WARNING_KEYS.has(k));

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.softPink,
      borderRadius: 14,
      padding: s(14),
      marginBottom: s(12),
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    title: {
      fontSize: font(typography.sizes.sm),
      fontWeight: typography.weights.semibold,
      color: colors.coralDark,
      marginBottom: s(8),
      textTransform: 'uppercase',
      letterSpacing: 0.6,
    },
    row: { marginBottom: s(6) },
    label: { fontSize: font(typography.sizes.sm), color: colors.textSecondary },
    value: {
      fontSize: font(typography.sizes.base),
      color: colors.textPrimary,
      fontWeight: typography.weights.medium,
      marginTop: 2,
    },
    warn: { color: colors.sos, fontWeight: typography.weights.semibold },
  });

  if (!latestMood && recentSymptoms.size === 0) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{t('tracking.healthContext')}</Text>
        <Text style={styles.label}>{t('tracking.healthContextEmpty')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{t('tracking.healthContext')}</Text>
      {latestMood ? (
        <View style={styles.row}>
          <Text style={styles.label}>{t('tracking.latestMood')}</Text>
          <Text style={styles.value}>
            {moodMeta?.emoji ?? '•'} {moodMeta?.label ?? latestMood.mood}
          </Text>
        </View>
      ) : null}
      {recentSymptoms.size > 0 ? (
        <View style={styles.row}>
          <Text style={styles.label}>{t('tracking.recentSymptoms')}</Text>
          <Text style={[styles.value, warnings.length > 0 && styles.warn]}>
            {[...recentSymptoms].slice(0, 4).map((k) => k.replace(/_/g, ' ')).join(', ')}
            {warnings.length > 0 ? ` — ${t('tracking.reviewWithProvider')}` : ''}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
