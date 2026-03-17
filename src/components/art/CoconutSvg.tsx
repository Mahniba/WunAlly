import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export default function CoconutSvg({ size = 64 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Circle cx="32" cy="32" r="24" fill="#6D4C41" />
      <Circle cx="32" cy="32" r="14" fill="#A1887F" />
    </Svg>
  );
}
