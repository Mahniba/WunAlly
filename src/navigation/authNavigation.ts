import type { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from './types';

export function resetAfterAuth(
  navigation: NavigationProp<RootStackParamList>,
  hasProfile: boolean
) {
  navigation.reset({
    index: 0,
    routes: [{ name: hasProfile ? 'Main' : 'ProfileCreate' }],
  });
}

export function resetToLogin(navigation: NavigationProp<RootStackParamList>) {
  navigation.reset({
    index: 0,
    routes: [{ name: 'Login' }],
  });
}
