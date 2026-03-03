import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme';
import { useResponsive } from '../hooks/useResponsive';

interface ScreenContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}

export function ScreenContainer({
  children,
  style,
  edges = ['top', 'bottom', 'left', 'right'],
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();
  const { horizontalPadding } = useResponsive();
  const padding = {
    paddingTop: edges.includes('top') ? insets.top : 0,
    paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
    paddingLeft: edges.includes('left') ? Math.max(insets.left, horizontalPadding) : 0,
    paddingRight: edges.includes('right') ? Math.max(insets.right, horizontalPadding) : 0,
  };
  return <View style={[styles.container, padding, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
