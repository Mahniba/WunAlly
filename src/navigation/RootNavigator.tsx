import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useProfileStore, useOnboardingStore, useAuthStore } from '../store';
import { useLanguageStore } from '../store/useLanguageStore';
import { MainTabs } from './MainTabs';
import type { RootStackParamList } from './types';

import { LanguageScreen } from '../screens/LanguageScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { ProfileCreateScreen } from '../screens/ProfileCreateScreen';
import { TrackingScreen } from '../screens/TrackingScreen';
import { ChatScreen } from '../screens/ChatScreen';
import { ChatSupportScreen } from '../screens/ChatSupportScreen';
import { CarePlanNotesScreen } from '../screens/CarePlanNotesScreen';
import { SOSScreen } from '../screens/SOSScreen';
import { WarningSignsScreen } from '../screens/WarningSignsScreen';
import { SymptomCheckInScreen } from '../screens/SymptomCheckInScreen';
import { MoodCheckInScreen } from '../screens/MoodCheckInScreen';
import { useContentStore } from '../store/useContentStore';
import { PrivacyScreen } from '../screens/PrivacyScreen';
import { NurseDirectoryScreen } from '../screens/NurseDirectoryScreen';
import { FacilitiesScreen } from '../screens/FacilitiesScreen';
import { EmergencyGuideScreen } from '../screens/EmergencyGuideScreen';
import { StudyConsentScreen } from '../screens/StudyConsentScreen';
import { SUSQuestionnaireScreen } from '../screens/SUSQuestionnaireScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import { VerificationScreen } from '../screens/VerificationScreen';
import { EmergencyContactsScreen } from '../screens/EmergencyContactsScreen';
import { colors } from '../theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const [hydrated, setHydrated] = useState(false);
  const { chosen: languageChosen, hydrate: hydrateLanguage } = useLanguageStore();
  const { done: onboardingDone, hydrate: hydrateOnboarding } = useOnboardingStore();
  const { profile, hydrate: hydrateProfile } = useProfileStore();
  const { isAuthenticated, hydrate: hydrateAuth } = useAuthStore();
  const hydrateContent = useContentStore((s) => s.hydrate);

  useEffect(() => {
    (async () => {
      await hydrateLanguage();
      await hydrateOnboarding();
      await hydrateContent();
      await hydrateAuth();
      await hydrateProfile();
      setHydrated(true);
    })();
  }, [hydrateLanguage, hydrateOnboarding, hydrateProfile, hydrateAuth, hydrateContent]);

  if (!hydrated) return null;

  // 1) Language -> 2) Onboarding -> 3) Auth -> 4) ProfileCreate -> 5) Main
  const showLanguage = languageChosen !== true;
  const showOnboarding = !showLanguage && onboardingDone !== true;
  const showAuth = !showLanguage && !isAuthenticated && !showOnboarding;
  const showProfileCreate = !showLanguage && isAuthenticated && !profile?.name && !showOnboarding;

  const initialRoute: keyof RootStackParamList = showLanguage
    ? 'Language'
    : showOnboarding
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
        contentStyle: { backgroundColor: colors.background },
      }}
      initialRouteName={initialRoute}
    >
      <Stack.Screen name="Language" component={LanguageScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ animation: 'none' }} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="Verification" component={VerificationScreen} />
      <Stack.Screen name="ProfileCreate" component={ProfileCreateScreen} />
      <Stack.Screen name="EmergencyContacts" component={EmergencyContactsScreen} />
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="WarningSigns" component={WarningSignsScreen} />
      <Stack.Screen name="SymptomCheckIn" component={SymptomCheckInScreen} />
      <Stack.Screen name="MoodCheckIn" component={MoodCheckInScreen} />
      <Stack.Screen name="Tracking" component={TrackingScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="ChatSupport" component={ChatSupportScreen} />
      <Stack.Screen name="CarePlanNotes" component={CarePlanNotesScreen} />
      <Stack.Screen name="SOS" component={SOSScreen} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} />
      <Stack.Screen name="NurseDirectory" component={NurseDirectoryScreen} />
      <Stack.Screen name="Facilities" component={FacilitiesScreen} />
      <Stack.Screen name="EmergencyGuide" component={EmergencyGuideScreen} />
      <Stack.Screen name="StudyConsent" component={StudyConsentScreen} />
      <Stack.Screen name="SUSQuestionnaire" component={SUSQuestionnaireScreen} />
    </Stack.Navigator>
  );
}
