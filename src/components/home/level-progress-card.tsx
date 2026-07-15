import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

import { PointsCounter } from '@/components/home/points-counter';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CardShadow, Radius, Spacing } from '@/constants/theme';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useTheme } from '@/hooks/use-theme';
import type { LevelProgress } from '@/types/home';

type LevelProgressCardProps = {
  level: LevelProgress;
  isNewBadge?: boolean;
};

export function LevelProgressCard({ level, isNewBadge }: LevelProgressCardProps) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const fillWidth = useSharedValue(0);
  const shineOpacity = useSharedValue(0);
  const pct = Math.min(1, level.score / level.nextLevelThreshold);

  useEffect(() => {
    fillWidth.value = withTiming(pct, { duration: 600 });
  }, [pct, fillWidth]);

  useEffect(() => {
    if (isNewBadge && level.lastBadge && !reducedMotion) {
      shineOpacity.value = withSequence(withTiming(1, { duration: 300 }), withTiming(0.4, { duration: 600 }));
    }
  }, [isNewBadge, level.lastBadge, reducedMotion, shineOpacity]);

  const progressBarStyle = useAnimatedStyle(() => ({ width: `${fillWidth.value * 100}%` }));
  const shineStyle = useAnimatedStyle(() => ({ opacity: shineOpacity.value }));

  const remaining = Math.max(0, level.nextLevelThreshold - level.score);

  return (
    <ThemedView type="backgroundElement" style={[styles.card, CardShadow]}>
      <View style={styles.row}>
        <ThemedText type="smallBold">{level.levelName}</ThemedText>
        <PointsCounter value={level.score} type="smallBold" themeColor="accent" />
      </View>

      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, { backgroundColor: theme.accent }, progressBarStyle]} />
      </View>
      <ThemedText type="small" themeColor="textSecondary">
        {remaining > 0
          ? `${level.score} van ${level.nextLevelThreshold} punten tot ${level.nextLevelName}`
          : `Level omhoog! Op naar ${level.nextLevelName}`}
      </ThemedText>

      {level.lastBadge ? (
        <View style={styles.badgeRow}>
          <Animated.View style={[styles.badgeShine, { backgroundColor: theme.sunriseSoft }, shineStyle]} />
          <ThemedText type="small" style={styles.badgeIcon}>
            🏅
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Laatste badge: {level.lastBadge}
          </ThemedText>
        </View>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.card,
    borderCurve: 'continuous',
    padding: Spacing.three,
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressTrack: {
    height: 8,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(128,128,128,0.2)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: Radius.pill,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    position: 'relative',
  },
  badgeShine: {
    position: 'absolute',
    left: -4,
    top: -4,
    width: 28,
    height: 28,
    borderRadius: Radius.avatar,
  },
  badgeIcon: {
    fontSize: 16,
  },
});
