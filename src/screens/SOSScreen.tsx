import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Share,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import { useTranslation } from 'react-i18next';
import { ScreenContainer, ScreenHeader } from '../components';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography } from '../theme';
import type { RootStackParamList } from '../navigation/types';
import { useContactsStore } from '../store/useContactsStore';
import { useContentStore } from '../store/useContentStore';
import { triggerSosAlert, callFirstContact, mapsLink, getCurrentCoords } from '../services/sosAlerts';
import { OFFLINE_EMERGENCY } from '../assets/offlineEmergency';
import { hasAccessToken } from '../services/api/session';

export function SOSScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);
  const [feedback, setFeedback] = useState('');
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { s, font, horizontalPadding } = useResponsive();
  const contacts = useContactsStore((s2) => s2.contacts);
  const hydrateContacts = useContactsStore((s2) => s2.hydrate);
  const emergencyGuide = useContentStore((st) => st.content.emergency_guide);
  const hydrateContent = useContentStore((st) => st.hydrate);

  React.useEffect(() => {
    hydrateContacts();
    hydrateContent();
  }, [hydrateContacts, hydrateContent]);

  const guide = emergencyGuide?.steps?.length ? emergencyGuide : OFFLINE_EMERGENCY;

  const runSos = async () => {
    if (contacts.length === 0) {
      Alert.alert(t('sos.noContact'), '', [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: 'Add Contact',
          onPress: () => navigation.navigate('EmergencyContacts'),
        },
      ]);
      return;
    }

    const offline = !(await hasAccessToken());

    const result = await triggerSosAlert(
      contacts.map((c) => ({ name: c.name, phone: c.phone })),
      guide,
      { fetchLocation: true, offline },
    );

    setSent(true);
    if (result.notified > 0) {
      setFeedback(t('sos.alertSent'));
    } else {
      setFeedback(t('sos.alertPartial'));
    }

    setTimeout(() => {
      try {
        if (navigation.canGoBack()) navigation.goBack();
        else navigation.navigate('Main');
      } catch {
        /* ignore */
      }
    }, 2500);
  };

  const onPressIn = () => {
    holdTimer.current = setTimeout(() => {
      void runSos();
    }, 2000);
  };

  const onPressOut = () => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  };

  const size = Math.min(s(240), 280);
  const styles = StyleSheet.create({
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: horizontalPadding,
    },
    title: {
      fontSize: font(typography.sizes.xxl),
      fontWeight: typography.weights.bold,
      color: colors.textPrimary,
      marginBottom: s(12),
    },
    hint: { color: colors.textSecondary, marginBottom: s(32), textAlign: 'center' },
    sosButton: {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: colors.sos,
      borderWidth: 4,
      borderColor: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: s(32),
      elevation: 8,
    },
    sosButtonText: {
      fontSize: font(18),
      fontWeight: typography.weights.bold,
      color: '#FFFFFF',
      textAlign: 'center',
    },
    options: { width: '100%', maxWidth: 320, gap: s(12) },
    optionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: s(16),
      borderWidth: 1,
      borderColor: colors.softPink,
    },
    optionLeft: { flexDirection: 'row', alignItems: 'center', gap: s(12) },
    optionIcon: { fontSize: 22 },
    optionLabel: {
      fontSize: font(typography.sizes.base),
      fontWeight: typography.weights.medium,
      color: colors.textPrimary,
    },
    optionArrow: { fontSize: 18, color: colors.textMuted },
    feedback: {
      fontSize: font(typography.sizes.lg),
      fontWeight: typography.weights.semibold,
      color: colors.success,
      textAlign: 'center',
      paddingHorizontal: s(16),
    },
  });

  return (
    <ScreenContainer>
      <ScreenHeader title={t('sos.title')} />
      <View style={styles.content}>
        <Text style={styles.title} allowFontScaling>
          {t('sos.title')}
        </Text>
        {!sent ? (
          <>
            <Text style={styles.hint}>{t('sos.holdHint')}</Text>
            <Pressable
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              style={styles.sosButton}
              accessibilityRole="button"
              accessibilityLabel={t('sos.sendAlert')}
            >
              <Text style={styles.sosButtonText}>{t('sos.sendAlert')}</Text>
            </Pressable>
            <View style={styles.options}>
              <TouchableOpacity
                style={styles.optionCard}
                onPress={async () => {
                  const coords = await getCurrentCoords();
                  if (!coords) {
                    Alert.alert('Location', 'Could not get location.');
                    return;
                  }
                  await Share.share({ message: mapsLink(coords.latitude, coords.longitude) });
                }}
              >
                <View style={styles.optionLeft}>
                  <Text style={styles.optionIcon}>📍</Text>
                  <Text style={styles.optionLabel}>{t('sos.shareLocation')}</Text>
                </View>
                <Text style={styles.optionArrow}>›</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionCard}
                onPress={async () => {
                  const ok = await callFirstContact(
                    contacts.map((c) => ({ name: c.name, phone: c.phone })),
                  );
                  if (!ok) Alert.alert(t('sos.noContact'));
                }}
              >
                <View style={styles.optionLeft}>
                  <Text style={styles.optionIcon}>📞</Text>
                  <Text style={styles.optionLabel}>{t('sos.callHelp')}</Text>
                </View>
                <Text style={styles.optionArrow}>›</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionCard}
                onPress={() => navigation.navigate('EmergencyGuide')}
              >
                <View style={styles.optionLeft}>
                  <Text style={styles.optionIcon}>📖</Text>
                  <Text style={styles.optionLabel}>{t('sos.emergencyGuide')}</Text>
                </View>
                <Text style={styles.optionArrow}>›</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Text style={styles.feedback}>{feedback}</Text>
        )}
      </View>
    </ScreenContainer>
  );
}
