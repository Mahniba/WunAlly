import React, { useState } from 'react';
import { Text, StyleSheet, ScrollView, View, Platform, TouchableOpacity } from 'react-native';
import { ScreenContainer, InputField, PrimaryButton, WeekProgress } from '../components';
import { useProfileStore, getDefaultProfile } from '../store';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography } from '../theme';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getWeekInfo } from '../utils/weekData';

export function ProfileCreateScreen({ navigation }: any) {
  const setProfile = useProfileStore((s) => s.setProfile);
  const persist = useProfileStore((s) => s.persist);
  const { s, font, horizontalPadding } = useResponsive();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [weeksPregnant, setWeeksPregnant] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [healthConditions, setHealthConditions] = useState('');

  const handleStart = async () => {
    const profile = getDefaultProfile();
    profile.name = name.trim() || 'Sarah';
    profile.age = age.trim();
    profile.weeksPregnant = parseInt(weeksPregnant, 10) || 24;
    profile.dueDate = dueDate.trim();
    profile.dueDateSet = !!profile.dueDate;
    profile.healthConditions = healthConditions.trim();
    setProfile(profile);
    await persist();
    // After saving profile, navigate to main app
    navigation.navigate('Main');
  };

  // Determine week number from input or infer from selected due date
  function computeWeekFromDueDate(d: Date) {
    const today = new Date();
    const diffMs = d.getTime() - today.getTime();
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const weeksLeft = Math.ceil(daysLeft / 7);
    const estimatedWeek = 40 - weeksLeft;
    return Math.max(1, Math.min(42, estimatedWeek));
  }

  const weekNum = weeksPregnant
    ? Math.max(1, Math.min(42, parseInt(weeksPregnant, 10)))
    : selectedDate
    ? computeWeekFromDueDate(selectedDate)
    : null;

  const weekInfo = weekNum ? getWeekInfo(weekNum) : null;

  const weeksLeft = Math.max(0, 40 - weekNum);
  const tentativeDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + weeksLeft * 7);
    return d;
  })();
  const tentativeLabel = `${tentativeDate.toLocaleDateString()} (in ${weeksLeft} week${weeksLeft === 1 ? '' : 's'})`;

  function emojiForWeek(w: number) {
    if (w <= 4) return '🌱';
    if (w <= 9) return '🌸';
    if (w <= 13) return '🍓';
    if (w <= 17) return '🍋';
    if (w <= 23) return '🍌';
    if (w <= 27) return '🌽';
    if (w <= 31) return '🍆';
    if (w <= 35) return '🍈';
    if (w <= 40) return '🍉';
    if (w <= 42) return '🎃';
    return '👶';
  }

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

        {weekNum ? (
          <View style={{ marginBottom: 16 }}>
            <WeekProgress
              week={weekNum}
              babySizeDescription={weekInfo!.babySize}
              illustration={<Text style={{ fontSize: 32 }}>{emojiForWeek(weekNum)}</Text>}
            />
          </View>
        ) : null}
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
        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: colors.textPrimary, fontWeight: typography.weights.semibold, marginBottom: 8 }}>Due Date</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 8,
              paddingVertical: 12,
              paddingHorizontal: 16,
              backgroundColor: colors.surface,
            }}
          >
            <Text style={{ color: dueDate ? colors.textPrimary : colors.textSecondary }}>
              {dueDate || `Tentative: ${tentativeLabel}`}
            </Text>
          </TouchableOpacity>
        </View>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate ?? tentativeDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
            onChange={(_, d) => {
              setShowDatePicker(Platform.OS === 'ios');
              if (d) {
                setSelectedDate(d);
                const iso = d.toISOString().split('T')[0];
                setDueDate(iso);
              }
            }}
          />
        )}
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
