import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ScreenContainer } from '../components';
import MoodSummary from '../components/MoodSummary';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography } from '../theme';
import { useContentStore } from '../store/useContentStore';

export function MoodCheckInScreen() {
  const { s, font, horizontalPadding } = useResponsive();
  const hydrateContent = useContentStore((st) => st.hydrate);

  useEffect(() => {
    hydrateContent();
  }, [hydrateContent]);

  const styles = StyleSheet.create({
    header: { paddingHorizontal: horizontalPadding, paddingTop: s(12), paddingBottom: s(6) },
    title: { fontSize: font(typography.sizes.xxl), fontWeight: typography.weights.bold, color: colors.textPrimary },
    subtitle: { color: colors.textSecondary, marginTop: s(6) },
  });

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Mood & Feelings</Text>
        <Text style={styles.subtitle}>How are you feeling today?</Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: s(48) }}>
        <MoodSummary />
      </ScrollView>
    </ScreenContainer>
  );
}
