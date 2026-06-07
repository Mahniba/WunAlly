import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { ScreenContainer, PrimaryButton, SecondaryButton, KeyboardAwareScrollView } from '../components';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography } from '../theme';
import { useSymptomsStore } from '../store/useSymptomsStore';
import { useContentStore } from '../store/useContentStore';
import type { RootStackParamList } from '../navigation/types';

type Route = RouteProp<RootStackParamList, 'SymptomCheckIn'>;

export function SymptomCheckInScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation();
  const { s, font, horizontalPadding } = useResponsive();
  const category = route.params.symptomCategory;
  const title = route.params.title;
  const showExtras = route.params.showExtras ?? false;
  const symptoms = useContentStore((st) => st.getSymptoms(category));
  const hydrateContent = useContentStore((st) => st.hydrate);
  const addEntry = useSymptomsStore((st) => st.addEntry);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState('');
  const [sleepHours, setSleepHours] = useState('');
  const [painLevel, setPainLevel] = useState('');
  const [foodNote, setFoodNote] = useState('');

  useEffect(() => {
    hydrateContent();
  }, [hydrateContent]);

  const toggle = (k: string) => setSelected((p) => ({ ...p, [k]: !p[k] }));

  const buildPayload = () => {
    const sleep = sleepHours.trim() ? Number(sleepHours.trim()) : undefined;
    const pain = painLevel.trim() ? Number(painLevel.trim()) : undefined;
    return {
      symptoms: selected,
      category,
      notes: notes.trim() || undefined,
      sleepHours: Number.isFinite(sleep) ? sleep : undefined,
      painLevel: Number.isFinite(pain) ? pain : undefined,
      foodNote: foodNote.trim() || undefined,
    };
  };

  const handleSave = async () => {
    const anySelected = Object.values(selected).some(Boolean);
    if (!anySelected && !showExtras) {
      Alert.alert('No symptoms selected', 'Please select at least one symptom or tap "None today".');
      return;
    }
    try {
      await addEntry(buildPayload());
      Alert.alert('Saved', 'Your check-in was saved.');
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Could not save your check-in. Please try again.');
    }
  };

  const handleNone = async () => {
    try {
      await addEntry({ symptoms: {}, category });
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
    fieldLabel: { color: colors.textSecondary, fontSize: 13, marginTop: 10, marginBottom: 6, paddingHorizontal: horizontalPadding },
    input: {
      marginHorizontal: horizontalPadding,
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 12,
      color: colors.textPrimary,
    },
  });

  const isWarning = category === 'warning_signs';

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <KeyboardAwareScrollView contentContainerStyle={{ paddingBottom: s(40), paddingHorizontal: horizontalPadding }}>
        {isWarning ? (
          <View style={styles.infoBox}>
            <Text style={{ color: colors.textPrimary, fontWeight: typography.weights.semibold }}>
              If you select any of these, we may give you important advice or suggest you seek medical care.
            </Text>
          </View>
        ) : null}
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

        {showExtras ? (
          <>
            <Text style={styles.fieldLabel}>Sleep hours (optional)</Text>
            <TextInput
              style={styles.input}
              value={sleepHours}
              onChangeText={setSleepHours}
              keyboardType="decimal-pad"
              placeholder="e.g. 7"
              placeholderTextColor={colors.textMuted}
            />
            <Text style={styles.fieldLabel}>Pain level 1–10 (optional)</Text>
            <TextInput
              style={styles.input}
              value={painLevel}
              onChangeText={setPainLevel}
              keyboardType="number-pad"
              placeholder="e.g. 3"
              placeholderTextColor={colors.textMuted}
            />
            <Text style={styles.fieldLabel}>Food notes (optional)</Text>
            <TextInput
              style={styles.input}
              value={foodNote}
              onChangeText={setFoodNote}
              placeholder="e.g. small meals + water"
              placeholderTextColor={colors.textMuted}
            />
            <Text style={styles.fieldLabel}>Notes (optional)</Text>
            <TextInput
              style={[styles.input, { marginBottom: 12 }]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Additional notes"
              placeholderTextColor={colors.textMuted}
              multiline
            />
          </>
        ) : null}

        <View style={styles.actions}>
          <SecondaryButton title="None today" onPress={handleNone} />
          <PrimaryButton variant="peach" title="Save & Continue" onPress={handleSave} style={{ marginTop: 8 }} />
        </View>
      </KeyboardAwareScrollView>
    </ScreenContainer>
  );
}
