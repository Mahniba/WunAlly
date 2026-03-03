import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer, Card, SecondaryButton } from '../components';
import { useProfileStore } from '../store';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography } from '../theme';

export function ProfileScreen() {
  const navigation = useNavigation();
  const profile = useProfileStore((s) => s.profile);
  const { s, font, horizontalPadding } = useResponsive();

  const styles = StyleSheet.create({
    header: { paddingHorizontal: horizontalPadding, paddingTop: s(16), paddingBottom: s(8) },
    title: {
      fontSize: font(typography.sizes.xxl),
      fontWeight: typography.weights.bold,
      color: colors.textPrimary,
    },
    scroll: { flex: 1 },
    content: { padding: horizontalPadding, paddingBottom: s(48), flexGrow: 1 },
    label: { fontSize: font(typography.sizes.sm), color: colors.textSecondary, marginTop: s(12) },
    value: { fontSize: font(typography.sizes.base), color: colors.textPrimary, marginBottom: s(4) },
    btn: { marginTop: s(16) },
  });

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title} allowFontScaling maxFontSizeMultiplier={1.3}>
          Profile
        </Text>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card>
          <Text style={styles.label} allowFontScaling maxFontSizeMultiplier={1.3}>Name</Text>
          <Text style={styles.value} allowFontScaling maxFontSizeMultiplier={1.3}>{profile?.name || '—'}</Text>
          <Text style={styles.label} allowFontScaling maxFontSizeMultiplier={1.3}>Weeks Pregnant</Text>
          <Text style={styles.value} allowFontScaling maxFontSizeMultiplier={1.3}>{profile?.weeksPregnant ?? '—'}</Text>
          <Text style={styles.label} allowFontScaling maxFontSizeMultiplier={1.3}>Due Date</Text>
          <Text style={styles.value} allowFontScaling maxFontSizeMultiplier={1.3}>{profile?.dueDate || '—'}</Text>
        </Card>
        <SecondaryButton
          title="Care Plan Notes"
          onPress={() => navigation.navigate('CarePlanNotes')}
          style={styles.btn}
        />
        <SecondaryButton
          title="Chat & Support"
          onPress={() => navigation.navigate('ChatSupport')}
          style={styles.btn}
        />
        <SecondaryButton
          title="Privacy"
          onPress={() => navigation.navigate('Privacy')}
          style={styles.btn}
        />
      </ScrollView>
    </ScreenContainer>
  );
}
