import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { PointsCounter } from '@/components/home/points-counter';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useTheme } from '@/hooks/use-theme';

type BingoProgressHeaderProps = {
  found: number;
  total: number;
  isComplete: boolean;
  completedLineCount: number;
};

export function BingoProgressHeader({ found, total, isComplete, completedLineCount }: BingoProgressHeaderProps) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const fill = useSharedValue(0);
  const pct = total > 0 ? found / total : 0;

  useEffect(() => {
    fill.value = reducedMotion ? pct : withTiming(pct, { duration: 600 });
  }, [pct, reducedMotion, fill]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${fill.value * 100}%` }));

  const statusLine = isComplete
    ? 'Alle ballonnen gespot — wat een kaart!'
    : completedLineCount > 0
      ? `${completedLineCount} ${completedLineCount === 1 ? 'lijn' : 'lijnen'} vol — ga zo door!`
      : 'Spot 3 op een rij voor BINGO';

  return (
    <View style={styles.container} accessibilityLiveRegion="polite">
      <View style={styles.countRow}>
        <View style={styles.countGroup}>
          <PointsCounter value={found} type="hero" themeColor="secondary" />
          <ThemedText type="smallBold" themeColor="textSecondary">
            {' '}van {total} gespot
          </ThemedText>
        </View>
        {isComplete && (
          <View style={[styles.completeChip, { backgroundColor: theme.goldSoft }]}>
            <ThemedText type="smallBold" style={{ color: theme.secondary }}>
              Volle kaart! 🏆
            </ThemedText>
          </View>
        )}
      </View>

      <View style={[styles.track, { backgroundColor: theme.backgroundSelected }]}>
        <Animated.View style={[styles.fillBar, { backgroundColor: theme.gold }, fillStyle]} />
      </View>

      <ThemedText type="small" themeColor="textSecondary">
        {statusLine}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.one,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  countGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  completeChip: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Radius.pill,
    borderCurve: 'continuous',
  },
  track: {
    height: 8,
    borderRadius: Radius.pill,
    overflow: 'hidden',
    marginTop: Spacing.half,
  },
  fillBar: {
    height: '100%',
    borderRadius: Radius.pill,
  },
});
