import React from 'react';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

/** Warm, soft pregnant figure for check-in hero (matches mockup palette). */
export default function PregnantIllustration({ size = 96 }: { size?: number }) {
  const h = size * (110 / 90);
  return (
    <Svg width={size} height={h} viewBox="0 0 90 110" fill="none">
      <Ellipse cx="45" cy="105" rx="28" ry="5" fill="#F5DDD5" opacity={0.4} />
      <Circle cx="45" cy="22" r="14" fill="#F2C5A7" />
      <Path
        d="M28 55 Q28 40 45 38 Q62 40 62 55 L65 88 Q65 96 45 96 Q25 96 25 88 Z"
        fill="#E8A882"
      />
      <Ellipse cx="45" cy="72" rx="14" ry="18" fill="#F5C4A8" opacity={0.5} />
      <Path d="M32 60 Q28 65 26 72" stroke="#E8735A" strokeWidth={1.5} strokeLinecap="round" opacity={0.4} />
      <Path d="M58 60 Q62 65 64 72" stroke="#E8735A" strokeWidth={1.5} strokeLinecap="round" opacity={0.4} />
      <Circle cx="39" cy="20" r="2" fill="#5C3D2E" />
      <Circle cx="51" cy="20" r="2" fill="#5C3D2E" />
      <Path d="M41 26 Q45 29 49 26" stroke="#C0856A" strokeWidth={1.2} strokeLinecap="round" />
      <Path d="M30 38 Q22 50 20 65 Q18 78 24 80" stroke="#D4956C" strokeWidth={6} strokeLinecap="round" />
      <Path d="M60 38 Q68 50 70 65 Q72 78 66 80" stroke="#D4956C" strokeWidth={6} strokeLinecap="round" />
      <Path d="M35 15 Q30 8 38 5 Q45 2 52 5 Q60 8 55 15" fill="#5C3D2E" />
      <Circle cx="56" cy="30" r="3" fill="#F9D0D8" opacity={0.5} />
      <Circle cx="62" cy="25" r="2" fill="#F9D0D8" opacity={0.4} />
    </Svg>
  );
}
