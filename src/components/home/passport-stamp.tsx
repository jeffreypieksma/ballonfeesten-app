import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useTheme } from '@/hooks/use-theme';
import { triggerHaptic } from '@/lib/haptics';
import type { PassportStamp as PassportStampType } from '@/types/home';

type PassportStampProps = {
  stamp: PassportStampType;
  justStamped?: boolean;
};

export function PassportStamp({ stamp, justStamped }: PassportStampProps) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const scale = useSharedValue(justStamped && !reducedMotion ? 1.4 : 1);

  useEffect(() => {
    if (justStamped) {
      if (!reducedMotion) {
        scale.value = withSpring(1, { damping: 8 });
      }
      triggerHaptic('light');
    }
  }, [justStamped, reducedMotion, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: '-6deg' }],
  }));

  return (
    <Animated.View
      style={[styles.stamp, { borderColor: theme.stampBrown }, animatedStyle]}
      accessibilityLabel={`Laatste stempel: ${stamp.label}, ${stamp.category}, ${stamp.points} punten, ${stamp.date}`}>
      <ThemedText type="smallBold" style={{ color: theme.stampBrown }}>
        {stamp.category}
      </ThemedText>
      <ThemedText type="small" style={{ color: theme.stampBrown }}>
        {stamp.label}
      </ThemedText>
      <ThemedText type="small" style={{ color: theme.stampBrown }}>
        +{stamp.points} punten
      </ThemedText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  stamp: {
    borderWidth: 2,
    borderRadius: Radius.chip,
    borderCurve: 'continuous',
    borderStyle: 'dashed',
    padding: Spacing.two,
    alignItems: 'center',
    minWidth: 120,
  },
});
