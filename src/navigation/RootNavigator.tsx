import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useProfileStore, useOnboardingStore } from '../store';
import { MainTabs } from './MainTabs';
import type { RootStackParamList } from './types';

import { OnboardingScreen } from '../screens/OnboardingScreen';
import { ProfileCreateScreen } from '../screens/ProfileCreateScreen';
import { TrackingScreen } from '../screens/TrackingScreen';
import { ChatScreen } from '../screens/ChatScreen';
import { ChatSupportScreen } from '../screens/ChatSupportScreen';
import { CarePlanNotesScreen } from '../screens/CarePlanNotesScreen';
import { SOSScreen } from '../screens/SOSScreen';
import { PrivacyScreen } from '../screens/PrivacyScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const [hydrated, setHydrated] = useState(false);
  const { done: onboardingDone, hydrate: hydrateOnboarding } = useOnboardingStore();
  const { profile, hydrate: hydrateProfile } = useProfileStore();

  useEffect(() => {
    (async () => {
      await Promise.all([hydrateOnboarding(), hydrateProfile()]);
      setHydrated(true);
    })();
  }, [hydrateOnboarding, hydrateProfile]);

  if (!hydrated) return null;

  const showOnboarding = onboardingDone !== true;
  const showProfileCreate = !showOnboarding && !profile?.name;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FDF8F9' },
      }}
    >
      {showOnboarding ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : showProfileCreate ? (
        <Stack.Screen name="ProfileCreate" component={ProfileCreateScreen} />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="Tracking" component={TrackingScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="ChatSupport" component={ChatSupportScreen} />
          <Stack.Screen name="CarePlanNotes" component={CarePlanNotesScreen} />
          <Stack.Screen name="SOS" component={SOSScreen} />
          <Stack.Screen name="Privacy" component={PrivacyScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
