import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { ScreenContainer, ScreenHeader, WeekProgress } from '../components';
import { getWeekInfo, getTrimesterLabel } from '../utils/weekData';
import { getTrimesterExpectation } from '../utils/trimesterData';
import { useProfileStore } from '../store/useProfileStore';
import { useMoodStore } from '../store/useMoodStore';
import { useSymptomsStore } from '../store/useSymptomsStore';
import { usePersonalizedTips } from '../hooks/usePersonalizedTips';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography } from '../theme';

export function TrackingScreen() {
  const route = useRoute();
  const { s, font, horizontalPadding } = useResponsive();
  const profile = useProfileStore((st) => st.profile);
  const weekFromProfile = profile?.weeksPregnant;
  const weekParam = (route.params as { week?: number })?.week;
  const week = weekParam ?? weekFromProfile ?? 1;
  const info = getWeekInfo(Math.max(1, Math.min(42, week)));
  const trimesterInfo = getTrimesterExpectation(info.trimester);
  const [expandedThisWeek, setExpandedThisWeek] = useState(true);
  const [expandedTips, setExpandedTips] = useState(true);
  const [expandedTrimester, setExpandedTrimester] = useState(false);

  const hydrateProfile = useProfileStore((st) => st.hydrate);
  const hydrateMood = useMoodStore((st) => st.hydrate);
  const hydrateSymptoms = useSymptomsStore((st) => st.hydrate);
  const resolvedWeek = Math.max(1, Math.min(42, week));
  const { tips: personalized, loading: tipsLoading } = usePersonalizedTips(resolvedWeek);

  React.useEffect(() => {
    hydrateProfile();
    hydrateMood();
    hydrateSymptoms();
  }, [hydrateProfile, hydrateMood, hydrateSymptoms]);

  const styles = StyleSheet.create({
    scroll: { flex: 1 },
    content: { padding: horizontalPadding, paddingBottom: s(48), flexGrow: 1 },
    weekTitle: {
      fontSize: font(typography.sizes.xxl),
      fontWeight: typography.weights.bold,
      color: colors.textPrimary,
    },
    trimester: {
      fontSize: font(typography.sizes.base),
      color: colors.textSecondary,
      marginBottom: s(20),
    },
    expandableCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      marginBottom: s(12),
      overflow: 'hidden',
    },
    expandableHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: s(16),
      minHeight: 52,
    },
    expandableTitle: {
      fontSize: font(typography.sizes.lg),
      fontWeight: typography.weights.semibold,
      color: colors.textPrimary,
    },
    expandableArrow: { fontSize: 18, color: colors.textMuted },
    expandableBody: { paddingHorizontal: s(16), paddingBottom: s(16) },
    expandableText: {
      fontSize: font(typography.sizes.base),
      color: colors.textSecondary,
      lineHeight: 22,
    },
    tipCard: {
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 12,
      padding: s(12),
      marginTop: s(10),
      borderWidth: 1,
      borderColor: colors.border,
    },
    tipTitle: { color: colors.textPrimary, fontWeight: typography.weights.semibold, marginBottom: 4 },
    tipBody: { color: colors.textSecondary, lineHeight: 20 },
  });

  return (
    <ScreenContainer>
      <ScreenHeader title={`Week ${info.week}`} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.weekTitle} allowFontScaling maxFontSizeMultiplier={1.3}>
          Week {info.week}
        </Text>
        <Text style={styles.trimester} allowFontScaling maxFontSizeMultiplier={1.3}>
          {getTrimesterLabel(info.trimester)}
        </Text>
        <View style={{ marginBottom: s(16) }}>
          <WeekProgress week={info.week} />
        </View>
        <TouchableOpacity
          style={styles.expandableCard}
          onPress={() => setExpandedThisWeek((v) => !v)}
          activeOpacity={0.9}
        >
          <View style={styles.expandableHeader}>
            <Text style={styles.expandableTitle}>This Week</Text>
            <Text style={styles.expandableArrow}>{expandedThisWeek ? '▼' : '▶'}</Text>
          </View>
          {expandedThisWeek && (
            <View style={styles.expandableBody}>
              <Text style={styles.expandableText} allowFontScaling maxFontSizeMultiplier={1.3}>
                {info.development}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.expandableCard}
          onPress={() => setExpandedTips((v) => !v)}
          activeOpacity={0.9}
        >
          <View style={styles.expandableHeader}>
            <Text style={styles.expandableTitle}>Tips for You</Text>
            <Text style={styles.expandableArrow}>{expandedTips ? '▼' : '▶'}</Text>
          </View>
          {expandedTips && (
            <View style={styles.expandableBody}>
              <Text style={[styles.expandableText, { marginBottom: s(8) }]}>
                Personalized from your mood, symptoms, sleep, pain, and profile — updated as you check in.
              </Text>
              {tipsLoading ? (
                <ActivityIndicator color={colors.coral} style={{ marginVertical: 12 }} />
              ) : personalized.length > 0 ? (
                personalized.map((t) => (
                  <View key={t.title} style={styles.tipCard}>
                    <Text style={styles.tipTitle}>{t.title}</Text>
                    <Text style={styles.tipBody}>{t.body}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.expandableText}>
                  Log a mood or symptom check-in to unlock personalized tips.
                </Text>
              )}
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.expandableCard}
          onPress={() => setExpandedTrimester((v) => !v)}
          activeOpacity={0.9}
        >
          <View style={styles.expandableHeader}>
            <Text style={styles.expandableTitle}>Things to expect this trimester</Text>
            <Text style={styles.expandableArrow}>{expandedTrimester ? '▼' : '▶'}</Text>
          </View>
          {expandedTrimester && (
            <View style={styles.expandableBody}>
              <Text style={styles.expandableText}>{trimesterInfo.title}</Text>
              {trimesterInfo.expectations.map((e, i) => (
                <Text key={i} style={[styles.expandableText, { marginTop: i === 0 ? 8 : 4 }]}>
                  • {e}
                </Text>
              ))}
            </View>
          )}
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}
