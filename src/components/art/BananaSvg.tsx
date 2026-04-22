import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function BananaSvg({ size = 64 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Path d="M6 46c0-18 28-28 44-22 0 0-4 18-16 28S6 46 6 46z" fill="#FFD54F" />
      <Path d="M10 44c8-6 18-8 28-6" stroke="#FFB300" strokeWidth={2} fill="none" />
    </Svg>
  );
}
