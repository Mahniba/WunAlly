import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { getFruitVisual } from '../utils/fruitVisuals';
import { BabySizeArtKey } from '../types';
import BananaSvg from './art/BananaSvg';
import WatermelonSvg from './art/WatermelonSvg';
import MangoSvg from './art/MangoSvg';
import CoconutSvg from './art/CoconutSvg';
import YamSvg from './art/YamSvg';
import PregnantIllustration from './art/PregnantIllustration';

const ART_MAP = {
  banana: BananaSvg,
  watermelon: WatermelonSvg,
  mango: MangoSvg,
  coconut: CoconutSvg,
  yam: YamSvg,
  pregnant: PregnantIllustration,
} as const;

interface FruitMilestoneImageProps {
  fruitComparison: string;
  size?: number;
}

export function FruitMilestoneImage({ fruitComparison, size = 64 }: FruitMilestoneImageProps) {
  const { emoji, imageUrl, artKey } = getFruitVisual(fruitComparison);
  const [imageFailed, setImageFailed] = useState(false);

  const showRemoteImage = Boolean(imageUrl) && !imageFailed;
  const Art = ART_MAP[artKey as BabySizeArtKey];

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size * 0.25 }]}>
      {showRemoteImage ? (
        <Image
          source={{ uri: imageUrl }}
          style={[styles.image, { width: size - 8, height: size - 8, borderRadius: (size - 8) * 0.2 }]}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
          onError={() => setImageFailed(true)}
        />
      ) : emoji ? (
        <Text style={[styles.emoji, { fontSize: size * 0.45 }]} accessibilityLabel={fruitComparison}>
          {emoji}
        </Text>
      ) : (
        <Art size={size * 0.75} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    backgroundColor: colors.backgroundSecondary,
  },
  emoji: {
    textAlign: 'center',
  },
});
