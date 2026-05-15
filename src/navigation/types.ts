import type { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Home: undefined;
  Reminders: undefined;
  CheckIn: undefined;
  Network: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  Verification: undefined;
  ProfileCreate: undefined;
  EmergencyContacts: undefined;
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
  Tracking: { week: number };
  WarningSigns: undefined;
  Chat: undefined;
  ChatSupport: undefined;
  CarePlanNotes: undefined;
  SOS: undefined;
  Privacy: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
