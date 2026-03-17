import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography } from '../theme';
import { DashboardScreen } from '../screens/DashboardScreen';
import { RemindersScreen } from '../screens/RemindersScreen';
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
  icon: string;
}) {
  return (
    <View style={styles.tabContent}>
      <View style={[styles.iconCircle, focused && styles.iconCircleFocused]}>
        <Text style={[styles.iconText, focused && styles.iconTextFocused]}>{icon}</Text>
      </View>
      <Text style={[styles.label, focused && styles.labelFocused]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

export function MainTabs() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 56 + insets.bottom;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [
          styles.tabBar,
          {
            height: tabBarHeight,
            paddingBottom: insets.bottom,
            paddingTop: 10,
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
            // Using house + pregnant emoji to suggest "baby at home"
            <TabIconLabel label="Home" focused={focused} icon="🏠🤰" />
          ),
        }}
      />
      <Tab.Screen
        name="Reminders"
        component={RemindersScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIconLabel label="Reminders" focused={focused} icon="🔔" />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIconLabel label="Profile" focused={focused} icon="👤" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  tabItemStyle: {
    paddingVertical: 4,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 44,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  iconCircleFocused: {
    backgroundColor: colors.softPink,
  },
  iconText: {
    fontSize: 18,
    color: colors.textMuted,
  },
  iconTextFocused: {
    color: colors.coralDark,
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
