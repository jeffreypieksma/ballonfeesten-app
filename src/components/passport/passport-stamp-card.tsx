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
import { formatSpotMoment } from '@/lib/format-date';

type PassportStampCardProps = {
  balloon: Balloon;
  /** ISO moment; absent for migrated progress ("Eerder gespot"). */
  spottedAt?: string;
  /** Index in the grid — drives the alternating hand-stamped rotation. */
  index: number;
  onPress: (balloon: Balloon) => void;
};

/** A collected stamp: photo with the dashed red stamp frame, name and spot moment. */
export function PassportStampCard({ balloon, spottedAt, index, onPress }: PassportStampCardProps) {
  const theme = useTheme();
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();
  const meta = categoryMeta(balloon.category);
  const photo = balloonImages[balloon.id];
  const rotation = index % 2 === 0 ? '-3deg' : '2deg';
  const moment = spottedAt ? formatSpotMoment(spottedAt) : null;
  const momentLabel = moment ? `Gespot op ${moment}` : 'Eerder gespot';

  return (
    <Pressable
      onPress={() => onPress(balloon)}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole="button"
      accessibilityLabel={`Stempel: ${balloon.name}, ${meta.label}. ${momentLabel}. Tik voor details.`}
      style={styles.pressable}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <View style={[styles.stampFrame, { borderColor: theme.stampBrown, transform: [{ rotate: rotation }] }]}>
          {photo ? (
            <Image source={photo} style={styles.photo} contentFit="cover" transition={150} accessibilityIgnoresInvertColors />
          ) : (
            <View style={[styles.emojiWrap, { backgroundColor: theme.backgroundElement }]}>
              <ThemedText style={styles.emoji} accessibilityElementsHidden>
                {balloon.emoji}
              </ThemedText>
            </View>
          )}
          <View style={[styles.gespotRibbon, { backgroundColor: theme.primarySoft, borderColor: theme.stampBrown }]}>
            <ThemedText type="smallBold" style={[styles.gespotText, { color: theme.stampBrown }]}>
              GESPOT
            </ThemedText>
          </View>
        </View>

        <ThemedText type="smallBold" style={styles.name} numberOfLines={1}>
          {balloon.name}
        </ThemedText>
        <ThemedText type="small" style={[styles.category, { color: theme[meta.colorRole] }]} numberOfLines={1}>
          {meta.label}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.moment} numberOfLines={1}>
          {momentLabel}
        </ThemedText>
      </Animated.View>
    </Pressable>
  );
}

/** A locked slot: dotted frame with the real balloon photo, dimmed until spotted. */
export function PassportLockedSlot({ balloon }: { balloon: Balloon }) {
  const theme = useTheme();
  const photo = balloonImages[balloon.id];

  return (
    <View style={styles.pressable} accessibilityLabel={`${balloon.name}: nog niet gespot`}>
      <View style={styles.card}>
        <View style={[styles.lockedFrame, { borderColor: theme.backgroundSelected }]}>
          {photo ? (
            <Image
              source={photo}
              style={styles.lockedPhoto}
              contentFit="cover"
              transition={150}
              accessibilityIgnoresInvertColors
            />
          ) : (
            <ThemedText style={[styles.emoji, styles.lockedEmoji]} accessibilityElementsHidden>
              {balloon.emoji}
            </ThemedText>
          )}
        </View>
        <ThemedText type="smallBold" themeColor="textSecondary" style={styles.name} numberOfLines={1}>
          {balloon.name}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.moment}>
          Nog niet gespot
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
  },
  card: {
    alignItems: 'center',
    gap: 2,
  },
  stampFrame: {
    width: '100%',
    aspectRatio: 1,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: Radius.chip,
    borderCurve: 'continuous',
    padding: Spacing.half,
    marginBottom: Spacing.half,
  },
  photo: {
    flex: 1,
    borderRadius: Radius.chip - 4,
  },
  emojiWrap: {
    flex: 1,
    borderRadius: Radius.chip - 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 36,
    lineHeight: 44,
  },
  gespotRibbon: {
    position: 'absolute',
    top: Spacing.one,
    right: -Spacing.one,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: Radius.chip,
    borderCurve: 'continuous',
    paddingHorizontal: Spacing.one,
    paddingVertical: 1,
    transform: [{ rotate: '6deg' }],
  },
  gespotText: {
    fontSize: 10,
    letterSpacing: 0.8,
  },
  name: {
    fontSize: 13,
    lineHeight: 17,
    textAlign: 'center',
  },
  category: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  moment: {
    fontSize: 11,
    lineHeight: 14,
    textAlign: 'center',
  },
  lockedFrame: {
    width: '100%',
    aspectRatio: 1,
    borderWidth: 2,
    borderStyle: 'dotted',
    borderRadius: Radius.chip,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.half,
    marginBottom: Spacing.half,
  },
  lockedPhoto: {
    width: '100%',
    height: '100%',
    borderRadius: Radius.chip - 4,
    opacity: 0.35,
  },
  lockedEmoji: {
    opacity: 0.25,
  },
});
