import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { ScreenContainer } from '../components';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography } from '../theme';
import { PrimaryButton, SecondaryButton } from '../components';
import { useNavigation } from '@react-navigation/native';
import { useSymptomsStore } from '../store/useSymptomsStore';

const SYMPTOMS = [
  { key: 'severe_headache', label: 'Severe headache', emoji: '🤕' },
  { key: 'blurred_vision', label: 'Blurred vision', emoji: '👁️' },
  { key: 'vaginal_bleeding', label: 'Vaginal bleeding', emoji: '🩸' },
  { key: 'severe_abdominal_pain', label: 'Severe abdominal pain', emoji: '🤢' },
  { key: 'nausea', label: 'Nausea', emoji: '🤮' },
  { key: 'fever', label: 'Fever', emoji: '🌡️' },
  { key: 'severe_vomiting', label: 'Severe vomiting', emoji: '🤮' },
  { key: 'reduced_baby_movement', label: 'Reduced baby movement', emoji: '👶' },
  { key: 'dizziness', label: 'Dizziness', emoji: '🌀' },
  { key: 'insomnia', label: 'Insomnia', emoji: '😴' },
  { key: 'foul_discharge', label: 'Foul-smelling discharge', emoji: '🫗' },
  { key: 'difficulty_breathing', label: 'Difficulty breathing', emoji: '😮‍💨' },
  { key: 'swelling_face_hands_feet', label: 'Swelling in face, hands or feet', emoji: '✋' },
];

export function WarningSignsScreen() {
  const { s, font, horizontalPadding } = useResponsive();
  const navigation = useNavigation();
  const addEntry = useSymptomsStore((s2) => s2.addEntry);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const toggle = (k: string) => setSelected((p) => ({ ...p, [k]: !p[k] }));

  const handleSave = () => {
    // Persist only the selected keys as true
    const anySelected = Object.values(selected).some(Boolean);
    if (!anySelected) {
      Alert.alert('No symptoms selected', 'Please select at least one symptom or tap "I\'m not experiencing any".');
      return;
    }
    addEntry({ symptoms: selected });
    Alert.alert('Saved', 'Your check-in was saved.');
    navigation.goBack();
  };

  const handleNone = () => {
    addEntry({ symptoms: {} });
    Alert.alert('Saved', 'No symptoms recorded for today.');
    navigation.goBack();
  };

  const styles = StyleSheet.create({
    header: { paddingHorizontal: horizontalPadding, paddingTop: s(12), paddingBottom: s(8) },
    title: { fontSize: font(typography.sizes.xl), fontWeight: typography.weights.bold, color: colors.textPrimary },
    infoBox: { margin: horizontalPadding, backgroundColor: colors.softPink, borderRadius: 12, padding: s(12), marginBottom: s(12) },
    grid: { paddingHorizontal: horizontalPadding, paddingBottom: s(48), flexDirection: 'row', flexWrap: 'wrap', gap: s(12) },
    tile: { width: '48%', backgroundColor: colors.surface, borderRadius: 12, padding: s(12), marginBottom: s(8), borderWidth: 1, borderColor: colors.border },
    tileSelected: { borderColor: colors.accentPeach, backgroundColor: colors.chipReminders },
    tileLabel: { color: colors.textPrimary, marginTop: 8 },
    actions: { paddingHorizontal: horizontalPadding, marginTop: s(12), gap: s(12) },
    fullWidth: { width: '100%' },
  });

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Warning Signs</Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: s(40) }}>
        <View style={styles.infoBox}>
          <Text style={{ color: colors.textPrimary, fontWeight: typography.weights.semibold }}>If you select any of these, we may give you important advice or suggest you seek medical care.</Text>
        </View>
        <View style={styles.grid}>
          {SYMPTOMS.map((sItem) => {
            const isSel = !!selected[sItem.key];
            return (
              <TouchableOpacity
                key={sItem.key}
                style={[styles.tile, isSel && styles.tileSelected]}
                onPress={() => toggle(sItem.key)}
                activeOpacity={0.8}
              >
                <Text style={{ fontSize: 28 }}>{sItem.emoji}</Text>
                <Text style={styles.tileLabel}>{sItem.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.actions}>
          <View style={styles.fullWidth}>
            <SecondaryButton title="I'm not experiencing any" onPress={handleNone} style={{ width: '100%' }} />
          </View>
          <View style={styles.fullWidth}>
            <PrimaryButton variant="peach" title="Save & Continue" onPress={handleSave} style={{ width: '100%', marginTop: 8 }} />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
