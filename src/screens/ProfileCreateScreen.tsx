import React, { useState } from 'react';
import { Text, StyleSheet, View, Platform, TouchableOpacity } from 'react-native';
import { ScreenContainer, InputField, PrimaryButton, WeekProgress, KeyboardAwareScrollView } from '../components';
import { useProfileStore, getDefaultProfile } from '../store';
import { getErrorMessage } from '../services/api/errors';
import { resetAfterAuth } from '../navigation/authNavigation';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography } from '../theme';
import DateTimePicker from '@react-native-community/datetimepicker';
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
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const handleStart = async () => {
    if (!name.trim()) {
      setSaveError('Please enter your name.');
      return;
    }
    try {
      setSaving(true);
      setSaveError('');
      const profile = getDefaultProfile();
      profile.name = name.trim();
      profile.age = age.trim();
      profile.weeksPregnant = parseInt(weeksPregnant, 10) || 24;
      profile.dueDate = dueDate.trim();
      profile.dueDateSet = !!profile.dueDate;
      profile.healthConditions = healthConditions.trim();
      setProfile(profile);
      await persist();
      setShowContactsPrompt(true);
    } catch (err: unknown) {
      setSaveError(getErrorMessage(err, 'Could not save your profile. Please try again.'));
    } finally {
      setSaving(false);
    }
  };

  const [showContactsPrompt, setShowContactsPrompt] = React.useState(false);

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

  const weeksLeft = Math.max(0, 40 - (weekNum ?? 40));
  const tentativeDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + weeksLeft * 7);
    return d;
  })();
  const tentativeLabel = `${tentativeDate.toLocaleDateString()} (in ${weeksLeft} week${weeksLeft === 1 ? '' : 's'})`;

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
      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title} allowFontScaling maxFontSizeMultiplier={1.3}>
          Create Your Profile
        </Text>

        {weekNum ? (
          <View style={{ marginBottom: 16 }}>
            <WeekProgress week={weekNum} />
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
        {saveError ? (
          <Text style={{ color: colors.sos, marginBottom: s(8) }}>{saveError}</Text>
        ) : null}
        <PrimaryButton
          title={saving ? 'Saving…' : 'Start My Journey'}
          onPress={handleStart}
          style={styles.button}
          disabled={saving}
        />
        {/* Prompt modal to add emergency contacts */}
        {showContactsPrompt && (
          <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: '90%', backgroundColor: 'white', padding: 20, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.2, elevation: 8 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>Add emergency contacts?</Text>
              <Text style={{ color: colors.textSecondary, marginBottom: 16 }}>Would you like to add emergency contacts now so we can reach your support person if needed?</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
                <TouchableOpacity onPress={() => { setShowContactsPrompt(false); resetAfterAuth(navigation, true); }} style={{ padding: 10 }}>
                  <Text style={{ color: colors.textSecondary }}>Later</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setShowContactsPrompt(false); navigation.navigate('EmergencyContacts'); }} style={{ padding: 10 }}>
                  <Text style={{ color: colors.lavenderDark, fontWeight: '700' }}>Add Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </KeyboardAwareScrollView>
    </ScreenContainer>
  );
}
