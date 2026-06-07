import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  TabScreenContainer,
  Card,
  SecondaryButton,
  SymptomsSettings,
  SymptomsChart,
  LanguageSelector,
} from '../components';
import { useProfileStore } from '../store';
import { useContentStore } from '../store/useContentStore';
import { WeekProgress } from '../components';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography } from '../theme';
import { useSymptomsStore } from '../store/useSymptomsStore';
import { useTranslation } from 'react-i18next';

export function ProfileScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const profile = useProfileStore((s) => s.profile);
  const hydrateProfile = useProfileStore((s) => s.hydrate);
  const hydrateSymptoms = useSymptomsStore((s) => s.hydrate);
  const hydrateContent = useContentStore((s) => s.hydrate);
  const { s, font, horizontalPadding } = useResponsive();
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    hydrateProfile();
    hydrateSymptoms();
    hydrateContent();
  }, [hydrateProfile, hydrateSymptoms, hydrateContent]);

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
    smallBtn: { marginTop: s(10) },
    chartCard: { marginTop: 12 },
  });

  return (
    <TabScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title} allowFontScaling maxFontSizeMultiplier={1.3}>
          {t('profile.title')}
        </Text>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card>
          <Text style={styles.label} allowFontScaling maxFontSizeMultiplier={1.3}>{t('profile.name')}</Text>
          <Text style={styles.value} allowFontScaling maxFontSizeMultiplier={1.3}>{profile?.name || '—'}</Text>
          <Text style={styles.label} allowFontScaling maxFontSizeMultiplier={1.3}>{t('profile.weeksPregnant')}</Text>
          <Text style={styles.value} allowFontScaling maxFontSizeMultiplier={1.3}>{profile?.weeksPregnant ?? '—'}</Text>
          <Text style={styles.label} allowFontScaling maxFontSizeMultiplier={1.3}>{t('profile.dueDate')}</Text>
          <Text style={styles.value} allowFontScaling maxFontSizeMultiplier={1.3}>{profile?.dueDate || '—'}</Text>
        </Card>

        {/* Show live WeekProgress if weeks or due date present */}
        {((profile?.weeksPregnant && profile.weeksPregnant > 0) || profile?.dueDateSet) ? (
          (() => {
            const weekNum = profile?.weeksPregnant && profile.weeksPregnant > 0
              ? Math.max(1, Math.min(42, profile.weeksPregnant))
              : profile?.dueDate
              ? ((): number => {
                  try {
                    const d = new Date(profile.dueDate);
                    // reuse the same inference used in profile create
                    const today = new Date();
                    const diffMs = d.getTime() - today.getTime();
                    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
                    const weeksLeft = Math.ceil(daysLeft / 7);
                    const estimatedWeek = 40 - weeksLeft;
                    return Math.max(1, Math.min(42, estimatedWeek));
                  } catch {
                    return 1;
                  }
                })()
              : 1;

            return (
              <View style={{ marginTop: 16 }}>
                <WeekProgress week={weekNum} />
              </View>
            );
          })()
        ) : null}
        {profile?.healthConditions ? (
          <Card style={{ marginTop: s(12) }}>
            <Text style={styles.label}>{t('profile.healthNotes')}</Text>
            <Text style={styles.value}>{profile.healthConditions}</Text>
          </Card>
        ) : null}
        <SecondaryButton
          title={t('profile.carePlan')}
          onPress={() => navigation.navigate('CarePlanNotes')}
          style={styles.btn}
        />
        <View style={{ marginTop: s(12) }}>
          <LanguageSelector />
        </View>
        <SecondaryButton
          title={t('profile.symptomSettings')}
          onPress={() => setShowSettings(true)}
          style={styles.smallBtn}
        />
        <Card style={styles.chartCard}>
          <SymptomsChart days={14} />
        </Card>
        <SecondaryButton
          title={t('profile.chatSupport')}
          onPress={() => navigation.navigate('ChatSupport')}
          style={styles.btn}
        />
        <SecondaryButton
          title={t('profile.studyConsent')}
          onPress={() => navigation.navigate('StudyConsent')}
          style={styles.smallBtn}
        />
        <SecondaryButton
          title={t('profile.sus')}
          onPress={() => navigation.navigate('SUSQuestionnaire')}
          style={styles.smallBtn}
        />
        <SecondaryButton
          title={t('profile.privacy')}
          onPress={() => navigation.navigate('Privacy')}
          style={styles.btn}
        />
      </ScrollView>
      <SymptomsSettings visible={showSettings} onClose={() => setShowSettings(false)} />
    </TabScreenContainer>
  );
}
