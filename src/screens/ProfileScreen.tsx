import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer, Card, SecondaryButton, SymptomsSettings, SymptomsChart } from '../components';
import { useProfileStore } from '../store';
import { WeekProgress } from '../components';
import { getWeekInfo } from '../utils/weekData';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography } from '../theme';

export function ProfileScreen() {
  const navigation = useNavigation();
  const profile = useProfileStore((s) => s.profile);
  const { s, font, horizontalPadding } = useResponsive();
  const [showSettings, setShowSettings] = useState(false);

  const styles = StyleSheet.create({
    header: { paddingHorizontal: horizontalPadding, paddingTop: s(16), paddingBottom: s(8) },
    title: {
      fontSize: font(typography.sizes.xxl),
      fontWeight: typography.weights.bold,
      color: colors.textPrimary,
    },
    scroll: { flex: 1 },
    content: { padding: horizontalPadding, paddingBottom: s(48), flexGrow: 1 },
    label: { fontSize: font(typography.sizes.sm), color: colors.textSecondary, marginTop: s(12) },
    value: { fontSize: font(typography.sizes.base), color: colors.textPrimary, marginBottom: s(4) },
    btn: { marginTop: s(16) },
    smallBtn: { marginTop: s(10) },
  });

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title} allowFontScaling maxFontSizeMultiplier={1.3}>
          Profile
        </Text>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card>
          <Text style={styles.label} allowFontScaling maxFontSizeMultiplier={1.3}>Name</Text>
          <Text style={styles.value} allowFontScaling maxFontSizeMultiplier={1.3}>{profile?.name || '—'}</Text>
          <Text style={styles.label} allowFontScaling maxFontSizeMultiplier={1.3}>Weeks Pregnant</Text>
          <Text style={styles.value} allowFontScaling maxFontSizeMultiplier={1.3}>{profile?.weeksPregnant ?? '—'}</Text>
          <Text style={styles.label} allowFontScaling maxFontSizeMultiplier={1.3}>Due Date</Text>
          <Text style={styles.value} allowFontScaling maxFontSizeMultiplier={1.3}>{profile?.dueDate || '—'}</Text>
        </Card>

        {/* Show live WeekProgress if weeks or due date present */}
        {((profile?.weeksPregnant && profile.weeksPregnant > 0) || profile?.dueDateSet) ? (
          (() => {
            const weekNum = profile?.weeksPregnant && profile.weeksPregnant > 0
              ? Math.max(1, Math.min(42, profile.weeksPregnant))
              : profile?.dueDate
              ? ((): number => {
                  try {
                    const d = new Date(profile.dueDate);
                    // reuse the same inference used in profile create
                    const today = new Date();
                    const diffMs = d.getTime() - today.getTime();
                    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
                    const weeksLeft = Math.ceil(daysLeft / 7);
                    const estimatedWeek = 40 - weeksLeft;
                    return Math.max(1, Math.min(42, estimatedWeek));
                  } catch {
                    return 1;
                  }
                })()
              : 1;

            const weekInfo = getWeekInfo(weekNum);
            const emojiForWeek = (w: number) => {
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
            };

            return (
              <View style={{ marginTop: 16 }}>
                <WeekProgress
                  week={weekNum}
                  babySizeDescription={weekInfo.babySize}
                  illustration={<Text style={{ fontSize: 32 }}>{emojiForWeek(weekNum)}</Text>}
                />
              </View>
            );
          })()
        ) : null}
        <SecondaryButton
          title="Care Plan Notes"
          onPress={() => navigation.navigate('CarePlanNotes')}
          style={styles.btn}
        />
        <SecondaryButton
          title="Symptom Settings"
          onPress={() => setShowSettings(true)}
          style={styles.smallBtn}
        />
        <Card style={{ marginTop: 12 }}>
          <SymptomsChart days={14} />
        </Card>
        <SecondaryButton
          title="Chat & Support"
          onPress={() => navigation.navigate('ChatSupport')}
          style={styles.btn}
        />
        <SecondaryButton
          title="Privacy"
          onPress={() => navigation.navigate('Privacy')}
          style={styles.btn}
        />
      </ScrollView>
      <SymptomsSettings visible={showSettings} onClose={() => setShowSettings(false)} />
    </ScreenContainer>
  );
}
