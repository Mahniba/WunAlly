import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScreenContainer, PrimaryButton, LanguageSelector } from '../components';
import { useLanguageStore } from '../store/useLanguageStore';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography } from '../theme';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Language'>;
};

export function LanguageScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const markChosen = useLanguageStore((s) => s.markChosen);
  const { s, sVertical, font } = useResponsive();
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    try {
      setLoading(true);
      await markChosen();
      navigation.replace('Onboarding');
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    content: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: s(24),
    },
    title: {
      fontSize: font(typography.sizes.title),
      fontWeight: typography.weights.bold,
      color: colors.textPrimary,
      textAlign: 'center',
      marginBottom: s(8),
    },
    subtitle: {
      fontSize: font(typography.sizes.base),
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: sVertical(32),
      lineHeight: 22,
    },
    selector: { marginBottom: sVertical(32) },
    button: { width: '100%' },
  });

  return (
    <ScreenContainer>
      <View style={styles.content}>
        <Text style={styles.title} allowFontScaling>
          {t('language.title')}
        </Text>
        <Text style={styles.subtitle} allowFontScaling>
          {t('language.subtitle')}
        </Text>
        <View style={styles.selector}>
          <LanguageSelector />
        </View>
        <PrimaryButton
          title={t('language.continue')}
          onPress={handleContinue}
          loading={loading}
          style={styles.button}
        />
      </View>
    </ScreenContainer>
  );
}
