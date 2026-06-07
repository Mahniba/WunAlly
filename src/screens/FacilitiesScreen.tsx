import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Linking,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScreenContainer, ScreenHeader, Card, AppIcon } from '../components';
import { listFacilities, type HealthFacility } from '../services/api/network';
import { useContentStore } from '../store/useContentStore';
import { localizedText } from '../utils/localizedContent';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography } from '../theme';

export function FacilitiesScreen() {
  const { i18n } = useTranslation();
  const features = useContentStore((s) => s.content.network_hub_features);
  const facilitiesCopy = useContentStore((s) => s.content.facilities_directory);
  const hydrate = useContentStore((s) => s.hydrate);
  const [items, setItems] = useState<HealthFacility[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const { s, font, horizontalPadding } = useResponsive();
  const lang = i18n.language;

  const txt = (field: string) => localizedText(facilitiesCopy, field, lang);

  const facilitiesFeature = features.find((f) => f.key === 'facilities');
  const screenTitle = facilitiesFeature
    ? localizedText(facilitiesFeature, 'title', lang)
    : localizedText({ title_en: 'Nearby facilities', title_fr: 'Établissements proches' }, 'title', lang);

  const loadFacilities = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(false);
    try {
      const data = await listFacilities();
      setItems(data);
    } catch {
      setItems([]);
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    hydrate();
    loadFacilities();
  }, [hydrate, loadFacilities]);

  const styles = StyleSheet.create({
    content: { padding: horizontalPadding, flex: 1, paddingBottom: s(32) },
    subtitle: {
      color: colors.textSecondary,
      fontSize: font(typography.sizes.sm),
      lineHeight: 20,
      marginBottom: s(16),
    },
    card: { padding: s(16), marginBottom: s(10) },
    name: {
      fontWeight: typography.weights.semibold,
      fontSize: font(typography.sizes.lg),
      color: colors.textPrimary,
    },
    meta: { color: colors.textSecondary, marginTop: 4, fontSize: font(typography.sizes.sm), lineHeight: 18 },
    servicesLabel: {
      marginTop: s(8),
      fontSize: font(typography.sizes.xs),
      fontWeight: typography.weights.semibold,
      color: colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    phoneRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: s(10),
      gap: 6,
    },
    phoneText: {
      color: colors.coralDark,
      fontSize: font(typography.sizes.sm),
      fontWeight: typography.weights.medium,
    },
    emptyWrap: { alignItems: 'center', paddingVertical: s(40) },
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
      paddingHorizontal: s(16),
    },
  });

  return (
    <ScreenContainer>
      <ScreenHeader title={screenTitle} />
      <View style={styles.content}>
        <Text style={styles.subtitle}>{txt('subtitle')}</Text>

        {loading ? (
          <ActivityIndicator color={colors.coralDark} style={{ marginTop: 24 }} />
        ) : items.length === 0 ? (
          <View style={styles.emptyWrap}>
            <AppIcon name="map-pin" size={32} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>
              {error ? txt('empty_title') : txt('empty_title')}
            </Text>
            <Text style={styles.emptyBody}>
              {error ? txt('empty_body') : txt('empty_body')}
            </Text>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(i) => String(i.id)}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => loadFacilities(true)}
                tintColor={colors.coralDark}
              />
            }
            renderItem={({ item }) => (
              <Card variant="outlined" style={styles.card}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.meta}>
                  {item.city}, {item.region}
                </Text>
                {item.services ? (
                  <>
                    <Text style={styles.servicesLabel}>{txt('services')}</Text>
                    <Text style={styles.meta}>{item.services}</Text>
                  </>
                ) : null}
                {item.phone ? (
                  <TouchableOpacity
                    style={styles.phoneRow}
                    onPress={() => Linking.openURL(`tel:${item.phone.replace(/\s/g, '')}`)}
                    accessibilityRole="link"
                    accessibilityLabel={`${txt('call')} ${item.phone}`}
                  >
                    <AppIcon name="phone" size={14} color={colors.coralDark} />
                    <Text style={styles.phoneText}>{item.phone}</Text>
                  </TouchableOpacity>
                ) : null}
              </Card>
            )}
          />
        )}
      </View>
    </ScreenContainer>
  );
}
