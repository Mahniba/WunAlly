import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing } from '../theme';
import { MIN_TOUCH_TARGET } from '../constants';

interface ReminderItemProps {
  title: string;
  time: string;
  icon?: React.ReactNode;
  completed?: boolean;
  onPress?: () => void;
  onComplete?: () => void;
  onDelete?: () => void;
}

export function ReminderItem({
  title,
  time,
  icon,
  completed,
  onPress,
  onComplete,
  onDelete,
}: ReminderItemProps) {
  return (
    <TouchableOpacity
      style={[styles.container, completed && styles.completed]}
      onPress={onPress}
      activeOpacity={0.8}
      accessible
      accessibilityLabel={`${title}, ${time}`}
      accessibilityRole="button"
    >
      <View style={styles.iconWrap}>{icon}</View>
      <View style={styles.textWrap}>
        <Text style={[styles.title, completed && styles.titleCompleted]} allowFontScaling>
          {title}
        </Text>
        <Text style={styles.time} allowFontScaling>
          {time}
        </Text>
      </View>
      {onComplete ? (
        <TouchableOpacity
          style={[styles.check, completed && styles.checkDone]}
          onPress={onComplete}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessible
          accessibilityLabel={completed ? 'Mark not done' : 'Mark done'}
          accessibilityRole="button"
        >
          <Text style={styles.checkText}>{completed ? '✓' : ''}</Text>
        </TouchableOpacity>
      ) : completed ? (
        <View style={[styles.check, styles.checkDone]}>
          <Text style={styles.checkText}>✓</Text>
        </View>
      ) : null}
      {onDelete ? (
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={onDelete}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Delete reminder"
        >
          <Text style={styles.deleteBtnText}>✕</Text>
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    minHeight: MIN_TOUCH_TARGET,
  },
  completed: { opacity: 0.85 },
  iconWrap: { width: 40, height: 40, marginRight: spacing.sm, justifyContent: 'center', alignItems: 'center' },
  textWrap: { flex: 1 },
  title: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
  },
  titleCompleted: { textDecorationLine: 'line-through', color: colors.textMuted },
  time: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  check: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkDone: { backgroundColor: colors.success },
  checkText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  deleteBtn: { padding: 8, marginRight: 4 },
  deleteBtnText: { fontSize: 16, color: colors.textMuted },
});
