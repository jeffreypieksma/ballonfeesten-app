import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { balloonImages } from '@/components/bingo/balloon-images';
import { ThemedText } from '@/components/themed-text';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Radius, Spacing } from '@/constants/theme';
import { useFloatAnimation } from '@/hooks/use-float-animation';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useTheme } from '@/hooks/use-theme';
import { triggerHaptic } from '@/lib/haptics';
import { categoryMeta } from '@/lib/bingo';
import type { BingoTile } from '@/types/bingo';

type BingoConfirmSheetProps = {
  tile: BingoTile;
  /** Already spotted → the sheet becomes the un-spot flow. */
  spotted: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

/** Playful spot/un-spot confirmation, rendered in the shared BottomSheet shell. */
export function BingoConfirmSheet({ tile, spotted, onConfirm, onClose }: BingoConfirmSheetProps) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const floatStyle = useFloatAnimation(6, 2200);
  const meta = categoryMeta(tile.category);
  const photo = balloonImages[tile.id];

  const handleConfirm = () => {
    triggerHaptic(spotted ? 'light' : 'success');
    onConfirm();
  };

  return (
    <BottomSheet onClose={onClose}>
      {photo ? (
        <Image
          source={photo}
          style={styles.photo}
          contentFit="cover"
          transition={200}
          accessibilityIgnoresInvertColors
          accessibilityLabel={`Foto van ${tile.name}`}
        />
      ) : (
        <Animated.View style={reducedMotion ? undefined : floatStyle}>
          <ThemedText style={styles.emoji} accessibilityElementsHidden>
            {tile.emoji}
          </ThemedText>
        </Animated.View>
      )}

      <ThemedText type="hero" style={styles.name}>
        {tile.name}
      </ThemedText>

      <View style={[styles.categoryChip, { backgroundColor: theme.backgroundElement }]}>
        <ThemedText type="small" style={{ color: theme[meta.colorRole], fontWeight: '700' }}>
          {meta.emoji} {meta.label}
        </ThemedText>
      </View>

      {tile.funFact && (
        <ThemedText type="small" themeColor="textSecondary" style={styles.funFact}>
          {tile.funFact}
        </ThemedText>
      )}

      {tile.points != null && !spotted && (
        <ThemedText type="smallBold" style={{ color: theme.gold }}>
          +{tile.points} punten
        </ThemedText>
      )}

      {spotted ? (
        <>
          <ThemedText type="smallBold" style={styles.question}>
            Toch niet gespot?
          </ThemedText>
          <Pressable
            onPress={handleConfirm}
            accessibilityRole="button"
            accessibilityLabel={`Spot van ${tile.name} verwijderen`}
            style={[styles.primaryButton, { backgroundColor: theme.backgroundElement }]}>
            <ThemedText type="smallBold" style={{ color: theme.primary }}>
              Spot verwijderen
            </ThemedText>
          </Pressable>
          <Pressable onPress={onClose} accessibilityRole="button" hitSlop={8}>
            <ThemedText type="link" themeColor="textSecondary">
              Laat maar staan
            </ThemedText>
          </Pressable>
        </>
      ) : (
        <>
          <Pressable
            onPress={handleConfirm}
            accessibilityRole="button"
            accessibilityLabel={`${tile.name} als gespot markeren`}
            style={[styles.primaryButton, { backgroundColor: theme.primary }]}>
            <ThemedText type="smallBold" style={{ color: theme.onBrand }}>
              Ja, gespot! 🎈
            </ThemedText>
          </Pressable>
          <Pressable onPress={onClose} accessibilityRole="button" hitSlop={8}>
            <ThemedText type="link" themeColor="textSecondary">
              Nog niet
            </ThemedText>
          </Pressable>
        </>
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  emoji: {
    fontSize: 64,
    lineHeight: 76,
  },
  photo: {
    width: 160,
    height: 160,
    borderRadius: Radius.card,
    borderCurve: 'continuous',
  },
  name: {
    textAlign: 'center',
  },
  categoryChip: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Radius.pill,
    borderCurve: 'continuous',
  },
  funFact: {
    textAlign: 'center',
  },
  question: {
    marginTop: Spacing.one,
  },
  primaryButton: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.five,
    borderRadius: Radius.pill,
    borderCurve: 'continuous',
    marginTop: Spacing.one,
  },
});
