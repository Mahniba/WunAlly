import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking, Share } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import { ScreenContainer, ScreenHeader } from '../components';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography } from '../theme';
import type { RootStackParamList } from '../navigation/types';
import { useContactsStore } from '../store/useContactsStore';

export function SOSScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [sent, setSent] = useState(false);
  const { s, font, horizontalPadding } = useResponsive();
  const contacts = useContactsStore((s2) => s2.contacts);
  const hydrateContacts = useContactsStore((s2) => s2.hydrate);

  React.useEffect(() => {
    hydrateContacts();
  }, [hydrateContacts]);

  const handleSend = () => {
    setSent(true);
    setTimeout(() => {
      try {
        if (navigation.canGoBack && navigation.canGoBack()) navigation.goBack();
        else navigation.navigate('Main');
      } catch {
        // ignore
      }
    }, 2000);
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
      marginBottom: s(48),
    },
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
      shadowColor: colors.sos,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
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
    },
  });

  return (
    <ScreenContainer>
      <ScreenHeader title="SOS Emergency" />
      <View style={styles.content}>
        <Text style={styles.title} allowFontScaling maxFontSizeMultiplier={1.3}>
          SOS Emergency
        </Text>
        {!sent ? (
          <>
            <TouchableOpacity
              style={styles.sosButton}
              onPress={handleSend}
              activeOpacity={0.9}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Send SOS alert"
            >
              <Text style={styles.sosButtonText}>SEND SOS{'\n'}ALERT</Text>
            </TouchableOpacity>
            <View style={styles.options}>
              <TouchableOpacity
                style={styles.optionCard}
                activeOpacity={0.8}
                onPress={async () => {
                  try {
                    const perm = await Location.requestForegroundPermissionsAsync();
                    if (perm.status !== 'granted') {
                      Alert.alert('Location permission needed', 'Please enable location permission to share your location.');
                      return;
                    }
                    const pos = await Location.getCurrentPositionAsync({
                      accuracy: Location.Accuracy.Balanced,
                    });
                    const { latitude, longitude } = pos.coords;
                    const mapsUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
                    await Share.share({
                      message: `My current location: ${mapsUrl}`,
                    });
                  } catch (e) {
                    Alert.alert('Could not get location', 'Please try again.');
                  }
                }}
                accessibilityRole="button"
                accessibilityLabel="Share my location"
              >
                <View style={styles.optionLeft}>
                  <Text style={styles.optionIcon}>📍</Text>
                  <Text style={styles.optionLabel}>Share Location</Text>
                </View>
                <Text style={styles.optionArrow}>›</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionCard}
                activeOpacity={0.8}
                onPress={async () => {
                  const first = contacts[0];
                  if (!first?.phone) {
                    Alert.alert(
                      'No emergency contact',
                      'Add an emergency contact first.',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Add Contact', onPress: () => navigation.navigate('EmergencyContacts') },
                      ],
                    );
                    return;
                  }
                  const tel = `tel:${first.phone}`;
                  const can = await Linking.canOpenURL(tel);
                  if (!can) {
                    Alert.alert('Cannot place call', 'Calling is not available on this device.');
                    return;
                  }
                  Linking.openURL(tel);
                }}
                accessibilityRole="button"
                accessibilityLabel="Call for help"
              >
                <View style={styles.optionLeft}>
                  <Text style={styles.optionIcon}>📞</Text>
                  <Text style={styles.optionLabel}>Call for Help</Text>
                </View>
                <Text style={styles.optionArrow}>›</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Text style={styles.feedback} allowFontScaling maxFontSizeMultiplier={1.3}>
            Alert sent. Help is on the way. Stay safe.
          </Text>
        )}
      </View>
    </ScreenContainer>
  );
}
