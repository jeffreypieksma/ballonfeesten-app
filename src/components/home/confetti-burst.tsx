import { useEffect } from 'react';
import { StyleSheet, View, type DimensionValue } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useTheme } from '@/hooks/use-theme';

const DEFAULT_PARTICLE_COUNT = 12;
const COLORS_KEYS = ['balloonRed', 'balloonYellow', 'balloonGreen', 'balloonPurple', 'sunrise'] as const;

type ConfettiBurstProps = {
  onDone?: () => void;
  /** Number of particles in the radial burst. */
  count?: number;
  /** Burst origin within the parent (defaults to upper-center). */
  origin?: { top: DimensionValue; left: DimensionValue };
};

function Particle({ index, count, color }: { index: number; count: number; color: string }) {
  const progress = useSharedValue(0);
  const angle = (index / count) * Math.PI * 2;
  const distance = 60 + (index % 3) * 20;

  useEffect(() => {
    progress.value = withTiming(1, { duration: 900 });
  }, [progress]);

  const style = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [
      { translateX: Math.cos(angle) * distance * progress.value },
      { translateY: Math.sin(angle) * distance * progress.value },
      { rotate: `${progress.value * 180}deg` },
    ],
  }));

  return <Animated.View style={[styles.particle, { backgroundColor: color }, style]} />;
}

export function ConfettiBurst({ onDone, count = DEFAULT_PARTICLE_COUNT, origin }: ConfettiBurstProps) {
  const reducedMotion = useReducedMotion();
  const theme = useTheme();

  useEffect(() => {
    const timeout = setTimeout(() => onDone?.(), 1500);
    return () => clearTimeout(timeout);
  }, [onDone]);

  if (reducedMotion) {
    return null;
  }

  return (
    <View
      style={[styles.container, origin, { pointerEvents: 'none' }]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants">
      {Array.from({ length: count }).map((_, index) => (
        <Particle key={index} index={index} count={count} color={theme[COLORS_KEYS[index % COLORS_KEYS.length]]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '30%',
    left: '50%',
    width: 1,
    height: 1,
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 2,
  },
});
