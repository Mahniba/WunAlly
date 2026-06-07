import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Offset for KeyboardAvoidingView when a ScreenHeader (~56px) is shown. */
export function useKeyboardOffset(header = true, extra = 0): number {
  const insets = useSafeAreaInsets();
  if (Platform.OS !== 'ios') return 0;
  return insets.top + (header ? 56 : 0) + extra;
}
