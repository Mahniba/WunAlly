import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { ScreenContainer, ScreenHeader } from '../components';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography } from '../theme';

export function PrivacyScreen() {
  const { s, font, horizontalPadding } = useResponsive();
  const styles = StyleSheet.create({
    scroll: { flex: 1 },
    content: { padding: horizontalPadding, paddingBottom: s(48), flexGrow: 1 },
    body: {
      fontSize: font(typography.sizes.base),
      color: colors.textSecondary,
      lineHeight: font(24),
    },
  });
  return (
    <ScreenContainer>
      <ScreenHeader title="Privacy" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.body} allowFontScaling maxFontSizeMultiplier={1.3}>
          Your data is stored on your device. We do not share your health information with third parties for marketing. Chat and SOS features may send data to support services when you use them. This app does not provide medical diagnosis—always consult your care provider for health decisions.
        </Text>
      </ScrollView>
    </ScreenContainer>
  );
}
