import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { ScreenContainer, PrimaryButton } from '../components';
import { useOnboardingStore } from '../store';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography } from '../theme';

export function OnboardingScreen({ navigation }: any) {
  const complete = useOnboardingStore((s) => s.complete);
  const { s, sVertical, font } = useResponsive();
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    try {
      setLoading(true);
      await complete();
      // Navigate to SignUp now that onboarding is complete
      navigation.navigate('SignUp');
    } catch (e) {
      console.error('Onboarding complete failed', e);
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: s(24),
    },
    heroImage: {
      width: '100%',
      height: s(200),
      marginBottom: sVertical(32),
    },
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
        {/*
          Optional: swap the placeholder below with a real asset
          (e.g. assets/images/onboarding.png) showing a pregnant
          woman holding her belly.
        */}
        <Image
          source={require('../../assets/images/onboarding.png')}
          style={styles.heroImage}
          resizeMode="contain"
        />

        <Text style={styles.title} allowFontScaling maxFontSizeMultiplier={1.3}>
          WunAlly
        </Text>
        <Text style={styles.tagline} allowFontScaling maxFontSizeMultiplier={1.3}>
          Your journey, supported every step of the way.
        </Text>
        <PrimaryButton
          title="Start My Journey"
          onPress={handleStart}
          loading={loading}
          style={styles.button}
        />
      </View>
    </ScreenContainer>
  );
}
