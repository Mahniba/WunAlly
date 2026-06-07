import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import { useKeyboardOffset } from '../hooks/useKeyboardOffset';

interface KeyboardSafeViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
  withHeader?: boolean;
  offsetExtra?: number;
}

/** For fixed layouts (e.g. chat bar at bottom) that must shift above the keyboard. */
export function KeyboardSafeView({
  children,
  style,
  withHeader = true,
  offsetExtra = 0,
}: KeyboardSafeViewProps) {
  const keyboardOffset = useKeyboardOffset(withHeader, offsetExtra);

  // Android uses softwareKeyboardLayoutMode: resize in app.json — avoid double-shifting.
  if (Platform.OS !== 'ios') {
    return <View style={[styles.flex, style]}>{children}</View>;
  }

  return (
    <KeyboardAvoidingView
      style={[styles.flex, style]}
      behavior="padding"
      keyboardVerticalOffset={keyboardOffset}
    >
      {children}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
