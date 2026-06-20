import React from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useResponsive } from '../../hooks/useResponsive';
import { colors, typography } from '../../theme';
import type { RootStackParamList } from '../../navigation/types';

export type CheckInTabId =
  | 'mood'
  | 'general'
  | 'warning_signs'
  | 'baby_monitoring'
  | 'body_changes'
  | 'vaginal_health';

const TABS: {
  id: CheckInTabId;
  label: string;
  screen: 'MoodCheckIn' | 'SymptomCheckIn';
  title: string;
  symptomCategory?: string;
  showExtras?: boolean;
}[] = [
  { id: 'body_changes', label: 'Body Changes', screen: 'SymptomCheckIn', title: 'Body Changes', symptomCategory: 'body_changes' },
  { id: 'mood', label: 'Mood & Feelings', screen: 'MoodCheckIn', title: 'Mood & Feelings' },
  { id: 'general', label: 'General Symptoms', screen: 'SymptomCheckIn', title: 'General Symptoms', symptomCategory: 'general', showExtras: true },
  { id: 'warning_signs', label: 'Warning Signs', screen: 'SymptomCheckIn', title: 'Warning Signs', symptomCategory: 'warning_signs' },
  { id: 'baby_monitoring', label: 'Baby Monitoring', screen: 'SymptomCheckIn', title: 'Baby Monitoring', symptomCategory: 'baby_monitoring' },
  { id: 'vaginal_health', label: 'Vaginal Health', screen: 'SymptomCheckIn', title: 'Vaginal Health', symptomCategory: 'vaginal_health' },
];

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function CheckInCategoryTabs({ activeId }: { activeId: CheckInTabId }) {
  const navigation = useNavigation<Nav>();
  const { s, font, horizontalPadding } = useResponsive();

  const styles = StyleSheet.create({
    wrap: {
      paddingHorizontal: horizontalPadding,
      paddingTop: s(12),
      paddingBottom: s(4),
    },
    tab: {
      paddingHorizontal: s(12),
      paddingVertical: s(6),
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#E8D8D0',
      backgroundColor: '#FFFFFF',
      marginRight: s(6),
    },
    tabActive: {
      backgroundColor: colors.coralDark,
      borderColor: colors.coralDark,
    },
    tabLabel: {
      fontSize: font(11.5),
      fontWeight: typography.weights.medium,
      color: colors.textMuted,
    },
    tabLabelActive: {
      color: '#FFFFFF',
    },
  });

  const switchTab = (tab: (typeof TABS)[number]) => {
    if (tab.id === activeId) return;
    if (tab.screen === 'MoodCheckIn') {
      navigation.replace('MoodCheckIn');
      return;
    }
    navigation.replace('SymptomCheckIn', {
      symptomCategory: tab.symptomCategory!,
      title: tab.title,
      showExtras: tab.showExtras,
    });
  };

  return (
    <View style={styles.wrap}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {TABS.map((tab) => {
          const active = tab.id === activeId;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, active && styles.tabActive]}
              onPress={() => switchTab(tab)}
              activeOpacity={0.85}
            >
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

export { TABS as CHECK_IN_TABS };
