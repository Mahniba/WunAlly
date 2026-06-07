import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer, ScreenHeader, PrimaryButton } from '../components';
import { submitEvaluation } from '../services/api/research';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography } from '../theme';

const SUS_ITEMS = [
  'I would use this app frequently during pregnancy.',
  'The app was easy to use.',
  'I needed help to use the app.',
  'The features were well integrated.',
  'There was too much inconsistency.',
  'Most people would learn this app quickly.',
  'I felt confident using the app.',
  'The app felt cumbersome to use.',
  'I felt comfortable using the app.',
  'I needed to learn a lot before I could use the app.',
];

export function SUSQuestionnaireScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [scores, setScores] = useState<Record<number, number>>({});
  const [busy, setBusy] = useState(false);
  const { s, font, horizontalPadding } = useResponsive();

  const setScore = (idx: number, value: number) => {
    setScores((prev) => ({ ...prev, [idx]: value }));
  };

  const submit = async () => {
    const missing = SUS_ITEMS.findIndex((_, i) => scores[i] == null);
    if (missing >= 0) {
      Alert.alert('Incomplete', `Please rate item ${missing + 1}.`);
      return;
    }
    setBusy(true);
    try {
      await submitEvaluation({ instrument: 'sus', scores });
      Alert.alert(t('evaluation.thanks'));
      navigation.goBack();
    } catch {
      Alert.alert(t('common.error'));
    } finally {
      setBusy(false);
    }
  };

  const styles = StyleSheet.create({
    content: { padding: horizontalPadding, paddingBottom: s(48) },
    item: { marginBottom: s(20) },
    q: { color: colors.textPrimary, marginBottom: s(8), lineHeight: 22 },
    row: { flexDirection: 'row', flexWrap: 'wrap', gap: s(8) },
    chip: {
      width: 36,
      height: 36,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    chipOn: { backgroundColor: colors.coral, borderColor: colors.coral },
    chipText: { color: colors.textPrimary },
    chipTextOn: { color: '#fff' },
  });

  return (
    <ScreenContainer>
      <ScreenHeader title={t('evaluation.susTitle')} />
      <ScrollView contentContainerStyle={styles.content}>
        {SUS_ITEMS.map((q, i) => (
          <View key={i} style={styles.item}>
            <Text style={styles.q}>
              {i + 1}. {q}
            </Text>
            <View style={styles.row}>
              {[1, 2, 3, 4, 5].map((v) => (
                <TouchableOpacity
                  key={v}
                  style={[styles.chip, scores[i] === v && styles.chipOn]}
                  onPress={() => setScore(i, v)}
                >
                  <Text style={[styles.chipText, scores[i] === v && styles.chipTextOn]}>{v}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        <PrimaryButton title={t('evaluation.submit')} onPress={submit} disabled={busy} />
      </ScrollView>
    </ScreenContainer>
  );
}
