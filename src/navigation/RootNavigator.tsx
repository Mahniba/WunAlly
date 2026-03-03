import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useProfileStore, useOnboardingStore, useAuthStore } from '../store';
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
import { LoginScreen } from '../screens/LoginScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import { VerificationScreen } from '../screens/VerificationScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const [hydrated, setHydrated] = useState(false);
  const { done: onboardingDone, hydrate: hydrateOnboarding } = useOnboardingStore();
  const { profile, hydrate: hydrateProfile } = useProfileStore();
  const { isAuthenticated, hydrate: hydrateAuth } = useAuthStore();

  useEffect(() => {
    (async () => {
      await Promise.all([hydrateOnboarding(), hydrateProfile(), hydrateAuth()]);
      setHydrated(true);
    })();
  }, [hydrateOnboarding, hydrateProfile, hydrateAuth]);

  if (!hydrated) return null;

  // Determine initial route based on state:
  // 1) Onboarding (first-run) -> 2) Auth (login/signup) -> 3) ProfileCreate -> 4) Main
  const showOnboarding = onboardingDone !== true;
  const showAuth = !isAuthenticated && !showOnboarding;
  const showProfileCreate = isAuthenticated && !profile?.name && !showOnboarding;

  const initialRoute = showOnboarding
    ? 'Onboarding'
    : showAuth
    ? 'Login'
    : showProfileCreate
    ? 'ProfileCreate'
    : 'Main';

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FDF8F9' },
      }}
      initialRouteName={initialRoute}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ animationEnabled: false }} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="Verification" component={VerificationScreen} />
      <Stack.Screen name="ProfileCreate" component={ProfileCreateScreen} />
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="Tracking" component={TrackingScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="ChatSupport" component={ChatSupportScreen} />
      <Stack.Screen name="CarePlanNotes" component={CarePlanNotesScreen} />
      <Stack.Screen name="SOS" component={SOSScreen} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} />
    </Stack.Navigator>
  );
}
