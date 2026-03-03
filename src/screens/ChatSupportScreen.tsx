import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer, Card, ScreenHeader } from '../components';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography } from '../theme';

const OPTIONS = [
  {
    key: 'ai',
    title: 'Chat with AI',
    desc: 'Get answers and tips anytime.',
    icon: '💬',
    screen: 'Chat' as const,
  },
  {
    key: 'nurse',
    title: 'Chat with Nurse',
    desc: 'Connect with your care team.',
    icon: '👩‍⚕️',
    screen: 'Chat' as const,
  },
  {
    key: 'voice',
    title: 'Talk to AI',
    desc: 'Voice support when you need it.',
    icon: '🎤',
    screen: 'Chat' as const,
  },
];

export function ChatSupportScreen() {
  const navigation = useNavigation();
  const { s, font, horizontalPadding } = useResponsive();

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
        {OPTIONS.map((opt) => (
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
              <Text style={styles.cardDesc}>{opt.desc}</Text>
            </View>
          </Card>
        ))}
      </View>
    </ScreenContainer>
  );
}
