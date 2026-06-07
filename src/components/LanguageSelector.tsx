import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { setAppLanguage, currentLanguage } from '../i18n';
import { colors, typography, spacing } from '../theme';

type LangCode = 'en' | 'fr';

interface LanguageSelectorProps {
  /** Compact row for sidebar; default card style for the language screen. */
  variant?: 'card' | 'compact';
  onLanguageChange?: (code: LangCode) => void;
}

export function LanguageSelector({ variant = 'card', onLanguageChange }: LanguageSelectorProps) {
  const { t } = useTranslation();
  const active = currentLanguage() as LangCode;

  const select = async (code: LangCode) => {
    await setAppLanguage(code);
    onLanguageChange?.(code);
  };

  if (variant === 'compact') {
    return (
      <View style={styles.compactWrap}>
        <Text style={styles.compactLabel}>{t('settings.language')}</Text>
        <View style={styles.compactRow}>
          {(['en', 'fr'] as const).map((code) => (
            <TouchableOpacity
              key={code}
              style={[styles.compactBtn, active === code && styles.compactBtnActive]}
              onPress={() => select(code)}
              accessibilityRole="button"
              accessibilityState={{ selected: active === code }}
            >
              <Text style={[styles.compactBtnText, active === code && styles.compactBtnTextActive]}>
                {code === 'en' ? t('settings.english') : t('settings.french')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.cardWrap}>
      {(['en', 'fr'] as const).map((code) => (
        <TouchableOpacity
          key={code}
          style={[styles.cardBtn, active === code && styles.cardBtnActive]}
          onPress={() => select(code)}
          accessibilityRole="button"
          accessibilityState={{ selected: active === code }}
        >
          <Text style={[styles.cardBtnText, active === code && styles.cardBtnTextActive]}>
            {code === 'en' ? t('settings.english') : t('settings.french')}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrap: { flexDirection: 'row', gap: spacing.sm, width: '100%' },
  cardBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  cardBtnActive: {
    borderColor: colors.coralDark,
    backgroundColor: colors.softPink,
  },
  cardBtnText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
  },
  cardBtnTextActive: {
    color: colors.coralDark,
    fontWeight: typography.weights.semibold,
  },
  compactWrap: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    marginTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderLight,
  },
  compactLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  compactRow: { flexDirection: 'row', gap: spacing.xs },
  compactBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: 10,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
  },
  compactBtnActive: {
    backgroundColor: colors.softPink,
    borderWidth: 1,
    borderColor: colors.coralDark,
  },
  compactBtnText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
  },
  compactBtnTextActive: {
    color: colors.coralDark,
    fontWeight: typography.weights.semibold,
  },
});
