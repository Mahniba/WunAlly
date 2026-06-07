import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import {
  TabScreenContainer,
  WeekProgress,
  FloatingSOSButton,
  FloatingVoiceButton,
  AppIcon,
  SectionHeader,
} from '../components';
import MoodSummary from '../components/MoodSummary';
import { useSidebar } from '../context/SidebarContext';
import { useProfileStore } from '../store';
import { useContentStore } from '../store/useContentStore';
import { usePersonalizedTips } from '../hooks/usePersonalizedTips';
import { getWeekInfo } from '../utils/weekData';
import { colorFromKey } from '../utils/contentColors';
import { iconForHomeAction } from '../utils/iconMap';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography, shadows } from '../theme';

export function DashboardScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const parent = navigation.getParent() as { navigate: (name: string, params?: object) => void } | undefined;
  const profile = useProfileStore((s) => s.profile);
  const hydrateProfile = useProfileStore((s) => s.hydrate);
  const homeActions = useContentStore((s) => s.content.home_actions);
  const loaded = useContentStore((s) => s.loaded);
  const hydrateContent = useContentStore((s) => s.hydrate);
  const { s, sVertical, font, horizontalPadding } = useResponsive();
  const GRID_GUTTER = s(12); // single source of spacing for the quick-actions grid
  const SECTION_SPACING = sVertical(20);
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
      fontSize: font(typography.sizes.title),
      fontWeight: typography.weights.bold,
      color: colors.textPrimary,
      letterSpacing: -0.5,
    },
    weeks: {
      fontSize: font(typography.sizes.base),
      color: colors.textSecondary,
      marginTop: s(4),
    },
    menuBtn: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.borderLight,
      justifyContent: 'center',
      alignItems: 'center',
      ...shadows.sm,
    },
    content: {
      paddingHorizontal: horizontalPadding,
      paddingTop: sVertical(8),
      paddingBottom: sVertical(120),
      flexGrow: 1,
    },
    cardWrap: { marginBottom: SECTION_SPACING },
    section: { marginBottom: SECTION_SPACING },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -(GRID_GUTTER / 2),
    },
    gridItem: {
      width: '50%',
      padding: GRID_GUTTER / 2,
    },
    actionCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      paddingVertical: s(16),
      paddingHorizontal: s(12),
      minHeight: s(96),
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.borderLight,
      ...shadows.sm,
    },
    actionCardSos: {
      backgroundColor: colors.sos,
      borderColor: colors.sos,
    },
    iconCircle: {
      width: 44,
      height: 44,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: s(8),
    },
    actionTitle: {
      fontSize: font(typography.sizes.sm),
      fontWeight: typography.weights.semibold,
      textAlign: 'center',
      letterSpacing: 0.1,
    },
    tipCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: s(16),
      marginBottom: SECTION_SPACING,
      borderWidth: 1,
      borderColor: colors.borderLight,
      borderLeftWidth: 3,
      borderLeftColor: colors.coralDark,
      ...shadows.sm,
    },
    tipLabel: {
      fontSize: font(typography.sizes.xs),
      fontWeight: typography.weights.semibold,
      color: colors.coralDark,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom: s(6),
    },
    tipTitle: {
      fontSize: font(typography.sizes.base),
      fontWeight: typography.weights.semibold,
      color: colors.textPrimary,
      marginBottom: 4,
      lineHeight: 22,
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
          : item.nav === 'Chat'
          ? { mode: 'ai' as const }
          : undefined;
      parent?.navigate(item.nav, params);
    }
  };

  const openSidebar = useSidebar().openSidebar;

  return (
    <TabScreenContainer>
      <View style={styles.topBar}>
        <View style={styles.greetingWrap}>
          <Text style={styles.greeting} allowFontScaling maxFontSizeMultiplier={1.3}>
            {t('home.greeting', { name })}
          </Text>
          {week ? (
            <Text style={styles.weeks} allowFontScaling maxFontSizeMultiplier={1.3}>
              {t('home.weekOf', { week })}
            </Text>
          ) : (
            <Text style={styles.weeks}>{t('home.completeProfile')}</Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.menuBtn}
          onPress={openSidebar}
          accessibilityLabel={t('home.openMenu')}
        >
          <AppIcon name="menu" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets
      >
        {week && weekInfo ? (
          <View style={styles.cardWrap}>
            <WeekProgress week={week} />
          </View>
        ) : null}

        {tipsLoading ? (
          <ActivityIndicator color={colors.coralDark} style={{ marginBottom: sVertical(16) }} />
        ) : topTip ? (
          <TouchableOpacity
            style={styles.tipCard}
            onPress={() => parent?.navigate('Tracking', { week: resolvedWeek })}
            activeOpacity={0.92}
            accessibilityRole="button"
            accessibilityLabel={t('home.tipA11y')}
          >
            <Text style={styles.tipLabel}>{t('home.tipLabel')}</Text>
            <Text style={styles.tipTitle}>{topTip.title}</Text>
            <Text style={styles.tipBody} numberOfLines={3}>
              {topTip.body}
            </Text>
          </TouchableOpacity>
        ) : null}

        <View style={styles.section}>
          <SectionHeader title={t('home.quickActions')} subtitle={t('home.quickActionsSub')} />
          <View style={styles.grid}>
            {!loaded ? (
              <ActivityIndicator color={colors.coralDark} style={{ margin: 24 }} />
            ) : (
              homeActions.map((item) => {
                const isSos = item.key === 'sos';
                const tint = colorFromKey(item.color_key);
                const iconColor = isSos ? '#FFFFFF' : colors.coralDark;

                return (
                  <View key={item.key} style={styles.gridItem}>
                    <TouchableOpacity
                      style={[styles.actionCard, isSos && styles.actionCardSos]}
                      onPress={() => handleAction(item)}
                      activeOpacity={0.88}
                      accessible
                      accessibilityRole="button"
                      accessibilityLabel={item.title}
                    >
                      <View
                        style={[
                          styles.iconCircle,
                          { backgroundColor: isSos ? 'rgba(255,255,255,0.2)' : tint },
                        ]}
                      >
                        <AppIcon
                          name={iconForHomeAction(item.key)}
                          size={20}
                          color={iconColor}
                        />
                      </View>
                      <Text
                        style={[
                          styles.actionTitle,
                          { color: isSos ? '#FFFFFF' : colors.textPrimary },
                        ]}
                        allowFontScaling
                        maxFontSizeMultiplier={1.2}
                      >
                        {item.title}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })
            )}
          </View>
        </View>

        <MoodSummary />
      </ScrollView>

      <FloatingVoiceButton onPress={() => parent?.navigate('Chat', { mode: 'ai', voice: true })} />
      <FloatingSOSButton onPress={() => parent?.navigate('SOS')} />
    </TabScreenContainer>
  );
}
