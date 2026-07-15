import { useEffect } from 'react';
import { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { useReducedMotion } from '@/hooks/use-reduced-motion';

export function useDriftAnimation(distance = 16, duration = 6000) {
  const reducedMotion = useReducedMotion();
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (reducedMotion) {
      translateX.value = 0;
      return;
    }
    translateX.value = withRepeat(withTiming(distance, { duration }), -1, true);
  }, [distance, duration, reducedMotion, translateX]);

  return useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));
}
