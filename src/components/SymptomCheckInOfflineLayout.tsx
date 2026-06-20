import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppIcon } from './AppIcon';
import { KeyboardAwareScrollView } from './KeyboardAwareScrollView';
import PregnantIllustration from './art/PregnantIllustration';
import { CheckInCard } from './checkin/CheckInCard';
import { CheckInCategoryTabs, type CheckInTabId } from './checkin/CheckInCategoryTabs';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography, shadows } from '../theme';
import type { SymptomOption } from '../services/api/content';
import {
  CATEGORY_CHECK_IN_PROMPTS,
  NONE_TODAY_COPY,
  SYMPTOM_DESCRIPTIONS,
} from '../utils/symptomCopy';

type Props = {
  title: string;
  category: CheckInTabId;
  symptoms: SymptomOption[];
  selected: Record<string, boolean>;
  onToggle: (key: string) => void;
  onNoneToday: () => void;
  onSave: () => void;
  noneSelected: boolean;
  showExtras?: boolean;
  notes: string;
  onNotesChange: (v: string) => void;
  sleepHours: string;
  onSleepHoursChange: (v: string) => void;
  painLevel: string;
  onPainLevelChange: (v: string) => void;
  foodNote: string;
  onFoodNoteChange: (v: string) => void;
  isWarning?: boolean;
};

function descriptionFor(category: string, item: SymptomOption): string {
  return (
    item.description?.trim() ||
    SYMPTOM_DESCRIPTIONS[category]?.[item.key] ||
    ''
  );
}

function SaveContinueButton({ onPress }: { onPress: () => void }) {
  const { font } = useResponsive();

  return (
    <TouchableOpacity
      style={saveStyles.btn}
      onPress={onPress}
      activeOpacity={0.9}
      accessibilityRole="button"
      accessibilityLabel="Save and Continue"
    >
      <Text style={[saveStyles.label, { fontSize: font(typography.sizes.lg) }]}>Save & Continue</Text>
      <View style={saveStyles.arrowCircle}>
        <AppIcon name="arrow-right" size={20} color={colors.coralDark} />
      </View>
    </TouchableOpacity>
  );
}

const saveStyles = StyleSheet.create({
  btn: {
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
  label: {
    color: '#FFFFFF',
    fontWeight: typography.weights.bold,
    letterSpacing: 0.2,
  },
  arrowCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export function SymptomCheckInOfflineLayout({
  title,
  category,
  symptoms,
  selected,
  onToggle,
  onNoneToday,
  onSave,
  noneSelected,
  showExtras,
  notes,
  onNotesChange,
  sleepHours,
  onSleepHoursChange,
  painLevel,
  onPainLevelChange,
  foodNote,
  onFoodNoteChange,
  isWarning,
}: Props) {
  const navigation = useNavigation();
  const { s, font, horizontalPadding } = useResponsive();
  const prompt =
    CATEGORY_CHECK_IN_PROMPTS[category] ||
    "Select any symptoms you've been feeling today. You can select more than one.";

  const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#FDF5F2' },
    topBar: {
      paddingHorizontal: horizontalPadding,
      paddingTop: s(4),
      paddingBottom: s(8),
    },
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
      minHeight: s(100),
    },
    heroRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },
    heroCopy: {
      flex: 1,
      paddingRight: s(8),
      maxWidth: '62%',
    },
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
    heroArt: {
      marginTop: s(-4),
    },
    warningBox: {
      marginHorizontal: horizontalPadding,
      marginBottom: s(12),
      backgroundColor: '#FFF5E8',
      borderRadius: 14,
      padding: s(14),
      borderWidth: 1,
      borderColor: '#F5E0C8',
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
    list: {
      paddingHorizontal: horizontalPadding,
      paddingBottom: s(8),
    },
    fieldLabel: {
      color: colors.textSecondary,
      fontSize: font(typography.sizes.sm),
      marginTop: s(8),
      marginBottom: s(6),
      fontWeight: typography.weights.medium,
    },
    input: {
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: colors.borderLight,
      borderRadius: 14,
      padding: 14,
      color: colors.textPrimary,
      marginBottom: s(6),
    },
    footer: {
      paddingHorizontal: horizontalPadding,
      paddingBottom: s(32),
      paddingTop: s(12),
    },
    privacy: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 5,
      marginTop: s(14),
    },
    privacyText: {
      fontSize: font(11.5),
      color: '#B09088',
    },
  });

  return (
    <View style={styles.root}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <AppIcon name="chevron-left" size={20} color="#9A7A72" />
        </TouchableOpacity>
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={{ paddingBottom: s(24) }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroWrap}>
          <View style={styles.heroRow}>
            <View style={styles.heroCopy}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.prompt}>{prompt}</Text>
            </View>
            <View style={styles.heroArt}>
              <PregnantIllustration size={s(90)} />
            </View>
          </View>
        </View>

        <CheckInCategoryTabs activeId={category} />

        {isWarning ? (
          <View style={styles.warningBox}>
            <Text style={{ color: colors.textPrimary, fontWeight: typography.weights.semibold }}>
              If you select any of these, seek medical advice promptly.
            </Text>
          </View>
        ) : null}

        <Text style={styles.sectionLabel}>{symptoms.length} options</Text>

        <View style={styles.list}>
          {symptoms.map((item) => (
            <CheckInCard
              key={item.key}
              iconKey={item.key}
              label={item.label}
              description={descriptionFor(category, item)}
              checked={!!selected[item.key]}
              onPress={() => onToggle(item.key)}
            />
          ))}

          <CheckInCard
            iconKey="none_today"
            label={NONE_TODAY_COPY.label}
            description={NONE_TODAY_COPY.description}
            checked={noneSelected}
            onPress={onNoneToday}
            isNone
          />

          {showExtras ? (
            <>
              <Text style={styles.fieldLabel}>Sleep hours (optional)</Text>
              <TextInput
                style={styles.input}
                value={sleepHours}
                onChangeText={onSleepHoursChange}
                keyboardType="decimal-pad"
                placeholder="e.g. 7"
                placeholderTextColor={colors.textMuted}
              />
              <Text style={styles.fieldLabel}>Pain level 1–10 (optional)</Text>
              <TextInput
                style={styles.input}
                value={painLevel}
                onChangeText={onPainLevelChange}
                keyboardType="number-pad"
                placeholder="e.g. 3"
                placeholderTextColor={colors.textMuted}
              />
              <Text style={styles.fieldLabel}>Food notes (optional)</Text>
              <TextInput
                style={styles.input}
                value={foodNote}
                onChangeText={onFoodNoteChange}
                placeholder="e.g. small meals + water"
                placeholderTextColor={colors.textMuted}
              />
              <Text style={styles.fieldLabel}>Notes (optional)</Text>
              <TextInput
                style={styles.input}
                value={notes}
                onChangeText={onNotesChange}
                placeholder="Additional notes"
                placeholderTextColor={colors.textMuted}
                multiline
              />
            </>
          ) : null}
        </View>

        <View style={styles.footer}>
          <SaveContinueButton onPress={onSave} />
          <View style={styles.privacy}>
            <AppIcon name="lock" size={12} color="#B09088" />
            <Text style={styles.privacyText}>Your data is private and secure.</Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
