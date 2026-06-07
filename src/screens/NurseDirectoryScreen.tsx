import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import {
  ScreenContainer,
  ScreenHeader,
  PrimaryButton,
  SecondaryButton,
  Card,
  AppIcon,
  NurseOrbitRadar,
} from '../components';
import { listProviders, assignProvider, type HealthProvider } from '../services/api/network';
import { useContentStore } from '../store/useContentStore';
import { localizedText, localizedCount } from '../utils/localizedContent';
import {
  formatLanguageList,
  formatProviderRole,
  providerInitials,
} from '../utils/networkFormat';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography } from '../theme';
import type { RootStackParamList } from '../navigation/types';

export function NurseDirectoryScreen() {
  const { i18n } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { width: windowWidth } = useWindowDimensions();
  const copy = useContentStore((s) => s.content.nurse_directory);
  const hydrateContent = useContentStore((s) => s.hydrate);
  const [scanning, setScanning] = useState(true);
  const [providers, setProviders] = useState<HealthProvider[]>([]);
  const [revealedCount, setRevealedCount] = useState(0);
  const [selected, setSelected] = useState<HealthProvider | null>(null);
  const [assigning, setAssigning] = useState(false);
  const { s, font, horizontalPadding } = useResponsive();

  // Make the entire orbit/radar larger on screen.
  // Keep it responsive: fill available width, with a bigger max cap.
  const radarSize = Math.min(windowWidth - horizontalPadding * 2, 380);
  const lang = i18n.language;

  const txt = (field: string) => localizedText(copy, field, lang);

  useEffect(() => {
    hydrateContent();
  }, [hydrateContent]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setScanning(true);
      setRevealedCount(0);
      setSelected(null);
      await new Promise((r) => setTimeout(r, 1400));

      try {
        const online = await listProviders(true);
        const all = online.length > 0 ? online : await listProviders(false);
        if (!cancelled) {
          const list = all.filter((p) => p.is_online || online.length === 0);
          setProviders(list);
        }
      } catch {
        if (!cancelled) setProviders([]);
      } finally {
        if (!cancelled) setScanning(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (scanning || providers.length === 0) {
      setRevealedCount(0);
      return;
    }

    setRevealedCount(0);
    let count = 0;
    const interval = setInterval(() => {
      count += 1;
      setRevealedCount(count);
      if (count >= providers.length) {
        clearInterval(interval);
        setSelected(providers[0]);
      }
    }, 260);

    return () => clearInterval(interval);
  }, [scanning, providers]);

  const rescan = () => {
    setScanning(true);
    setProviders([]);
    setRevealedCount(0);
    setSelected(null);

    (async () => {
      await new Promise((r) => setTimeout(r, 1400));
      try {
        const online = await listProviders(true);
        const all = online.length > 0 ? online : await listProviders(false);
        const list = all.filter((p) => p.is_online || online.length === 0);
        setProviders(list);
      } catch {
        setProviders([]);
      } finally {
        setScanning(false);
      }
    })();
  };

  const pick = async (provider: HealthProvider) => {
    setAssigning(true);
    try {
      await assignProvider(provider.id);
      navigation.navigate('Chat', {
        mode: 'nurse',
        providerId: provider.id,
        providerName: provider.name,
      });
    } catch {
      navigation.navigate('Chat', {
        mode: 'nurse',
        providerId: provider.id,
        providerName: provider.name,
      });
    } finally {
      setAssigning(false);
    }
  };

  const onlineCount = providers.filter((p) => p.is_online).length;
  const overflow = providers.slice(9);

  const styles = StyleSheet.create({
    scroll: { flex: 1 },
    content: {
      paddingHorizontal: horizontalPadding,
      paddingBottom: s(32),
    },
    intro: {
      marginTop: s(8),
      marginBottom: s(16),
    },
    title: {
      fontSize: font(typography.sizes.lg),
      fontWeight: typography.weights.semibold,
      color: colors.textPrimary,
      letterSpacing: -0.2,
    },
    subtitle: {
      fontSize: font(typography.sizes.sm),
      color: colors.textSecondary,
      marginTop: 4,
      lineHeight: 20,
    },
    statusPill: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
      marginTop: s(12),
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      backgroundColor: colors.backgroundSecondary,
      gap: 6,
    },
    statusText: {
      fontSize: font(typography.sizes.sm),
      color: colors.textSecondary,
      fontWeight: typography.weights.medium,
    },
    detailCard: {
      marginTop: s(20),
      padding: s(16),
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: s(12),
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.softPink,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: s(12),
    },
    avatarText: {
      fontSize: font(typography.sizes.base),
      fontWeight: typography.weights.bold,
      color: colors.coralDark,
    },
    name: {
      fontSize: font(typography.sizes.lg),
      fontWeight: typography.weights.semibold,
      color: colors.textPrimary,
    },
    meta: { color: colors.textSecondary, marginTop: 2, fontSize: font(typography.sizes.sm) },
    bio: {
      color: colors.textSecondary,
      fontSize: font(typography.sizes.sm),
      lineHeight: 20,
      marginTop: s(10),
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: s(6),
    },
    infoText: { color: colors.textSecondary, fontSize: font(typography.sizes.sm) },
    statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 6 },
    dot: { width: 8, height: 8, borderRadius: 4 },
    online: { backgroundColor: colors.success },
    offline: { backgroundColor: colors.textMuted },
    emptyWrap: {
      alignItems: 'center',
      marginTop: s(20),
      padding: s(20),
    },
    emptyTitle: {
      fontSize: font(typography.sizes.base),
      fontWeight: typography.weights.semibold,
      color: colors.textPrimary,
      marginTop: s(12),
      textAlign: 'center',
    },
    emptyBody: {
      fontSize: font(typography.sizes.sm),
      color: colors.textSecondary,
      marginTop: s(8),
      textAlign: 'center',
      lineHeight: 20,
    },
    overflowSection: { marginTop: s(16) },
    overflowTitle: {
      fontSize: font(typography.sizes.sm),
      fontWeight: typography.weights.semibold,
      color: colors.textSecondary,
      marginBottom: s(8),
      textTransform: 'uppercase',
      letterSpacing: 0.6,
    },
    overflowRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: s(10),
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.borderLight,
    },
    actions: { gap: s(10), marginTop: s(4) },
  });

  const statusMessage = scanning
    ? txt('scanning')
    : onlineCount > 0
    ? localizedCount(copy, 'found_online', onlineCount, lang)
    : txt('status_offline');

  return (
    <ScreenContainer>
      <ScreenHeader title={txt('title')} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.intro}>
          <Text style={styles.title}>{txt('title')}</Text>
          <Text style={styles.subtitle}>{txt('subtitle')}</Text>
        </View>

        <NurseOrbitRadar
          size={radarSize}
          scanning={scanning}
          providers={providers}
          revealedCount={revealedCount}
          selectedId={selected?.id ?? null}
          hubScanningLabel={txt('hub_scanning')}
          hubYouLabel={txt('hub_you')}
          onlineLabel={txt('online')}
          offlineLabel={txt('offline')}
          onSelect={setSelected}
        />

        <View style={styles.statusPill}>
          <AppIcon
            name={scanning ? 'radio' : onlineCount > 0 ? 'wifi' : 'wifi-off'}
            size={14}
            color={scanning ? colors.coralDark : onlineCount > 0 ? colors.success : colors.textMuted}
          />
          <Text style={styles.statusText}>{statusMessage}</Text>
        </View>

        {!scanning && providers.length === 0 ? (
          <View style={styles.emptyWrap}>
            <AppIcon name="users" size={32} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>{txt('empty_title')}</Text>
            <Text style={styles.emptyBody}>{txt('empty_body')}</Text>
            <SecondaryButton
              title={txt('scan_again')}
              onPress={rescan}
              style={{ marginTop: s(16) }}
            />
          </View>
        ) : null}

        {!scanning && selected ? (
          <Card variant="outlined" style={styles.detailCard}>
            <View style={styles.detailRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{providerInitials(selected)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{selected.name}</Text>
                <Text style={styles.meta}>
                  {formatProviderRole(selected.role, lang)} · {selected.facility}
                </Text>
                <View style={styles.statusRow}>
                  <View style={[styles.dot, selected.is_online ? styles.online : styles.offline]} />
                  <Text style={styles.meta}>
                    {selected.is_online ? txt('online') : txt('offline')}
                  </Text>
                </View>
              </View>
            </View>
            {selected.bio ? <Text style={styles.bio}>{selected.bio}</Text> : null}
            {selected.languages?.length ? (
              <View style={styles.infoRow}>
                <AppIcon name="globe" size={14} color={colors.textMuted} />
                <Text style={styles.infoText}>
                  {txt('languages')}: {formatLanguageList(selected.languages, lang)}
                </Text>
              </View>
            ) : null}
            {selected.phone ? (
              <View style={styles.infoRow}>
                <AppIcon name="phone" size={14} color={colors.textMuted} />
                <Text style={styles.infoText}>{selected.phone}</Text>
              </View>
            ) : null}
            <View style={styles.actions}>
              <PrimaryButton
                title={txt('pick_nurse')}
                onPress={() => pick(selected)}
                disabled={assigning}
                loading={assigning}
              />
              {providers.length > 1 ? (
                <SecondaryButton title={txt('scan_again')} onPress={rescan} />
              ) : null}
            </View>
          </Card>
        ) : null}

        {!scanning && overflow.length > 0 ? (
          <View style={styles.overflowSection}>
            <Text style={styles.overflowTitle}>{txt('more_nurses')}</Text>
            {overflow.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.overflowRow}
                onPress={() => setSelected(item)}
                activeOpacity={0.7}
              >
                <Text style={[styles.name, { flex: 1, fontSize: font(typography.sizes.base) }]}>
                  {item.name}
                </Text>
                <AppIcon name="chevron-right" size={16} color={colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </ScreenContainer>
  );
}
