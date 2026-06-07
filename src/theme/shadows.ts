import { Platform, ViewStyle } from 'react-native';

type ShadowStyle = Pick<
  ViewStyle,
  'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius' | 'elevation'
>;

const ios = (opacity: number, radius: number, y = 2): ShadowStyle => ({
  shadowColor: '#1A1520',
  shadowOffset: { width: 0, height: y },
  shadowOpacity: opacity,
  shadowRadius: radius,
  elevation: 0,
});

export const shadows = {
  none: {} as ShadowStyle,
  sm: Platform.select({
    ios: ios(0.04, 4, 1),
    android: { elevation: 2 },
    default: ios(0.04, 4, 1),
  }) as ShadowStyle,
  md: Platform.select({
    ios: ios(0.07, 8, 2),
    android: { elevation: 4 },
    default: ios(0.07, 8, 2),
  }) as ShadowStyle,
  lg: Platform.select({
    ios: ios(0.1, 16, 4),
    android: { elevation: 8 },
    default: ios(0.1, 16, 4),
  }) as ShadowStyle,
  tabBar: Platform.select({
    ios: {
      shadowColor: '#1A1520',
      shadowOffset: { width: 0, height: -1 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 0,
    },
    android: { elevation: 8 },
    default: {
      shadowColor: '#1A1520',
      shadowOffset: { width: 0, height: -1 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 0,
    },
  }) as ShadowStyle,
} as const;
