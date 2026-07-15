import { useEffect, useState } from 'react';
import { StyleSheet, View, type DimensionValue } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { ConfettiBurst } from '@/components/home/confetti-burst';
import { ThemedText } from '@/components/themed-text';
import { CardShadow, Radius, Spacing } from '@/constants/theme';
import type { BingoCelebration as BingoCelebrationType } from '@/hooks/use-bingo';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useTheme } from '@/hooks/use-theme';
import { triggerHaptic } from '@/lib/haptics';
import type { BingoLineKind } from '@/types/bingo';

const LINE_SUBTITLES: Record<BingoLineKind, string> = {
  row: 'Rij vol!',
  column: 'Kolom vol!',
  diagonal: 'Diagonaal vol!',
};

type BingoCelebrationProps = {
  celebration: BingoCelebrationType;
  onDone: () => void;
};

/**
 * Full-screen, non-interactive celebration overlay. Mount keyed by
 * `celebration.key` so repeat celebrations restart the choreography.
 */
export function BingoCelebration({ celebration, onDone }: BingoCelebrationProps) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const isCard = celebration.kind === 'card';
  const totalDuration = isCard ? 3500 : 2500;

  const scale = useSharedValue(reducedMotion ? 1 : 0.3);
  const opacity = useSharedValue(0);
  const wobble = useSharedValue(0);

  useEffect(() => {
    triggerHaptic('success');

    opacity.value = withTiming(1, { duration: 150 });
    if (!reducedMotion) {
      scale.value = withSpring(1, { damping: isCard ? 7 : 9 });
      if (isCard) {
        wobble.value = withRepeat(
          withSequence(withTiming(-3, { duration: 300 }), withTiming(3, { duration: 300 })),
          4,
          true
        );
      }
    }
    // Fade out shortly before unmount.
    opacity.value = withDelay(totalDuration - 300, withTiming(0, { duration: 300 }));

    const timeout = setTimeout(onDone, totalDuration);
    return () => clearTimeout(timeout);
  }, [isCard, reducedMotion, totalDuration, onDone, opacity, scale, wobble]);

  const bannerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { rotate: `${-4 + wobble.value}deg` }],
  }));

  return (
    <View style={styles.overlay} pointerEvents="none">
      {isCard ? (
        <>
          <ConfettiBurst count={16} origin={{ top: '30%', left: '30%' }} />
          <DelayedBurst delay={250} origin={{ top: '25%', left: '70%' }} />
          <DelayedBurst delay={500} origin={{ top: '45%', left: '50%' }} />
        </>
      ) : (
        <ConfettiBurst origin={{ top: '40%', left: '50%' }} />
      )}

      <Animated.View
        style={[styles.banner, { backgroundColor: theme.secondary }, CardShadow, bannerStyle]}
        accessibilityLiveRegion="assertive"
        accessibilityLabel={isCard ? 'Volle kaart!' : `Bingo! ${LINE_SUBTITLES[celebration.kind === 'line' ? celebration.line.kind : 'row']}`}>
        <ThemedText type="title" style={[styles.bannerTitle, { color: theme.gold }]}>
          {isCard ? 'VOLLE KAART! 🏆' : 'BINGO!'}
        </ThemedText>
        {!isCard && celebration.kind === 'line' && (
          <ThemedText type="smallBold" style={{ color: theme.onBrand }}>
            {LINE_SUBTITLES[celebration.line.kind]}
          </ThemedText>
        )}
      </Animated.View>
    </View>
  );
}

function DelayedBurst({ delay, origin }: { delay: number; origin: { top: DimensionValue; left: DimensionValue } }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  return visible ? <ConfettiBurst count={16} origin={origin} /> : null;
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  banner: {
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.five,
    paddingVertical: Spacing.three,
    borderRadius: Radius.card,
    borderCurve: 'continuous',
  },
  bannerTitle: {
    fontSize: 34,
    lineHeight: 40,
  },
});
