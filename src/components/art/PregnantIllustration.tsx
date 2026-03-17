import React from 'react';
import Svg, { Circle, Rect, Path } from 'react-native-svg';

export default function PregnantIllustration({ size = 96 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 96 96">
      <Circle cx="48" cy="24" r="12" fill="#F8BBD0" />
      <Path d="M30 36c0 12 10 20 18 20s18-8 18-20c0-8-6-10-12-10-8 0-24 0-24 10z" fill="#FFCCBC" />
      <Rect x="26" y="50" width="44" height="28" rx="12" fill="#FF8A65" />
    </Svg>
  );
}
