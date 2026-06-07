import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppIcon } from './AppIcon';
import { LanguageSelector } from './LanguageSelector';
import { useSidebar } from '../context/SidebarContext';
import { useAuthStore } from '../store';
import { resetToLogin } from '../navigation/authNavigation';
import { iconForSidebar } from '../utils/iconMap';
import { colors, typography, spacing } from '../theme';

const SIDEBAR_WIDTH = 280;

type MenuItem = { labelKey: string; screen: string };

const MENU_ITEMS: MenuItem[] = [
  { labelKey: 'sidebar.profile', screen: 'Profile' },
  { labelKey: 'sidebar.emergencyContacts', screen: 'EmergencyContacts' },
  { labelKey: 'sidebar.privacy', screen: 'Privacy' },
  { labelKey: 'sidebar.logout', screen: 'Logout' },
];

export function Sidebar() {
  const { t } = useTranslation();
  const { isOpen, closeSidebar } = useSidebar();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { logout } = useAuthStore();

  const handleItem = async (screen: string) => {
    closeSidebar();
    const nav = navigation as { navigate: (name: string, params?: object) => void };
    if (screen === 'Profile') {
      nav.navigate('Main', { screen: 'Profile' });
    } else if (screen === 'Logout') {
      try {
        await logout();
      } catch (e) {
        console.error('Logout failed', e);
      }
      resetToLogin(navigation as never);
    } else {
      nav.navigate(screen);
    }
  };

  return (
    <Modal visible={isOpen} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={closeSidebar}>
        <Pressable
          style={[
            styles.panel,
            { paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing.md },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.brand}>WunAlly</Text>
              <Text style={styles.brandSub}>{t('sidebar.brandSub')}</Text>
            </View>
            <TouchableOpacity
              onPress={closeSidebar}
              style={styles.closeBtn}
              accessibilityLabel={t('sidebar.closeMenu')}
            >
              <AppIcon name="x" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.menu}>
            {MENU_ITEMS.map((item) => {
              const isLogout = item.screen === 'Logout';
              return (
                <TouchableOpacity
                  key={item.screen}
                  style={[styles.menuItem, isLogout && styles.menuItemLogout]}
                  onPress={() => handleItem(item.screen)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.menuIcon, isLogout && styles.menuIconLogout]}>
                    <AppIcon
                      name={iconForSidebar(item.screen)}
                      size={18}
                      color={isLogout ? colors.error : colors.coralDark}
                    />
                  </View>
                  <Text style={[styles.menuLabel, isLogout && styles.menuLabelLogout]}>
                    {t(item.labelKey)}
                  </Text>
                  <AppIcon name="chevron-right" size={16} color={colors.textMuted} />
                </TouchableOpacity>
              );
            })}
          </View>

          <LanguageSelector variant="compact" />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(26, 21, 32, 0.35)',
  },
  panel: {
    width: SIDEBAR_WIDTH,
    backgroundColor: colors.surface,
    shadowColor: '#1A1520',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderLight,
  },
  brand: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },
  brandSub: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
  closeBtn: {
    padding: spacing.xs,
    marginTop: -spacing.xs,
  },
  menu: { padding: spacing.sm, paddingTop: spacing.md },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.sm,
    borderRadius: 12,
    marginBottom: spacing.xxs,
  },
  menuItemLogout: {
    marginTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderLight,
    paddingTop: spacing.md,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  menuIconLogout: {
    backgroundColor: '#FDF0F0',
  },
  menuLabel: {
    flex: 1,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
  },
  menuLabelLogout: {
    color: colors.error,
  },
});
