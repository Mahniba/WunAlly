import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenContainer } from '../components';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography } from '../theme';
import { useNavigation } from '@react-navigation/native';

const categories = [
  { title: 'Mood & Feelings', subtitle: 'Track your emotions and mental well-being', icon: '😊', color: colors.chipTrack },
  { title: 'General Symptoms', subtitle: 'Common symptoms you may be experiencing', icon: '⚕️', color: colors.chipReminders },
  { title: 'Warning Signs', subtitle: 'Important signs that need immediate attention', icon: '⚠️', color: '#FFF5E8' },
  { title: 'Baby Monitoring', subtitle: "Track your baby's movements and well-being", icon: '🤰', color: colors.chipChat },
  { title: 'Body Changes', subtitle: 'Normal changes during pregnancy', icon: '🫙', color: colors.chipTrack },
  { title: 'Vaginal Health', subtitle: 'Update about any discharge or related changes', icon: '💧', color: colors.chipReminders },
];

export function CheckInHomeScreen() {
  const { s, font, horizontalPadding } = useResponsive();
  const navigation = useNavigation();

  const styles = StyleSheet.create({
    headerSpace: { paddingHorizontal: horizontalPadding, paddingTop: s(12), paddingBottom: s(6) },
    title: { fontSize: font(typography.sizes.xxl), fontWeight: typography.weights.bold, color: colors.textPrimary },
    subtitle: { color: colors.textSecondary, marginTop: s(6), marginBottom: s(12) },
    grid: { paddingHorizontal: horizontalPadding, paddingBottom: s(48), gap: s(12) },
    card: { backgroundColor: colors.surface, borderRadius: 12, padding: s(16), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: colors.border },
    left: { flexDirection: 'row', alignItems: 'center', gap: s(12) },
    iconBox: { width: 56, height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    cardText: { flex: 1, marginLeft: s(8) },
    cardTitle: { color: colors.textPrimary, fontWeight: typography.weights.semibold },
    cardSubtitle: { color: colors.textSecondary, marginTop: 4 },
  });

  return (
    <ScreenContainer>
      <View style={styles.headerSpace}>
        <Text style={styles.title}>Today's Check-In</Text>
        <Text style={styles.subtitle}>How are you feeling today?</Text>
      </View>
      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {categories.map((c) => (
          <TouchableOpacity
            key={c.title}
            style={[styles.card, { backgroundColor: c.color }]}
            activeOpacity={0.8}
            onPress={() => {
              if (c.title === 'Warning Signs') navigation.navigate('WarningSigns' as never);
              else navigation.navigate('WarningSigns' as never);
            }}
          >
            <View style={styles.left}>
              <View style={[styles.iconBox, { backgroundColor: colors.backgroundSecondary }]}>
                <Text style={{ fontSize: 24 }}>{c.icon}</Text>
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{c.title}</Text>
                <Text style={styles.cardSubtitle}>{c.subtitle}</Text>
              </View>
            </View>
            <Text style={{ color: colors.textMuted }}>›</Text>
          </TouchableOpacity>
        ))}

        <View style={{ marginTop: s(12), padding: s(12), backgroundColor: colors.surface, borderRadius: 12 }}>
          <Text style={{ color: colors.textSecondary }}>Your data is safe with us. Your information is private and used only to personalize your care.</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
