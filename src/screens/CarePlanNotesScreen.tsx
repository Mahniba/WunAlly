import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { ScreenContainer, ScreenHeader } from '../components';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography } from '../theme';

export function CarePlanNotesScreen() {
  const { s, font, horizontalPadding } = useResponsive();
  const [medical, setMedical] = useState('');
  const [labourPrefs, setLabourPrefs] = useState('');

  const styles = StyleSheet.create({
    scroll: { flex: 1 },
    content: { padding: horizontalPadding, paddingBottom: s(48), flexGrow: 1 },
    section: { marginBottom: s(24) },
    sectionTitle: {
      fontSize: font(typography.sizes.lg),
      fontWeight: typography.weights.semibold,
      color: colors.textPrimary,
      marginBottom: s(8),
    },
    sectionDesc: {
      fontSize: font(typography.sizes.sm),
      color: colors.textSecondary,
      marginBottom: s(12),
    },
    input: {
      fontSize: font(typography.sizes.base),
      color: colors.textPrimary,
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.softPink,
      padding: s(16),
      minHeight: 100,
      textAlignVertical: 'top',
    },
  });

  return (
    <ScreenContainer>
      <ScreenHeader title="Care Plan Notes" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medical (allergies & illnesses)</Text>
          <Text style={styles.sectionDesc}>
            List any allergies, ongoing illnesses, or conditions your care team should know about.
          </Text>
          <TextInput
            style={styles.input}
            value={medical}
            onChangeText={setMedical}
            placeholder="e.g. penicillin allergy, asthma, gestational diabetes..."
            placeholderTextColor={colors.textMuted}
            multiline
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences for labour</Text>
          <Text style={styles.sectionDesc}>
            Note your preferences for labour and birth so you can share them with your provider.
          </Text>
          <TextInput
            style={styles.input}
            value={labourPrefs}
            onChangeText={setLabourPrefs}
            placeholder="e.g. birth partner, pain relief preferences, delivery position..."
            placeholderTextColor={colors.textMuted}
            multiline
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
