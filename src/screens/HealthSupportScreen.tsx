import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { TabScreenContainer, Card, AppIcon } from '../components';
import { useContentStore } from '../store/useContentStore';
import { getMyAssignment } from '../services/api/network';
import { localizedText } from '../utils/localizedContent';
import { useResponsive } from '../hooks/useResponsive';
import { iconForNetwork } from '../utils/iconMap';
import { colors, typography } from '../theme';
import type { RootStackParamList } from '../navigation/types';

export function HealthSupportScreen() {
  const { i18n } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const hub = useContentStore((s) => s.content.network_hub);
  const nurseCopy = useContentStore((s) => s.content.nurse_directory);
  const features = useContentStore((s) => s.content.network_hub_features);
  const hydrate = useContentStore((s) => s.hydrate);
  const [assignedName, setAssignedName] = useState<string | null>(null);
  const { s, font, horizontalPadding } = useResponsive();
  const lang = i18n.language;

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    getMyAssignment()
      .then((assignment) => setAssignedName(assignment?.provider?.name ?? null))
      .catch(() => setAssignedName(null));
  }, []);

  const styles = StyleSheet.create({
    scroll: { flex: 1 },
    content: { padding: horizontalPadding, paddingTop: s(16), paddingBottom: s(48) },
    title: {
      fontSize: font(typography.sizes.title),
      fontWeight: typography.weights.bold,
      color: colors.textPrimary,
      marginBottom: 8,
      letterSpacing: -0.5,
    },
    desc: {
      color: colors.textSecondary,
      fontSize: font(typography.sizes.base),
      marginBottom: s(24),
      lineHeight: 22,
    },
    card: {
      padding: s(16),
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: s(10),
    },
    iconBox: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: colors.backgroundSecondary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: s(14),
    },
    cardTitle: {
      fontSize: font(typography.sizes.base),
      fontWeight: typography.weights.semibold,
      color: colors.textPrimary,
    },
    cardDesc: {
      fontSize: font(typography.sizes.sm),
      color: colors.textSecondary,
      marginTop: 2,
      lineHeight: 18,
    },
    assignedHint: {
      fontSize: font(typography.sizes.xs),
      color: colors.coralDark,
      marginTop: 4,
      fontWeight: typography.weights.medium,
    },
  });

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
          { text: localizedText(nurseCopy, 'pick_nurse', lang), onPress: () => navigation.navigate('NurseDirectory') },
          { text: 'OK', style: 'cancel' },
        ]
      );
    } catch {
      navigation.navigate('NurseDirectory');
    }
  };

  const navigateFeature = async (f: (typeof features)[number]) => {
    if (f.key === 'nurse_chat') {
      await openNurseChat();
      return;
    }
    if (f.screen === 'Chat') {
      navigation.navigate('Chat', {
        mode: (f.params?.mode as 'ai' | 'nurse') ?? 'ai',
        voice: Boolean(f.params?.voice),
        providerId: f.params?.providerId as number | undefined,
      });
      return;
    }
    (navigation as { navigate: (name: string) => void }).navigate(f.screen);
  };

  return (
    <TabScreenContainer>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.title} allowFontScaling>
          {localizedText(hub, 'title', lang)}
        </Text>
        <Text style={styles.desc} allowFontScaling>
          {localizedText(hub, 'subtitle', lang)}
        </Text>

        {features.map((f) => (
          <Card
            key={f.key}
            variant="outlined"
            style={styles.card}
            onPress={() => navigateFeature(f)}
          >
            <View style={styles.iconBox}>
              <AppIcon
                name={iconForNetwork(f.key)}
                size={20}
                color={colors.coralDark}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{localizedText(f, 'title', lang)}</Text>
              <Text style={styles.cardDesc}>{localizedText(f, 'description', lang)}</Text>
              {f.key === 'nurse_chat' && assignedName ? (
                <Text style={styles.assignedHint}>{assignedName}</Text>
              ) : null}
            </View>
            <AppIcon name="chevron-right" size={18} color={colors.textMuted} />
          </Card>
        ))}
      </ScrollView>
    </TabScreenContainer>
  );
}
