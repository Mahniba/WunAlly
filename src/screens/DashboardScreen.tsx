import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer, WeekProgress, FloatingSOSButton, FloatingVoiceButton } from '../components';
import MoodSummary from '../components/MoodSummary';
import { useSidebar } from '../context/SidebarContext';
import { useProfileStore } from '../store';
import { useContentStore } from '../store/useContentStore';
import { usePersonalizedTips } from '../hooks/usePersonalizedTips';
import { getWeekInfo } from '../utils/weekData';
import { colorFromKey } from '../utils/contentColors';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography } from '../theme';

export function DashboardScreen() {
  const navigation = useNavigation();
  const parent = navigation.getParent() as { navigate: (name: string, params?: object) => void } | undefined;
  const profile = useProfileStore((s) => s.profile);
  const hydrateProfile = useProfileStore((s) => s.hydrate);
  const homeActions = useContentStore((s) => s.content.home_actions);
  const loaded = useContentStore((s) => s.loaded);
  const hydrateContent = useContentStore((s) => s.hydrate);
  const { s, sVertical, font, horizontalPadding } = useResponsive();
  const name = profile?.name || 'there';
  const week = profile?.weeksPregnant;
  const resolvedWeek = week ? Math.max(1, Math.min(42, week)) : 1;
  const weekInfo = week ? getWeekInfo(resolvedWeek) : null;
  const { tips: personalizedTips, loading: tipsLoading } = usePersonalizedTips(resolvedWeek);
  const topTip = personalizedTips[0];

  useEffect(() => {
    hydrateProfile();
    hydrateContent();
  }, [hydrateProfile, hydrateContent]);

  const styles = StyleSheet.create({
    scroll: { flex: 1 },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: horizontalPadding,
      paddingTop: sVertical(8),
      paddingBottom: s(4),
    },
    greetingWrap: { flex: 1 },
    greeting: {
      fontSize: font(typography.sizes.xxl),
      fontWeight: typography.weights.bold,
      color: colors.textPrimary,
    },
    menuBtn: {
      minWidth: 44,
      minHeight: 44,
      justifyContent: 'center',
      alignItems: 'flex-end',
    },
    menuIcon: { fontSize: 24, color: colors.textPrimary },
    content: {
      paddingHorizontal: horizontalPadding,
      paddingTop: sVertical(4),
      paddingBottom: sVertical(120),
      flexGrow: 1,
    },
    weeks: {
      fontSize: font(typography.sizes.base),
      color: colors.textSecondary,
      marginBottom: sVertical(24),
    },
    cardWrap: { marginBottom: sVertical(24) },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -s(6),
    },
    gridItem: {
      width: '50%',
      padding: s(6),
    },
    actionCard: {
      borderRadius: 16,
      paddingVertical: s(18),
      paddingHorizontal: s(12),
      minHeight: s(88),
      justifyContent: 'center',
      alignItems: 'center',
    },
    actionTitle: {
      fontSize: font(typography.sizes.sm),
      fontWeight: typography.weights.semibold,
      textAlign: 'center',
    },
    tipCard: {
      backgroundColor: colors.chipTrack,
      borderRadius: 16,
      padding: s(16),
      marginBottom: sVertical(20),
      borderWidth: 1,
      borderColor: colors.border,
    },
    tipLabel: {
      fontSize: font(typography.sizes.sm),
      fontWeight: typography.weights.semibold,
      color: colors.coralDark,
      marginBottom: s(6),
    },
    tipTitle: {
      fontSize: font(typography.sizes.base),
      fontWeight: typography.weights.semibold,
      color: colors.textPrimary,
      marginBottom: 4,
    },
    tipBody: {
      fontSize: font(typography.sizes.sm),
      color: colors.textSecondary,
      lineHeight: 20,
    },
  });

  const handleAction = (item: (typeof homeActions)[number]) => {
    if (item.nav === 'Reminders') {
      (navigation as { navigate: (name: string) => void }).navigate('Reminders');
    } else {
      const params =
        item.nav === 'Tracking' && week
          ? { week: Math.max(1, Math.min(42, week)) }
          : undefined;
      parent?.navigate(item.nav, params);
    }
  };

  const openSidebar = useSidebar().openSidebar;

  return (
    <ScreenContainer>
      <View style={styles.topBar}>
        <View style={styles.greetingWrap}>
          <Text style={styles.greeting} allowFontScaling maxFontSizeMultiplier={1.3}>
            Hello, {name}!
          </Text>
        </View>
        <TouchableOpacity style={styles.menuBtn} onPress={openSidebar} accessibilityLabel="Open menu">
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {week ? (
          <Text style={styles.weeks} allowFontScaling maxFontSizeMultiplier={1.3}>
            You are {week} weeks pregnant.
          </Text>
        ) : (
          <Text style={styles.weeks}>Complete your profile to see your pregnancy week.</Text>
        )}
        {week && weekInfo ? (
          <View style={styles.cardWrap}>
            <WeekProgress week={week} babySizeDescription={weekInfo.babySize} />
          </View>
        ) : null}
        {tipsLoading ? (
          <ActivityIndicator color={colors.coral} style={{ marginBottom: sVertical(16) }} />
        ) : topTip ? (
          <TouchableOpacity
            style={styles.tipCard}
            onPress={() => parent?.navigate('Tracking', { week: resolvedWeek })}
            activeOpacity={0.9}
            accessibilityRole="button"
            accessibilityLabel="View all personalized tips"
          >
            <Text style={styles.tipLabel}>Tip for you</Text>
            <Text style={styles.tipTitle}>{topTip.title}</Text>
            <Text style={styles.tipBody} numberOfLines={3}>
              {topTip.body}
            </Text>
          </TouchableOpacity>
        ) : null}
        <View style={styles.grid}>
          {!loaded ? (
            <ActivityIndicator color={colors.coral} style={{ margin: 24 }} />
          ) : (
            homeActions.map((item) => (
              <View key={item.key} style={styles.gridItem}>
                <TouchableOpacity
                  style={[styles.actionCard, { backgroundColor: colorFromKey(item.color_key) }]}
                  onPress={() => handleAction(item)}
                  activeOpacity={0.85}
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel={item.title}
                >
                  <Text
                    style={[
                      styles.actionTitle,
                      { color: item.key === 'sos' ? '#FFFFFF' : colors.textPrimary },
                    ]}
                    allowFontScaling
                    maxFontSizeMultiplier={1.2}
                  >
                    {item.title}
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
        <MoodSummary />
      </ScrollView>
      <FloatingVoiceButton onPress={() => parent?.navigate('Chat')} />
      <FloatingSOSButton onPress={() => parent?.navigate('SOS')} />
    </ScreenContainer>
  );
}
