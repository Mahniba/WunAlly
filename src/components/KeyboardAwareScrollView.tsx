import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  type ScrollViewProps,
} from 'react-native';
import { useKeyboardOffset } from '../hooks/useKeyboardOffset';

interface KeyboardAwareScrollViewProps extends ScrollViewProps {
  withHeader?: boolean;
  offsetExtra?: number;
}

export function KeyboardAwareScrollView({
  children,
  style,
  contentContainerStyle,
  withHeader = false,
  offsetExtra = 0,
  keyboardShouldPersistTaps = 'handled',
  keyboardDismissMode = 'on-drag',
  showsVerticalScrollIndicator = false,
  ...rest
}: KeyboardAwareScrollViewProps) {
  const keyboardOffset = useKeyboardOffset(withHeader, offsetExtra);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={keyboardOffset}
    >
      <ScrollView
        style={[styles.flex, style]}
        contentContainerStyle={[styles.content, contentContainerStyle]}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        keyboardDismissMode={keyboardDismissMode}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
        {...rest}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1 },
});
