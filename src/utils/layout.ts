import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/** Base width for design (e.g. 375pt iPhone). Scale from this. */
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

/** Scale factor by width; clamp so very small/large screens don't break. */
export function scaleByWidth(value: number): number {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const normalized = Math.min(Math.max(scale, 0.85), 1.25);
  return Math.round(PixelRatio.roundToNearestPixel(value * normalized));
}

/** Scale vertical spacing for tall/short screens. */
export function scaleByHeight(value: number): number {
  const scale = SCREEN_HEIGHT / BASE_HEIGHT;
  const normalized = Math.min(Math.max(scale, 0.9), 1.15);
  return Math.round(PixelRatio.roundToNearestPixel(value * normalized));
}

/** Font size that respects readability and system scale; min 16px. */
export function scaleFont(size: number): number {
  const scaled = scaleByWidth(size);
  return Math.max(size, Math.min(scaled, size * 1.2));
}

export const layout = {
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  isSmallDevice: SCREEN_WIDTH < 360,
  isLargeDevice: SCREEN_WIDTH >= 414,
  horizontalPadding: Math.max(scaleByWidth(16), 12),
  bottomTabArea: scaleByHeight(80),
} as const;
