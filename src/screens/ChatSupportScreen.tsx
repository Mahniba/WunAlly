import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer, Card, ScreenHeader } from '../components';
import { useContentStore } from '../store/useContentStore';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography } from '../theme';

export function ChatSupportScreen() {
  const navigation = useNavigation();
  const options = useContentStore((s) => s.content.chat_support_options);
  const loaded = useContentStore((s) => s.loaded);
  const hydrate = useContentStore((s) => s.hydrate);
  const { s, font, horizontalPadding } = useResponsive();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const styles = StyleSheet.create({
    content: { padding: horizontalPadding, paddingTop: s(8), gap: s(14) },
    card: {
      padding: s(20),
      flexDirection: 'row',
      alignItems: 'center',
    },
    cardIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.softPink, justifyContent: 'center', alignItems: 'center', marginRight: s(16) },
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
            <Card
              key={opt.key}
              style={styles.card}
              onPress={() => (navigation as { navigate: (n: string) => void }).navigate(opt.screen)}
            >
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
