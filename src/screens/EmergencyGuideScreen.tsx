import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScreenContainer, ScreenHeader } from '../components';
import { useContentStore } from '../store/useContentStore';
import { currentLanguage } from '../i18n';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography } from '../theme';

export function EmergencyGuideScreen() {
  const { t } = useTranslation();
  const guide = useContentStore((s) => s.content.emergency_guide);
  const lang = currentLanguage();
  const fr = lang.startsWith('fr');
  const { s, font, horizontalPadding } = useResponsive();

  const styles = StyleSheet.create({
    content: { padding: horizontalPadding, paddingBottom: s(48) },
    disclaimer: {
      backgroundColor: colors.softPink,
      padding: s(14),
      borderRadius: 12,
      marginBottom: s(16),
      color: colors.textPrimary,
      lineHeight: 22,
    },
    step: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: s(14),
      marginBottom: s(12),
      borderWidth: 1,
      borderColor: colors.border,
    },
    stepTitle: { fontWeight: typography.weights.semibold, color: colors.textPrimary, marginBottom: 6 },
    stepBody: { color: colors.textSecondary, lineHeight: 22 },
    listTitle: { fontWeight: typography.weights.semibold, marginTop: s(8), marginBottom: s(8) },
    bullet: { color: colors.textSecondary, marginBottom: 4 },
  });

  const signs = fr ? guide.danger_signs_fr : guide.danger_signs_en;

  return (
    <ScreenContainer>
      <ScreenHeader title={t('sos.emergencyGuide')} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.disclaimer}>{guide.disclaimer}</Text>
        {guide.steps.map((step, i) => (
          <View key={i} style={styles.step}>
            <Text style={styles.stepTitle}>{step.title}</Text>
            <Text style={styles.stepBody}>{fr ? step.body_fr : step.body_en}</Text>
          </View>
        ))}
        <Text style={styles.listTitle}>{fr ? 'Signes de danger' : 'Danger signs'}</Text>
        {signs.map((sign) => (
          <Text key={sign} style={styles.bullet}>
            • {sign}
          </Text>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}
