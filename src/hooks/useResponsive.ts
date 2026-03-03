import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { scaleByWidth, scaleByHeight, scaleFont } from '../utils/layout';

export function useResponsive() {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const BASE_W = 375;
    const BASE_H = 812;
    const scaleW = (v: number) => Math.round((v * Math.min(Math.max(width / BASE_W, 0.85), 1.25)));
    const scaleH = (v: number) => Math.round((v * Math.min(Math.max(height / BASE_H, 0.9), 1.15)));
    const scaleF = (v: number) => Math.max(v, Math.min(scaleW(v), v * 1.2));

    return {
      width,
      height,
      s: scaleW,
      sVertical: scaleH,
      font: scaleF,
      horizontalPadding: Math.max(scaleW(16), 12),
      isSmallDevice: width < 360,
      isLargeDevice: width >= 414,
    };
  }, [width, height]);
}
