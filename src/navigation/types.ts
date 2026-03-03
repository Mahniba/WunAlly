import type { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Home: undefined;
  Reminders: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Onboarding: undefined;
  ProfileCreate: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
  Tracking: { week: number };
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
