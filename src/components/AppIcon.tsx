import React from 'react';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme';

type FeatherIconName = keyof typeof Feather.glyphMap;

interface AppIconProps {
  name: FeatherIconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function AppIcon({
  name,
  size = 20,
  color = colors.textSecondary,
}: AppIconProps) {
  return <Feather name={name} size={size} color={color} />;
}

export type { FeatherIconName };
