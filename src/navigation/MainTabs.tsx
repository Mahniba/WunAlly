import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppIcon, type FeatherIconName } from '../components/AppIcon';
import { colors, typography, shadows } from '../theme';
import { DashboardScreen } from '../screens/DashboardScreen';
import { RemindersScreen } from '../screens/RemindersScreen';
import { CheckInHomeScreen } from '../screens/CheckInHomeScreen';
import { HealthSupportScreen } from '../screens/HealthSupportScreen';
import { CheckInTabButton } from '../components';
import { ProfileScreen } from '../screens/ProfileScreen';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

function TabIconLabel({
  label,
  focused,
  icon,
}: {
  label: string;
  focused: boolean;
  icon: FeatherIconName;
}) {
  const tint = focused ? colors.coralDark : colors.textMuted;

  return (
    <View style={styles.tabContent}>
      <AppIcon name={icon} size={22} color={tint} />
      <Text style={[styles.label, focused && styles.labelFocused]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

export function MainTabs() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const tabBarHeight = 56 + insets.bottom;

  return (
    <Tab.Navigator
      safeAreaInsets={{ bottom: 0 }}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        sceneContainerStyle: styles.scene,
        tabBarStyle: [
          styles.tabBar,
          shadows.tabBar,
          {
            height: tabBarHeight,
            paddingBottom: insets.bottom,
            paddingTop: 6,
          },
        ],
        tabBarItemStyle: styles.tabItemStyle,
        tabBarActiveTintColor: colors.coralDark,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIconLabel label={t('tabs.home')} focused={focused} icon="home" />
          ),
        }}
      />
      <Tab.Screen
        name="Reminders"
        component={RemindersScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIconLabel label={t('tabs.alerts')} focused={focused} icon="bell" />
          ),
        }}
      />
      <Tab.Screen
        name="CheckIn"
        component={CheckInHomeScreen}
        options={{
          tabBarButton: (props) => <CheckInTabButton {...props} />,
        }}
      />
      <Tab.Screen
        name="Network"
        component={HealthSupportScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIconLabel label={t('tabs.network')} focused={focused} icon="users" />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIconLabel label={t('tabs.profile')} focused={focused} icon="user" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  scene: {
    backgroundColor: colors.background,
  },
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderLight,
  },
  tabItemStyle: {
    paddingVertical: 2,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  label: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: typography.weights.medium,
  },
  labelFocused: {
    color: colors.coralDark,
    fontWeight: typography.weights.semibold,
  },
});
