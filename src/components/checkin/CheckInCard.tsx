import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AppIcon } from '../AppIcon';
import { CheckInIcon, iconBgFor } from './CheckInIcons';
import { useResponsive } from '../../hooks/useResponsive';
import { colors, typography, shadows } from '../../theme';

type Props = {
  iconKey: string;
  label: string;
  description: string;
  checked: boolean;
  onPress: () => void;
  isNone?: boolean;
};

export function CheckInCard({ iconKey, label, description, checked, onPress, isNone }: Props) {
  const { font } = useResponsive();
  const bg = isNone ? '#FCE4EF' : iconBgFor(iconKey);

  return (
    <TouchableOpacity
      style={[styles.card, checked && styles.cardChecked, isNone && styles.noneCard]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={[styles.iconWrap, { backgroundColor: bg }]}>
        <CheckInIcon iconKey={isNone ? 'none_today' : iconKey} size={isNone ? 24 : 28} />
      </View>
      <View style={styles.copy}>
        <Text style={[styles.label, { fontSize: font(typography.sizes.base) }]}>{label}</Text>
        {description ? (
          <Text style={[styles.desc, { fontSize: font(typography.sizes.sm) }]}>{description}</Text>
        ) : null}
      </View>
      <View style={[styles.checkbox, checked && styles.checkboxOn]}>
        {checked ? <AppIcon name="check" size={15} color="#FFFFFF" /> : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0E4DF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
    ...shadows.sm,
  },
  cardChecked: {
    borderColor: colors.coralDark,
    backgroundColor: '#FFF5F2',
  },
  noneCard: {
    backgroundColor: '#FDF0F5',
    borderColor: '#F5D8E5',
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  copy: { flex: 1, paddingRight: 10 },
  label: {
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    marginBottom: 3,
  },
  desc: {
    color: colors.textSecondary,
    lineHeight: 18,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#D8C4BC',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxOn: {
    backgroundColor: colors.coralDark,
    borderColor: colors.coralDark,
  },
});
