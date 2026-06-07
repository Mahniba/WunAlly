import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { TabScreenContainer, Card, AppIcon } from '../components';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography, spacing } from '../theme';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useContentStore } from '../store/useContentStore';
import { colorFromKey } from '../utils/contentColors';
import { iconForCheckIn } from '../utils/iconMap';
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
    headerSpace: {
      paddingHorizontal: horizontalPadding,
      paddingTop: s(16),
      paddingBottom: s(8),
    },
    title: {
      fontSize: font(typography.sizes.title),
      fontWeight: typography.weights.bold,
      color: colors.textPrimary,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: font(typography.sizes.base),
      color: colors.textSecondary,
      marginTop: s(6),
      lineHeight: 22,
    },
    grid: {
      paddingHorizontal: horizontalPadding,
      paddingBottom: s(48),
      gap: s(10),
    },
    card: {
      padding: s(14),
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconBox: {
      width: 48,
      height: 48,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: s(14),
    },
    cardText: { flex: 1 },
    cardTitle: {
      color: colors.textPrimary,
      fontWeight: typography.weights.semibold,
      fontSize: font(typography.sizes.base),
    },
    cardSubtitle: {
      color: colors.textSecondary,
      fontSize: font(typography.sizes.sm),
      marginTop: 3,
      lineHeight: 18,
    },
    privacyNote: {
      marginTop: s(8),
      padding: s(14),
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 12,
    },
    privacyText: {
      fontSize: font(typography.sizes.sm),
      color: colors.textSecondary,
      lineHeight: 20,
    },
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
    <TabScreenContainer>
      <View style={styles.headerSpace}>
        <Text style={styles.title}>Today's check-in</Text>
        <Text style={styles.subtitle}>How are you feeling today?</Text>
      </View>

      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {!loaded ? (
          <ActivityIndicator color={colors.coralDark} style={{ marginTop: 24 }} />
        ) : (
          categories.map((c) => {
            const tint = colorFromKey(c.color_key);
            const isWarning = c.id === 'warning_signs';

            return (
              <Card
                key={c.id}
                variant="outlined"
                style={styles.card}
                onPress={() => openCategory(c)}
              >
                <View
                  style={[
                    styles.iconBox,
                    {
                      backgroundColor: isWarning ? '#FFF5E8' : tint,
                    },
                  ]}
                >
                  <AppIcon
                    name={iconForCheckIn(c.id)}
                    size={22}
                    color={isWarning ? colors.warning : colors.coralDark}
                  />
                </View>
                <View style={styles.cardText}>
                  <Text style={styles.cardTitle}>{c.title}</Text>
                  <Text style={styles.cardSubtitle}>{c.subtitle}</Text>
                </View>
                <AppIcon name="chevron-right" size={18} color={colors.textMuted} />
              </Card>
            );
          })
        )}

        <View style={styles.privacyNote}>
          <Text style={styles.privacyText}>
            Your data is private and used only to personalize your care.
          </Text>
        </View>
      </ScrollView>
    </TabScreenContainer>
  );
}
