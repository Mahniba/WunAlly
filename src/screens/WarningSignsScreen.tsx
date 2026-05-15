import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { ScreenContainer } from '../components';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography } from '../theme';
import { PrimaryButton, SecondaryButton } from '../components';
import { useNavigation } from '@react-navigation/native';
import { useSymptomsStore } from '../store/useSymptomsStore';
import { useContentStore } from '../store/useContentStore';

export function WarningSignsScreen() {
  const { s, font, horizontalPadding } = useResponsive();
  const navigation = useNavigation();
  const addEntry = useSymptomsStore((s2) => s2.addEntry);
  const symptoms = useContentStore((st) => st.getSymptoms('warning_signs'));
  const hydrateContent = useContentStore((st) => st.hydrate);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  useEffect(() => {
    hydrateContent();
  }, [hydrateContent]);

  const toggle = (k: string) => setSelected((p) => ({ ...p, [k]: !p[k] }));

  const handleSave = async () => {
    const anySelected = Object.values(selected).some(Boolean);
    if (!anySelected) {
      Alert.alert('No symptoms selected', 'Please select at least one symptom or tap "I\'m not experiencing any".');
      return;
    }
    try {
      await addEntry({ symptoms: selected, category: 'warning_signs' });
      Alert.alert('Saved', 'Your check-in was saved.');
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Could not save your check-in. Please try again.');
    }
  };

  const handleNone = async () => {
    try {
      await addEntry({ symptoms: {}, category: 'warning_signs' });
      Alert.alert('Saved', 'No symptoms recorded for today.');
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Could not save your check-in. Please try again.');
    }
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
          {symptoms.map((sItem) => {
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
