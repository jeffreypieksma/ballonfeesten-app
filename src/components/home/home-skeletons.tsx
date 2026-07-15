import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CardShadow, Radius, Spacing } from '@/constants/theme';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useTheme } from '@/hooks/use-theme';

function SkeletonBlock({ height }: { height: number }) {
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
      style={[styles.block, { height, backgroundColor: theme.backgroundElement }, CardShadow, style]}
    />
  );
}

export function HomeSkeleton() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.row}>
        <SkeletonBlock height={44} />
      </View>
      <SkeletonBlock height={200} />
      <SkeletonBlock height={70} />
      <SkeletonBlock height={90} />
      <SkeletonBlock height={140} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  row: {
    flexDirection: 'row',
  },
  block: {
    width: '100%',
    borderRadius: Radius.card,
    borderCurve: 'continuous',
  },
});
