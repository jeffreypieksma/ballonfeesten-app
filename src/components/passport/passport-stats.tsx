import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { PointsCounter } from '@/components/home/points-counter';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useTheme } from '@/hooks/use-theme';

type PassportStatsProps = {
  found: number;
  total: number;
  totalPoints: number;
};

export function PassportStats({ found, total, totalPoints }: PassportStatsProps) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const fill = useSharedValue(0);
  const pct = total > 0 ? found / total : 0;

  useEffect(() => {
    fill.value = reducedMotion ? pct : withTiming(pct, { duration: 600 });
  }, [pct, reducedMotion, fill]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${fill.value * 100}%` }));

  return (
    <View style={styles.container} accessibilityLiveRegion="polite">
      <View style={styles.row}>
        <ThemedText type="smallBold">
          {found} van {total} stempels
        </ThemedText>
        <View style={styles.points}>
          <PointsCounter value={totalPoints} type="smallBold" style={{ color: theme.gold }} />
          <ThemedText type="smallBold" style={{ color: theme.gold }}>
            {' '}punten
          </ThemedText>
        </View>
      </View>
      <View style={[styles.track, { backgroundColor: theme.backgroundSelected }]}>
        <Animated.View style={[styles.fillBar, { backgroundColor: theme.gold }, fillStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.one,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
  },
  points: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  track: {
    height: 6,
    borderRadius: Radius.pill,
    overflow: 'hidden',
  },
  fillBar: {
    height: '100%',
    borderRadius: Radius.pill,
  },
});
