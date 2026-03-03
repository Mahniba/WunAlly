import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { ScreenContainer, Card, ScreenHeader } from '../components';
import { getWeekInfo, getTrimesterLabel } from '../utils/weekData';
import { getTrimesterExpectation } from '../utils/trimesterData';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography } from '../theme';

export function TrackingScreen() {
  const route = useRoute();
  const { s, font, horizontalPadding } = useResponsive();
  const week = (route.params as { week?: number })?.week ?? 24;
  const info = getWeekInfo(week);
  const trimesterInfo = getTrimesterExpectation(info.trimester);
  const [expandedThisWeek, setExpandedThisWeek] = useState(true);
  const [expandedTips, setExpandedTips] = useState(true);
  const [expandedTrimester, setExpandedTrimester] = useState(false);

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
    babyCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: s(20),
      marginBottom: s(16),
      flexDirection: 'row',
      alignItems: 'center',
    },
    babyIllustration: { width: 80, height: 80, justifyContent: 'center', alignItems: 'center', marginRight: s(16) },
    babyEmoji: { fontSize: 48 },
    babyText: {
      flex: 1,
      fontSize: font(typography.sizes.base),
      color: colors.textSecondary,
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
        <View style={styles.babyCard}>
          <View style={styles.babyIllustration}>
            <Text style={styles.babyEmoji}>🌽</Text>
          </View>
          <Text style={styles.babyText} allowFontScaling maxFontSizeMultiplier={1.3}>
            Baby is about the size of {info.babySize}.
          </Text>
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
              {info.tips.map((t, i) => (
                <Text key={i} style={styles.expandableText} allowFontScaling maxFontSizeMultiplier={1.3}>
                  {t}
                </Text>
              ))}
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
