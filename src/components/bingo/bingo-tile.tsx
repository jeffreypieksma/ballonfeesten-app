import { Image } from 'expo-image';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { balloonImages } from '@/components/bingo/balloon-images';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { usePressScale } from '@/hooks/use-press-scale';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useTheme } from '@/hooks/use-theme';
import { categoryMeta } from '@/lib/bingo';
import type { BingoTile as BingoTileType } from '@/types/bingo';

type BingoTileProps = {
  tile: BingoTileType;
  spotted: boolean;
  /** Tile is part of a completed BINGO line → gold glow. */
  inCompletedLine: boolean;
  /** Freshly spotted this session → stamp slams down. */
  justSpotted: boolean;
  onPress: (tile: BingoTileType) => void;
};

export function BingoTile({ tile, spotted, inCompletedLine, justSpotted, onPress }: BingoTileProps) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();
  const meta = categoryMeta(tile.category);
  const photo = balloonImages[tile.id];

  // 0 → stamp mid-slam (big, tilted), 1 → settled. Starts settled unless fresh.
  const stamp = useSharedValue(justSpotted && !reducedMotion ? 0 : 1);
  const glow = useSharedValue(inCompletedLine ? 1 : 0);

  useEffect(() => {
    if (justSpotted && !reducedMotion) {
      stamp.value = 0;
      stamp.value = withSpring(1, { damping: 8 });
    }
  }, [justSpotted, reducedMotion, stamp]);

  useEffect(() => {
    glow.value = reducedMotion
      ? inCompletedLine
        ? 1
        : 0
      : withTiming(inCompletedLine ? 1 : 0, { duration: 300 });
  }, [inCompletedLine, reducedMotion, glow]);

  const stampStyle = useAnimatedStyle(() => ({
    opacity: interpolate(stamp.value, [0, 0.4, 1], [0, 1, 1]),
    transform: [
      { scale: interpolate(stamp.value, [0, 1], [1.6, 1]) },
      { rotate: `${interpolate(stamp.value, [0, 1], [-14, -8])}deg` },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    borderColor: theme.gold,
    borderWidth: 2,
    opacity: glow.value,
  }));

  const a11yLabel = spotted
    ? `${tile.name}, ${meta.label}, gespot. Tik om te bekijken.`
    : `${tile.name}, ${meta.label}, nog niet gespot. Tik om te spotten.`;

  return (
    <Pressable
      onPress={() => onPress(tile)}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole="button"
      accessibilityState={{ selected: spotted }}
      accessibilityLabel={a11yLabel}
      style={styles.pressable}>
      <Animated.View
        style={[
          styles.tile,
          {
            backgroundColor: inCompletedLine
              ? theme.goldSoft
              : spotted
                ? theme.primarySoft
                : theme.backgroundElement,
          },
          animatedStyle,
        ]}>
        {photo ? (
          <>
            <Image
              source={photo}
              style={[styles.photo, spotted && styles.photoSpotted]}
              contentFit="cover"
              transition={150}
              accessibilityIgnoresInvertColors
            />
            <View style={styles.scrim}>
              <ThemedText type="smallBold" style={styles.photoName} numberOfLines={2} adjustsFontSizeToFit>
                {tile.name}
              </ThemedText>
            </View>
          </>
        ) : (
          <View style={[styles.content, spotted && styles.contentSpotted]}>
            <ThemedText style={styles.emoji} accessibilityElementsHidden>
              {tile.emoji}
            </ThemedText>
            <ThemedText type="smallBold" style={styles.name} numberOfLines={2} adjustsFontSizeToFit>
              {tile.name}
            </ThemedText>
            <ThemedText type="small" style={[styles.category, { color: theme[meta.colorRole] }]} numberOfLines={1}>
              {meta.label}
            </ThemedText>
          </View>
        )}

        {spotted && (
          <Animated.View
            style={[styles.stamp, { borderColor: theme.stampBrown, backgroundColor: theme.primarySoft }, stampStyle]}>
            <ThemedText type="smallBold" style={[styles.stampText, { color: theme.stampBrown }]}>
              GESPOT
            </ThemedText>
          </Animated.View>
        )}

        <Animated.View style={[styles.glowBorder, glowStyle]} pointerEvents="none" />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
  },
  tile: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: Radius.chip,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photo: {
    ...StyleSheet.absoluteFill,
  },
  photoSpotted: {
    opacity: 0.4,
  },
  scrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(6, 20, 38, 0.55)',
    paddingHorizontal: Spacing.one,
    paddingVertical: Spacing.half,
  },
  photoName: {
    color: '#ffffff',
    fontSize: 11,
    lineHeight: 14,
    textAlign: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 2,
    padding: Spacing.one,
  },
  contentSpotted: {
    opacity: 0.55,
  },
  emoji: {
    fontSize: 30,
    lineHeight: 38,
  },
  name: {
    fontSize: 12,
    lineHeight: 15,
    textAlign: 'center',
  },
  category: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  stamp: {
    position: 'absolute',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: Radius.chip,
    borderCurve: 'continuous',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
  },
  stampText: {
    letterSpacing: 1,
    fontSize: 13,
  },
  glowBorder: {
    ...StyleSheet.absoluteFill,
    borderRadius: Radius.chip,
    borderCurve: 'continuous',
  },
});
