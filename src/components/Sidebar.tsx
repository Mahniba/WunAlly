import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSidebar } from '../context/SidebarContext';
import { colors, typography } from '../theme';

const SIDEBAR_WIDTH = 260;

type MenuItem = { label: string; screen: string };

const MENU_ITEMS: MenuItem[] = [
  { label: 'Profile', screen: 'Profile' },
  { label: 'Care Plan Notes', screen: 'CarePlanNotes' },
  { label: 'Privacy', screen: 'Privacy' },
];

export function Sidebar() {
  const { isOpen, closeSidebar } = useSidebar();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const handleItem = (screen: string) => {
    closeSidebar();
    const nav = navigation as { navigate: (name: string, params?: object) => void };
    if (screen === 'Profile') {
      nav.navigate('Main', { screen: 'Profile' });
    } else {
      nav.navigate(screen);
    }
  };

  return (
    <Modal visible={isOpen} transparent animationType="slide">
      <Pressable style={styles.overlay} onPress={closeSidebar}>
        <Pressable
          style={[styles.panel, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Menu</Text>
            <TouchableOpacity onPress={closeSidebar} style={styles.closeBtn} accessibilityLabel="Close menu">
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.menu}>
            {MENU_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.screen}
                style={styles.menuItem}
                onPress={() => handleItem(item.screen)}
                activeOpacity={0.7}
              >
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  panel: {
    width: SIDEBAR_WIDTH,
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.softPink,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  closeBtn: { padding: 8 },
  closeText: { fontSize: 20, color: colors.textSecondary },
  menu: { padding: 16 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  menuLabel: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
  },
  menuArrow: { fontSize: 18, color: colors.textMuted },
});
