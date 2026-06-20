import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer, Card, ScreenHeader } from '../components';
import { useContentStore } from '../store/useContentStore';
import { getMyAssignment } from '../services/api/network';
import { localizedText } from '../utils/localizedContent';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography } from '../theme';
import { useTranslation } from 'react-i18next';
import type { RootStackParamList } from '../navigation/types';

export function ChatSupportScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { i18n } = useTranslation();
  const options = useContentStore((s) => s.content.chat_support_options);
  const nurseCopy = useContentStore((s) => s.content.nurse_directory);
  const loaded = useContentStore((s) => s.loaded);
  const hydrate = useContentStore((s) => s.hydrate);
  const { s, font, horizontalPadding } = useResponsive();
  const lang = i18n.language;

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const openNurseChat = async () => {
    try {
      const assignment = await getMyAssignment();
      if (assignment?.provider) {
        navigation.navigate('Chat', {
          mode: 'nurse',
          providerId: assignment.provider.id,
          providerName: assignment.provider.name,
        });
        return;
      }
      Alert.alert(
        localizedText(nurseCopy, 'title', lang),
        localizedText(nurseCopy, 'no_assignment', lang),
        [
          {
            text: localizedText(nurseCopy, 'pick_nurse', lang),
            onPress: () => navigation.navigate('NurseDirectory'),
          },
          { text: 'OK', style: 'cancel' },
        ],
      );
    } catch {
      navigation.navigate('NurseDirectory');
    }
  };

  const openOption = async (key: string) => {
    if (key === 'nurse') {
      await openNurseChat();
      return;
    }
    if (key === 'voice') {
      navigation.navigate('Chat', { mode: 'ai', voice: true });
      return;
    }
    navigation.navigate('Chat', { mode: 'ai' });
  };

  const styles = StyleSheet.create({
    content: { padding: horizontalPadding, paddingTop: s(8), gap: s(14) },
    card: {
      padding: s(20),
      flexDirection: 'row',
      alignItems: 'center',
    },
    cardIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.softPink,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: s(16),
    },
    cardIconText: { fontSize: 24 },
    cardText: { flex: 1 },
    cardTitle: {
      fontSize: font(typography.sizes.lg),
      fontWeight: typography.weights.semibold,
      color: colors.textPrimary,
    },
    cardDesc: { fontSize: font(typography.sizes.sm), color: colors.textSecondary, marginTop: 2 },
  });

  return (
    <ScreenContainer>
      <ScreenHeader title="Chat & Support" />
      <View style={styles.content}>
        {!loaded ? (
          <ActivityIndicator color={colors.coral} />
        ) : (
          options.map((opt) => (
            <Card key={opt.key} style={styles.card} onPress={() => openOption(opt.key)}>
              <View style={styles.cardIcon}>
                <Text style={styles.cardIconText}>{opt.icon}</Text>
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{opt.title}</Text>
                <Text style={styles.cardDesc}>{opt.description}</Text>
              </View>
            </Card>
          ))
        )}
      </View>
    </ScreenContainer>
  );
}
