import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenContainer, PrimaryButton } from '../components';
import { useOnboardingStore } from '../store';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography } from '../theme';

export function OnboardingScreen() {
  const complete = useOnboardingStore((s) => s.complete);
  const { s, sVertical, font } = useResponsive();

  const handleStart = async () => {
    await complete();
  };

  const styles = StyleSheet.create({
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: s(24),
    },
    logoWrap: {
      width: s(120),
      height: s(120),
      borderRadius: s(60),
      backgroundColor: colors.softPurple,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: sVertical(32),
    },
    logoIcon: { fontSize: font(56), color: colors.lavenderDark },
    title: {
      fontSize: font(typography.sizes.title),
      fontWeight: typography.weights.bold,
      color: colors.textPrimary,
      textAlign: 'center',
      marginBottom: s(12),
    },
    tagline: {
      fontSize: font(typography.sizes.base),
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: sVertical(48),
    },
    button: { width: '100%', maxWidth: s(320) },
  });

  return (
    <ScreenContainer>
      <View style={styles.content}>
        <View style={styles.logoWrap}>
          <Text style={styles.logoIcon}>♥</Text>
        </View>
        <Text style={styles.title} allowFontScaling maxFontSizeMultiplier={1.3}>
          Pregnancy Companion
        </Text>
        <Text style={styles.tagline} allowFontScaling maxFontSizeMultiplier={1.3}>
          Your journey, supported every step of the way.
        </Text>
        <PrimaryButton
          title="Start My Journey"
          onPress={handleStart}
          style={styles.button}
        />
      </View>
    </ScreenContainer>
  );
}
