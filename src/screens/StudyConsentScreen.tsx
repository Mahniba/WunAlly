import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer, PrimaryButton } from '../components';
import { submitStudyConsent } from '../services/api/research';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography } from '../theme';

export function StudyConsentScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [busy, setBusy] = useState(false);
  const { s, font, horizontalPadding } = useResponsive();

  const agree = async () => {
    setBusy(true);
    try {
      await submitStudyConsent('1.0');
      navigation.goBack();
    } catch {
      navigation.goBack();
    } finally {
      setBusy(false);
    }
  };

  const styles = StyleSheet.create({
    content: { padding: horizontalPadding, paddingBottom: s(48) },
    title: {
      fontSize: font(typography.sizes.xxl),
      fontWeight: typography.weights.bold,
      color: colors.textPrimary,
      marginBottom: s(16),
    },
    body: { fontSize: font(typography.sizes.base), color: colors.textSecondary, lineHeight: 24, marginBottom: s(24) },
  });

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t('evaluation.consentTitle')}</Text>
        <Text style={styles.body}>{t('evaluation.consentBody')}</Text>
        <PrimaryButton title={t('evaluation.agree')} onPress={agree} disabled={busy} />
      </ScrollView>
    </ScreenContainer>
  );
}
