import React from 'react';
import Svg, { Rect } from 'react-native-svg';

export default function YamSvg({ size = 64 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Rect x="14" y="18" width="36" height="28" rx="10" fill="#A1887F" />
    </Svg>
  );
}
