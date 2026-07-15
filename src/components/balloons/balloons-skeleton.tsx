import { useEffect } from 'react';
import { StyleSheet, View, type DimensionValue } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useTheme } from '@/hooks/use-theme';

// Mirrors the ShimmerBlock in program-skeleton.tsx (kept local per skeleton on purpose).
function ShimmerBlock({ height, width = '100%', radius = Radius.chip, card }: { height?: number; width?: DimensionValue; radius?: number; card?: boolean }) {
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
        card ? styles.cardBlock : { height, width },
        { borderRadius: radius, backgroundColor: theme.backgroundElement },
        style,
      ]}
    />
  );
}

export function BalloonsSkeleton() {
  return (
    <View style={styles.container} accessibilityLabel="Ballonnen worden geladen">
      <View style={styles.chipRow}>
        {Array.from({ length: 4 }).map((_, index) => (
          <ShimmerBlock key={index} height={36} width={84} radius={Radius.pill} />
        ))}
      </View>
      <View style={styles.grid}>
        {Array.from({ length: 6 }).map((_, index) => (
          <ShimmerBlock key={index} card radius={Radius.card} />
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
  chipRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  cardBlock: {
    flexBasis: '48%',
    flexGrow: 1,
    aspectRatio: 3 / 4,
  },
});
