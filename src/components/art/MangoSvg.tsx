import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function MangoSvg({ size = 64 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Path d="M14 36c4-14 18-20 30-18 0 0 4 10-4 20s-22 12-26 6c-2-3-4-6-0-8z" fill="#FFB74D" />
      <Path d="M42 18c4 2 6 6 6 10" stroke="#7CB342" strokeWidth={2} fill="none" />
    </Svg>
  );
}
