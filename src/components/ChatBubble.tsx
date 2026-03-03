import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  avatar?: React.ReactNode;
}

export function ChatBubble({ message, isUser, avatar }: ChatBubbleProps) {
  return (
    <View style={[styles.row, isUser ? styles.rowUser : styles.rowOther]}>
      {!isUser && avatar ? <View style={styles.avatar}>{avatar}</View> : null}
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleOther]}>
        <Text style={[styles.text, isUser && styles.textUser]} allowFontScaling>
          {message}
        </Text>
      </View>
      {isUser && avatar ? <View style={styles.avatar}>{avatar}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  rowUser: { flexDirection: 'row-reverse' },
  rowOther: {},
  bubble: {
    maxWidth: '80%',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
  },
  bubbleUser: {
    backgroundColor: colors.chipChat,
    borderBottomRightRadius: 4,
    maxWidth: '85%',
  },
  bubbleOther: {
    backgroundColor: colors.softPurple,
    borderBottomLeftRadius: 4,
    maxWidth: '85%',
  },
  text: {
    fontSize: typography.sizes.base,
    color: colors.textPrimary,
  },
  textUser: {},
  avatar: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
});
