import { useEffect } from 'react';
import { StyleSheet, View, type DimensionValue } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useTheme } from '@/hooks/use-theme';

// Mirrors the ShimmerBlock in program-skeleton.tsx (kept local per skeleton on purpose).
function ShimmerBlock({ height, width = '100%', radius = Radius.chip, square }: { height?: number; width?: DimensionValue; radius?: number; square?: boolean }) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const opacity = useSharedValue(reducedMotion ? 0.6 : 0.4);

  useEffect(() => {
    if (reducedMotion) return;
    opacity.value = withRepeat(withSequence(withTiming(0.7, { duration: 700 }), withTiming(0.4, { duration: 700 })), -1, true);
  }, [reducedMotion, opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        square ? styles.square : { height, width },
        { borderRadius: radius, backgroundColor: theme.backgroundElement },
        style,
      ]}
    />
  );
}

export function PassportSkeleton() {
  return (
    <View style={styles.container} accessibilityLabel="Paspoort wordt geladen">
      <ShimmerBlock height={92} radius={Radius.card} />
      <ShimmerBlock height={20} width={200} />
      <View style={styles.grid}>
        {Array.from({ length: 2 }).map((_, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {Array.from({ length: 2 }).map((_, colIndex) => (
              <ShimmerBlock key={colIndex} square />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    gap: Spacing.three,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  grid: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  square: {
    flex: 1,
    aspectRatio: 1,
  },
});
