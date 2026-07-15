import { useEffect, useState } from 'react';
import { runOnJS, useAnimatedReaction, useSharedValue, withTiming } from 'react-native-reanimated';

import { useReducedMotion } from '@/hooks/use-reduced-motion';

export function useCountUp(targetValue: number, durationMs = 800) {
  const reducedMotion = useReducedMotion();
  const progress = useSharedValue(0);
  const [display, setDisplay] = useState(targetValue);

  useEffect(() => {
    if (reducedMotion) return;
    progress.value = 0;
    progress.value = withTiming(targetValue, { duration: durationMs });
  }, [durationMs, progress, reducedMotion, targetValue]);

  useAnimatedReaction(
    () => Math.round(progress.value),
    (value, previous) => {
      if (value !== previous) {
        runOnJS(setDisplay)(value);
      }
    }
  );

  return reducedMotion ? targetValue : display;
}
