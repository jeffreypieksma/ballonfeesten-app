import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { FloatingBalloonIllustration } from '@/components/home/floating-balloon-illustration';
import { ThemedText } from '@/components/themed-text';
import { CardShadow, Radius, Spacing } from '@/constants/theme';
import { usePressScale } from '@/hooks/use-press-scale';
import { useTheme } from '@/hooks/use-theme';
import { triggerHaptic } from '@/lib/haptics';
import type { BingoProgress } from '@/types/home';

type BingoHeroCardProps = {
  progress: BingoProgress;
  isNewUser: boolean;
  onPressStart: () => void;
};

export function BingoHeroCard({ progress, isNewUser, onPressStart }: BingoHeroCardProps) {
  const theme = useTheme();
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();
  const fillWidth = useSharedValue(0);
  const pct = progress.total > 0 ? progress.found / progress.total : 0;

  useEffect(() => {
    fillWidth.value = withTiming(pct, { duration: 600 });
  }, [pct, fillWidth]);

  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${fillWidth.value * 100}%`,
  }));

  const remaining = progress.total - progress.found;
  const progressLabel = isNewUser
    ? 'Nog geen ballon gespot — begin je eerste rij!'
    : remaining === 1
      ? `Nog één spot voor een volle rij`
      : `${progress.found} van ${progress.total} vakken gevonden`;

  const buttonLabel = isNewUser ? 'Start je eerste Bingo' : progress.found > 0 ? 'Ga verder met Bingo' : 'Start Ballonbingo';

  const handlePress = () => {
    triggerHaptic('medium');
    onPressStart();
  };

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole="button"
      accessibilityLabel={`Ballonbingo. ${progressLabel}. ${buttonLabel}`}>
      <Animated.View
        style={[styles.card, { backgroundColor: theme.skyTop }, CardShadow, animatedStyle]}>
        <View style={styles.textColumn}>
          <ThemedText
            type="hero"
            style={styles.title}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}>
            Ballonbingo
          </ThemedText>
          <ThemedText type="small" style={styles.subtitle}>
            Spot de ballonnen boven Joure en vul je paspoort.
          </ThemedText>

          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { backgroundColor: theme.sunrise }, progressBarStyle]} />
          </View>
          <ThemedText type="small" style={styles.progressLabel} accessibilityLiveRegion="polite">
            {progressLabel}
          </ThemedText>

          {!isNewUser && (
            <ThemedText type="smallBold" style={styles.bonus}>
              +25 punten voor een Special Shape
            </ThemedText>
          )}

          {/* Visual only — the whole card is the pressable, so nesting a second
              button here would emit invalid nested <button> markup on web. */}
          <View style={[styles.button, { backgroundColor: theme.primary }]}>
            <ThemedText type="smallBold" style={styles.buttonText}>
              {buttonLabel}
            </ThemedText>
          </View>
        </View>

        <FloatingBalloonIllustration />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.card,
    borderCurve: 'continuous',
    padding: Spacing.four,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  textColumn: {
    flex: 1,
    gap: Spacing.one,
  },
  title: {
    color: '#ffffff',
  },
  subtitle: {
    color: '#ffffff',
    opacity: 0.9,
  },
  progressTrack: {
    height: 8,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(255,255,255,0.3)',
    overflow: 'hidden',
    marginTop: Spacing.two,
  },
  progressFill: {
    height: '100%',
    borderRadius: Radius.pill,
  },
  progressLabel: {
    color: '#ffffff',
    marginTop: Spacing.half,
  },
  bonus: {
    color: '#FFE9C4',
    marginTop: Spacing.half,
  },
  button: {
    marginTop: Spacing.three,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
    borderRadius: Radius.pill,
    borderCurve: 'continuous',
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#ffffff',
  },
});
