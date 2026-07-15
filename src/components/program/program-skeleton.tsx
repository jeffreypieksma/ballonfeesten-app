import { useEffect } from 'react';
import { StyleSheet, View, type DimensionValue } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useTheme } from '@/hooks/use-theme';

function ShimmerBlock({ height, width = '100%', radius = Radius.chip }: { height: number; width?: DimensionValue; radius?: number }) {
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
      style={[{ height, width, borderRadius: radius, backgroundColor: theme.backgroundElement }, style]}
    />
  );
}

export function ProgramSkeleton() {
  return (
    <View style={styles.container} accessibilityLabel="Programma wordt geladen">
      <View style={styles.dayRow}>
        {Array.from({ length: 5 }).map((_, index) => (
          <ShimmerBlock key={index} height={36} width={72} radius={Radius.pill} />
        ))}
      </View>
      <ShimmerBlock height={20} width={160} />
      <View style={styles.rows}>
        {Array.from({ length: 6 }).map((_, index) => (
          <View key={index} style={styles.timelineRow}>
            <ShimmerBlock height={16} width={40} />
            <ShimmerBlock height={44} />
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
  dayRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  rows: {
    gap: Spacing.three,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
});
