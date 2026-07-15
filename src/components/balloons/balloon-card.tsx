import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { balloonImages } from '@/components/bingo/balloon-images';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { usePressScale } from '@/hooks/use-press-scale';
import { useTheme } from '@/hooks/use-theme';
import type { Balloon } from '@/lib/balloons';
import { categoryMeta } from '@/lib/bingo';

type BalloonCardProps = {
  balloon: Balloon;
  spotted: boolean;
  onPress: (balloon: Balloon) => void;
};

export function BalloonCard({ balloon, spotted, onPress }: BalloonCardProps) {
  const theme = useTheme();
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();
  const meta = categoryMeta(balloon.category);
  const photo = balloonImages[balloon.id];

  return (
    <Pressable
      onPress={() => onPress(balloon)}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole="button"
      accessibilityLabel={`${balloon.name}, ${meta.label}${spotted ? ', gespot' : ''}. Tik voor details.`}
      style={styles.pressable}>
      <Animated.View style={[styles.card, { backgroundColor: theme.backgroundElement }, animatedStyle]}>
        {photo ? (
          <Image
            source={photo}
            style={styles.photo}
            contentFit="cover"
            transition={150}
            accessibilityIgnoresInvertColors
          />
        ) : (
          <View style={styles.emojiWrap}>
            <ThemedText style={styles.emoji} accessibilityElementsHidden>
              {balloon.emoji}
            </ThemedText>
          </View>
        )}

        <View style={styles.scrim}>
          <ThemedText type="smallBold" style={styles.name} numberOfLines={1}>
            {balloon.name}
          </ThemedText>
          <ThemedText type="small" style={[styles.category, { color: theme.goldSoft }]} numberOfLines={1}>
            {meta.label}
          </ThemedText>
        </View>

        {spotted && (
          <View style={[styles.badge, { borderColor: theme.stampBrown, backgroundColor: theme.primarySoft }]}>
            <ThemedText type="smallBold" style={[styles.badgeText, { color: theme.stampBrown }]}>
              GESPOT
            </ThemedText>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
  },
  card: {
    aspectRatio: 3 / 4,
    borderRadius: Radius.card,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  photo: {
    ...StyleSheet.absoluteFill,
  },
  emojiWrap: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 56,
    lineHeight: 68,
  },
  scrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(6, 20, 38, 0.6)',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    gap: 1,
    alignItems: 'center',
  },
  name: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center',
  },
  category: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    top: Spacing.two,
    right: Spacing.two,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: Radius.chip,
    borderCurve: 'continuous',
    paddingHorizontal: Spacing.one,
    paddingVertical: 2,
    transform: [{ rotate: '-8deg' }],
  },
  badgeText: {
    fontSize: 11,
    letterSpacing: 0.8,
  },
});
