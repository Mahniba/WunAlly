import React, { useState } from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
import { ScreenContainer, InputField, PrimaryButton } from '../components';
import { useProfileStore, getDefaultProfile } from '../store';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography } from '../theme';

export function ProfileCreateScreen() {
  const setProfile = useProfileStore((s) => s.setProfile);
  const persist = useProfileStore((s) => s.persist);
  const { s, font, horizontalPadding } = useResponsive();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [weeksPregnant, setWeeksPregnant] = useState('24');
  const [dueDate, setDueDate] = useState('');
  const [healthConditions, setHealthConditions] = useState('');

  const handleStart = async () => {
    const profile = getDefaultProfile();
    profile.name = name.trim() || 'Sarah';
    profile.age = age.trim();
    profile.weeksPregnant = parseInt(weeksPregnant, 10) || 24;
    profile.dueDate = dueDate.trim();
    profile.healthConditions = healthConditions.trim();
    setProfile(profile);
    await persist();
  };

  const styles = StyleSheet.create({
    scroll: { flex: 1 },
    scrollContent: { padding: horizontalPadding, paddingBottom: s(48), flexGrow: 1 },
    title: {
      fontSize: font(typography.sizes.xxl),
      fontWeight: typography.weights.bold,
      color: colors.textPrimary,
      marginBottom: s(24),
    },
    button: { marginTop: s(24) },
  });

  return (
    <ScreenContainer>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title} allowFontScaling maxFontSizeMultiplier={1.3}>
          Create Your Profile
        </Text>
        <InputField
          label="Name"
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          autoCapitalize="words"
        />
        <InputField
          label="Age"
          value={age}
          onChangeText={setAge}
          placeholder="Age"
          keyboardType="number-pad"
        />
        <InputField
          label="Weeks Pregnant"
          value={weeksPregnant}
          onChangeText={setWeeksPregnant}
          placeholder="e.g. 24"
          keyboardType="number-pad"
        />
        <InputField
          label="Due Date"
          value={dueDate}
          onChangeText={setDueDate}
          placeholder="e.g. 2026-06-15"
        />
        <InputField
          label="Health Conditions (optional)"
          value={healthConditions}
          onChangeText={setHealthConditions}
          placeholder="Any conditions we should know about"
        />
        <PrimaryButton
          title="Start My Journey"
          onPress={handleStart}
          style={styles.button}
        />
      </ScrollView>
    </ScreenContainer>
  );
}
