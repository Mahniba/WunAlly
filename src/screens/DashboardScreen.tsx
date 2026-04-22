import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer, WeekProgress, FloatingSOSButton, FloatingVoiceButton } from '../components';
import MoodSummary from '../components/MoodSummary';
import { useSidebar } from '../context/SidebarContext';
import { useProfileStore } from '../store';
import { getWeekInfo } from '../utils/weekData';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography } from '../theme';

const ACTIONS = [
  { key: 'track', title: 'Track Progress', bg: colors.lavender, nav: 'Tracking' as const },
  { key: 'chat', title: 'Chat with AI', bg: colors.chipChat, nav: 'Chat' as const },
  { key: 'reminders', title: 'Reminders', bg: colors.chipReminders, nav: 'Reminders' as const },
  { key: 'sos', title: 'SOS Alert', bg: colors.sos, nav: 'SOS' as const },
] as const;

export function DashboardScreen() {
  const navigation = useNavigation();
  const parent = navigation.getParent() as { navigate: (name: string, params?: object) => void } | undefined;
  const profile = useProfileStore((s) => s.profile);
  const { s, sVertical, font, horizontalPadding } = useResponsive();
  const name = profile?.name || 'there';
  const week = profile?.weeksPregnant ?? 24;
  const weekInfo = getWeekInfo(week);

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
  });

  const handleAction = (item: (typeof ACTIONS)[number]) => {
    if (item.nav === 'Reminders') {
      (navigation as { navigate: (name: string) => void }).navigate('Reminders');
    } else {
      parent?.navigate(item.nav, item.nav === 'Tracking' ? { week } : undefined);
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
        <Text style={styles.weeks} allowFontScaling maxFontSizeMultiplier={1.3}>
          You are {week} weeks pregnant.
        </Text>
        <View style={styles.cardWrap}>
          <WeekProgress week={week} babySizeDescription={weekInfo.babySize} />
        </View>
        <View style={styles.grid}>
          {ACTIONS.map((item) => (
            <View key={item.key} style={styles.gridItem}>
              <TouchableOpacity
                style={[styles.actionCard, { backgroundColor: item.bg }]}
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
          ))}
        </View>
        <MoodSummary />
      </ScrollView>
      <FloatingVoiceButton onPress={() => parent?.navigate('Chat')} />
      <FloatingSOSButton onPress={() => parent?.navigate('SOS')} />
    </ScreenContainer>
  );
}
