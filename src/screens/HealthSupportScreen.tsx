import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenContainer, PrimaryButton } from '../components';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography } from '../theme';

export function HealthSupportScreen({ navigation }: any) {
  const { font, horizontalPadding, sVertical } = useResponsive();
  const styles = StyleSheet.create({
    content: { padding: horizontalPadding, paddingBottom: sVertical(48) },
    title: { fontSize: font(typography.sizes.xxl), fontWeight: typography.weights.bold, color: colors.textPrimary, marginBottom: 12 },
    desc: { color: colors.textSecondary, fontSize: font(typography.sizes.base), marginBottom: 16 },
  });

  return (
    <ScreenContainer>
      <View style={styles.content}>
        <Text style={styles.title}>Health Support</Text>
        <Text style={styles.desc}>Access guidance, tips and connect with local health resources for pregnancy support.</Text>
        <PrimaryButton title="Get Support" onPress={() => navigation.navigate('ChatSupport')} />
      </View>
    </ScreenContainer>
  );
}
