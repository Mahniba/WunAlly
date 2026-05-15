import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ScreenContainer } from '../components';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography } from '../theme';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useContentStore } from '../store/useContentStore';
import { colorFromKey } from '../utils/contentColors';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function CheckInHomeScreen() {
  const { s, font, horizontalPadding } = useResponsive();
  const navigation = useNavigation<Nav>();
  const categories = useContentStore((st) => st.content.check_in_categories);
  const loaded = useContentStore((st) => st.loaded);
  const hydrate = useContentStore((st) => st.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

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

  const openCategory = (cat: (typeof categories)[number]) => {
    if (cat.screen === 'MoodCheckIn') {
      navigation.navigate('MoodCheckIn');
      return;
    }
    if (cat.screen === 'SymptomCheckIn' && cat.symptom_category) {
      navigation.navigate('SymptomCheckIn', {
        symptomCategory: cat.symptom_category,
        title: cat.title,
        showExtras: cat.show_extras,
      });
      return;
    }
    if (cat.screen === 'WarningSigns' || cat.id === 'warning_signs') {
      navigation.navigate('SymptomCheckIn', {
        symptomCategory: 'warning_signs',
        title: cat.title,
      });
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.headerSpace}>
        <Text style={styles.title}>Today's Check-In</Text>
        <Text style={styles.subtitle}>How are you feeling today?</Text>
      </View>
      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {!loaded ? (
          <ActivityIndicator color={colors.coral} style={{ marginTop: 24 }} />
        ) : (
          categories.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={[styles.card, { backgroundColor: colorFromKey(c.color_key) }]}
              activeOpacity={0.8}
              onPress={() => openCategory(c)}
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
          ))
        )}

        <View style={{ marginTop: s(12), padding: s(12), backgroundColor: colors.surface, borderRadius: 12 }}>
          <Text style={{ color: colors.textSecondary }}>
            Your data is safe with us. Your information is private and used only to personalize your care.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
