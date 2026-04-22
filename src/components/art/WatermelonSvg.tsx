import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export default function WatermelonSvg({ size = 64 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Circle cx="32" cy="36" r="20" fill="#E57373" />
      <Path d="M12 36a20 20 0 0 1 40 0" fill="#66BB6A" />
      <Path d="M20 36c3-2 6-3 12-3s9 1 12 3" stroke="#8D6E63" strokeWidth={1} fill="none" />
    </Svg>
  );
}
