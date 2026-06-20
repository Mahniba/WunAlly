import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppIcon } from './AppIcon';
import PregnantIllustration from './art/PregnantIllustration';
import { CheckInCard } from './checkin/CheckInCard';
import { CheckInCategoryTabs } from './checkin/CheckInCategoryTabs';
import { KeyboardAwareScrollView } from './KeyboardAwareScrollView';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography, shadows } from '../theme';
import { useContentStore } from '../store/useContentStore';
import { useMoodStore, type MoodType } from '../store/useMoodStore';
import { CATEGORY_CHECK_IN_PROMPTS, MOOD_DESCRIPTIONS, NONE_TODAY_COPY } from '../utils/symptomCopy';
import type { MoodOption } from '../services/api/content';

function moodDescription(item: MoodOption): string {
  return item.description?.trim() || MOOD_DESCRIPTIONS[item.key] || '';
}

export function OfflineMoodCheckIn() {
  const navigation = useNavigation();
  const { s, font, horizontalPadding } = useResponsive();
  const moodOptions = useContentStore((st) => st.content.moods);
  const addEntry = useMoodStore((st) => st.addEntry);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [noneToday, setNoneToday] = useState(false);
  const [note, setNote] = useState('');

  const toggle = (key: string) => {
    setNoneToday(false);
    setSelected((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const selectNoneToday = () => {
    setNoneToday((prev) => {
      if (prev) return false;
      setSelected({});
      return true;
    });
  };

  const saveMood = async () => {
    const keys = Object.entries(selected)
      .filter(([, v]) => v)
      .map(([k]) => k as MoodType);

    if (!keys.length && !noneToday) {
      Alert.alert('No mood selected', 'Please select how you feel or tap "None today".');
      return;
    }

    try {
      if (noneToday) {
        navigation.goBack();
        return;
      }
      for (const mood of keys) {
        await addEntry(mood, note.trim() || undefined);
      }
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Could not save your mood check-in.');
    }
  };

  const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#FDF5F2' },
    topBar: { paddingHorizontal: horizontalPadding, paddingTop: s(4), paddingBottom: s(8) },
    backBtn: {
      width: 38,
      height: 38,
      borderRadius: 19,
      borderWidth: 1.5,
      borderColor: '#E8D8D0',
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroWrap: {
      paddingHorizontal: horizontalPadding,
      marginBottom: s(4),
    },
    heroRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },
    heroCopy: { flex: 1, maxWidth: '62%', paddingRight: s(8) },
    title: {
      fontSize: font(26),
      fontWeight: typography.weights.semibold,
      color: '#2D1A14',
      lineHeight: 31,
      marginBottom: s(6),
    },
    prompt: {
      fontSize: font(13),
      color: '#9A7A72',
      lineHeight: 20,
    },
    sectionLabel: {
      fontSize: font(11),
      fontWeight: typography.weights.semibold,
      letterSpacing: 0.8,
      color: '#B09088',
      textTransform: 'uppercase',
      paddingHorizontal: horizontalPadding,
      paddingTop: s(8),
      paddingBottom: s(8),
    },
    list: { paddingHorizontal: horizontalPadding },
    note: {
      marginHorizontal: horizontalPadding,
      borderWidth: 1,
      borderColor: colors.borderLight,
      borderRadius: 14,
      padding: 14,
      backgroundColor: '#FFFFFF',
      color: colors.textPrimary,
      marginTop: s(4),
      marginBottom: s(12),
    },
    footer: { paddingHorizontal: horizontalPadding, paddingBottom: s(32), paddingTop: s(12) },
    saveBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.coralDark,
      borderRadius: 16,
      paddingVertical: 16,
      paddingLeft: 24,
      paddingRight: 10,
      minHeight: 56,
      ...shadows.sm,
    },
    saveLabel: {
      color: '#FFFFFF',
      fontWeight: typography.weights.bold,
      fontSize: font(typography.sizes.lg),
    },
    arrowCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
    },
    privacy: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 5,
      marginTop: s(14),
    },
    privacyText: { fontSize: font(11.5), color: '#B09088' },
  });

  return (
    <View style={styles.root}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <AppIcon name="chevron-left" size={20} color="#9A7A72" />
        </TouchableOpacity>
      </View>

      <KeyboardAwareScrollView contentContainerStyle={{ paddingBottom: s(24) }} showsVerticalScrollIndicator={false}>
        <View style={styles.heroWrap}>
          <View style={styles.heroRow}>
            <View style={styles.heroCopy}>
              <Text style={styles.title}>Mood & Feelings</Text>
              <Text style={styles.prompt}>{CATEGORY_CHECK_IN_PROMPTS.mood}</Text>
            </View>
            <PregnantIllustration size={s(90)} />
          </View>
        </View>

        <CheckInCategoryTabs activeId="mood" />

        <Text style={styles.sectionLabel}>{moodOptions.length} options</Text>

        <View style={styles.list}>
          {moodOptions.map((m) => (
            <CheckInCard
              key={m.key}
              iconKey={m.key}
              label={m.label}
              description={moodDescription(m)}
              checked={!!selected[m.key]}
              onPress={() => toggle(m.key)}
            />
          ))}
          <CheckInCard
            iconKey="none_today"
            label={NONE_TODAY_COPY.label}
            description={NONE_TODAY_COPY.description}
            checked={noneToday}
            onPress={selectNoneToday}
            isNone
          />
        </View>

        <TextInput
          style={styles.note}
          value={note}
          onChangeText={setNote}
          placeholder="Add a note (optional)..."
          placeholderTextColor={colors.textMuted}
        />

        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveBtn} onPress={saveMood} activeOpacity={0.9}>
            <Text style={styles.saveLabel}>Save & Continue</Text>
            <View style={styles.arrowCircle}>
              <AppIcon name="arrow-right" size={20} color={colors.coralDark} />
            </View>
          </TouchableOpacity>
          <View style={styles.privacy}>
            <AppIcon name="lock" size={12} color="#B09088" />
            <Text style={styles.privacyText}>Your data is private and secure.</Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
