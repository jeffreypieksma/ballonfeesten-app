import { Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CardShadow, Radius, Spacing } from '@/constants/theme';
import { usePressScale } from '@/hooks/use-press-scale';
import type { FeaturedBalloon } from '@/types/home';

type FeaturedBalloonCardProps = {
  balloon: FeaturedBalloon;
  onPress: () => void;
};

export function FeaturedBalloonCard({ balloon, onPress }: FeaturedBalloonCardProps) {
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole="button"
      accessibilityLabel={`Ballon van de dag: ${balloon.name}, ${balloon.category}, ${balloon.points} punten. ${
        balloon.spotted ? 'Al gespot.' : 'Nog niet gespot.'
      }`}>
      <Animated.View style={animatedStyle}>
        <ThemedView type="backgroundElement" style={[styles.card, CardShadow]}>
          <ThemedText style={styles.emoji}>🎈</ThemedText>
          <View style={styles.textColumn}>
            <ThemedText type="small" themeColor="textSecondary">
              Ballon van de dag
            </ThemedText>
            <ThemedText type="smallBold">{balloon.name}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {balloon.category} · {balloon.points} punten
            </ThemedText>
            <ThemedText type="small" numberOfLines={2}>
              {balloon.funFact}
            </ThemedText>
            <View style={styles.footerRow}>
              <ThemedText type="small" style={styles.statusText} accessibilityElementsHidden={false}>
                {balloon.spotted ? '✓ Gespot' : 'Nog niet gespot'}
              </ThemedText>
              <ThemedText type="link" themeColor="accent">
                {balloon.spotted ? 'Bekijk ballon' : 'Probeer deze te spotten'}
              </ThemedText>
            </View>
          </View>
        </ThemedView>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.card,
    borderCurve: 'continuous',
    padding: Spacing.three,
    flexDirection: 'row',
    gap: Spacing.two,
  },
  emoji: {
    fontSize: 40,
    lineHeight: 48,
  },
  textColumn: {
    flex: 1,
    gap: 2,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.one,
  },
  statusText: {
    fontWeight: '700',
  },
});
