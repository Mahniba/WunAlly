import React, { useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Pressable,
} from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { AppIcon } from './AppIcon';
import type { HealthProvider } from '../services/api/network';
import { colors, typography } from '../theme';

// Larger rings (relative to the canvas) so the scan UI feels more expansive.
const ORBIT_FRACTIONS = [0.3, 0.5, 0.7] as const;
const RING_CAPACITIES = [2, 3, 4] as const;

interface OrbitPosition {
  provider: HealthProvider;
  x: number;
  y: number;
  ringIndex: number;
}

interface NurseOrbitRadarProps {
  size: number;
  scanning: boolean;
  providers: HealthProvider[];
  revealedCount: number;
  selectedId: number | null;
  hubScanningLabel: string;
  hubYouLabel: string;
  onlineLabel: string;
  offlineLabel: string;
  onSelect: (provider: HealthProvider) => void;
}

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function computeOrbitPositions(
  providers: HealthProvider[],
  size: number
): OrbitPosition[] {
  const center = size / 2;
  const sorted = [...providers].sort(
    (a, b) => Number(b.is_online) - Number(a.is_online)
  );
  const positions: OrbitPosition[] = [];
  let cursor = 0;

  ORBIT_FRACTIONS.forEach((fraction, ringIndex) => {
    const capacity = RING_CAPACITIES[ringIndex];
    const onRing = sorted.slice(cursor, cursor + capacity);
    if (onRing.length === 0) return;

    const radius = (size / 2) * fraction;
    const spread = (Math.PI * 2) / Math.max(onRing.length, 3);
    const ringOffset = ringIndex * (Math.PI / 6);

    onRing.forEach((provider, index) => {
      const angle = -Math.PI / 2 + ringOffset + index * spread;
      positions.push({
        provider,
        x: center + radius * Math.cos(angle),
        y: center + radius * Math.sin(angle),
        ringIndex,
      });
    });

    cursor += onRing.length;
  });

  return positions;
}

function OrbitalNurse({
  provider,
  x,
  y,
  selected,
  visible,
  delayMs,
  onlineLabel,
  offlineLabel,
  onPress,
}: {
  provider: HealthProvider;
  x: number;
  y: number;
  selected: boolean;
  visible: boolean;
  delayMs: number;
  onlineLabel: string;
  offlineLabel: string;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      scale.setValue(0);
      opacity.setValue(0);
      return;
    }

    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
        delay: delayMs,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 280,
        delay: delayMs,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, delayMs, scale, opacity]);

  const avatarSize = 52;

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[
        styles.nurseOrbit,
        {
          left: x - avatarSize / 2,
          top: y - avatarSize / 2,
          opacity,
          transform: [{ scale }],
        },
      ]}
    >
      <Pressable
        onPress={onPress}
        style={[
          styles.nurseBubble,
          selected && styles.nurseBubbleSelected,
          !provider.is_online && styles.nurseBubbleOffline,
        ]}
        accessibilityRole="button"
        accessibilityLabel={`${provider.name}, ${provider.is_online ? onlineLabel : offlineLabel}`}
      >
        <Text style={styles.nurseInitials}>{initials(provider.name)}</Text>
        <View
          style={[
            styles.statusDot,
            provider.is_online ? styles.statusOnline : styles.statusOffline,
          ]}
        />
      </Pressable>
    </Animated.View>
  );
}

export function NurseOrbitRadar({
  size,
  scanning,
  providers,
  revealedCount,
  selectedId,
  hubScanningLabel,
  hubYouLabel,
  onlineLabel,
  offlineLabel,
  onSelect,
}: NurseOrbitRadarProps) {
  const center = size / 2;
  const positions = useMemo(
    () => computeOrbitPositions(providers, size),
    [providers, size]
  );

  const pulse = useRef(new Animated.Value(0)).current;
  const sweep = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!scanning) {
      pulse.stopAnimation();
      sweep.stopAnimation();
      return;
    }

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1800,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    const sweepLoop = Animated.loop(
      Animated.timing(sweep, {
        toValue: 1,
        duration: 3200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    pulseLoop.start();
    sweepLoop.start();

    return () => {
      pulseLoop.stop();
      sweepLoop.stop();
    };
  }, [scanning, pulse, sweep]);

  const pulseScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 1],
  });
  const pulseOpacity = pulse.interpolate({
    inputRange: [0, 0.6, 1],
    outputRange: [0.45, 0.2, 0],
  });
  const sweepRotate = sweep.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.canvas, { width: size, height: size }]}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        {ORBIT_FRACTIONS.map((fraction, index) => {
          const radius = (size / 2) * fraction;
          return (
            <Circle
              key={fraction}
              cx={center}
              cy={center}
              r={radius}
              stroke={index === 0 ? colors.coralDark : colors.border}
              strokeWidth={index === 0 ? 1.5 : 1}
              strokeOpacity={index === 0 ? 0.35 : 0.55}
              strokeDasharray={index === 0 ? undefined : '5 7'}
              fill="none"
            />
          );
        })}
        <Line
          x1={center}
          y1={center}
          x2={center}
          y2={center - (size / 2) * ORBIT_FRACTIONS[2]}
          stroke={colors.border}
          strokeWidth={1}
          strokeOpacity={0.35}
        />
        <Line
          x1={center}
          y1={center}
          x2={center + (size / 2) * ORBIT_FRACTIONS[2]}
          y2={center}
          stroke={colors.border}
          strokeWidth={1}
          strokeOpacity={0.35}
        />
      </Svg>

      {scanning ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.pulseRing,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              opacity: pulseOpacity,
              transform: [{ scale: pulseScale }],
            },
          ]}
        />
      ) : null}

      {scanning ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.sweepWrap,
            { width: size, height: size, transform: [{ rotate: sweepRotate }] },
          ]}
        >
          <View
            style={[
              styles.sweepLine,
              { top: center - 1, left: center, height: (size / 2) * ORBIT_FRACTIONS[2] - 8 },
            ]}
          />
        </Animated.View>
      ) : null}

      <View style={[styles.hub, { left: center - 28, top: center - 28 }]}>
        <View style={[styles.hubInner, scanning && styles.hubScanning]}>
          {scanning ? (
            <AppIcon name="search" size={20} color={colors.coralDark} />
          ) : (
            <AppIcon name="user" size={20} color={colors.coralDark} />
          )}
        </View>
        <Text style={styles.hubLabel}>{scanning ? hubScanningLabel : hubYouLabel}</Text>
      </View>

      {positions.map((pos, index) => (
        <OrbitalNurse
          key={pos.provider.id}
          provider={pos.provider}
          x={pos.x}
          y={pos.y}
          selected={selectedId === pos.provider.id}
          visible={index < revealedCount}
          delayMs={index * 220}
          onlineLabel={onlineLabel}
          offlineLabel={offlineLabel}
          onPress={() => onSelect(pos.provider)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    alignSelf: 'center',
    position: 'relative',
  },
  pulseRing: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: colors.coralDark,
  },
  sweepWrap: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  sweepLine: {
    position: 'absolute',
    width: 2,
    backgroundColor: colors.coralDark,
    opacity: 0.35,
    borderRadius: 1,
  },
  hub: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hubInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.coralDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hubScanning: {
    borderColor: colors.coral,
  },
  hubLabel: {
    position: 'absolute',
    bottom: -14,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.textMuted,
    letterSpacing: 0.3,
  },
  nurseOrbit: {
    position: 'absolute',
    zIndex: 2,
  },
  nurseBubble: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1A1520',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  nurseBubbleSelected: {
    borderColor: colors.coralDark,
    borderWidth: 2.5,
    backgroundColor: colors.softPink,
  },
  nurseBubbleOffline: {
    opacity: 0.72,
  },
  nurseInitials: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.coralDark,
    letterSpacing: 0.5,
  },
  statusDot: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  statusOnline: {
    backgroundColor: colors.success,
  },
  statusOffline: {
    backgroundColor: colors.textMuted,
  },
});
