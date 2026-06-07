import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScreenContainer, PrimaryButton } from '../components';
import { useOnboardingStore } from '../store';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography } from '../theme';

export function OnboardingScreen({ navigation }: any) {
  const { t } = useTranslation();
  const complete = useOnboardingStore((s) => s.complete);
  const { s, sVertical, font } = useResponsive();
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    try {
      setLoading(true);
      await complete();
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
        <Image
          source={require('../../assets/images/onboarding.png')}
          style={styles.heroImage}
          resizeMode="contain"
        />

        <Text style={styles.title} allowFontScaling maxFontSizeMultiplier={1.3}>
          {t('onboarding.title')}
        </Text>
        <Text style={styles.tagline} allowFontScaling maxFontSizeMultiplier={1.3}>
          {t('onboarding.tagline')}
        </Text>
        <PrimaryButton
          title={t('onboarding.start')}
          onPress={handleStart}
          loading={loading}
          style={styles.button}
        />
      </View>
    </ScreenContainer>
  );
}
