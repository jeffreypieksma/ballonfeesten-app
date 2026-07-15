import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { balloonImages } from '@/components/bingo/balloon-images';
import { ThemedText } from '@/components/themed-text';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Balloon } from '@/lib/balloons';
import { categoryMeta } from '@/lib/bingo';
import { triggerHaptic } from '@/lib/haptics';

type BalloonDetailSheetProps = {
  balloon: Balloon;
  spotted: boolean;
  /** "Spot 'm in de Bingo" pressed — parent closes the sheet and navigates. */
  onGoToBingo: () => void;
  onClose: () => void;
};

export function BalloonDetailSheet({ balloon, spotted, onGoToBingo, onClose }: BalloonDetailSheetProps) {
  const theme = useTheme();
  const meta = categoryMeta(balloon.category);
  const photo = balloonImages[balloon.id];

  return (
    <BottomSheet onClose={onClose}>
      {photo ? (
        <Image
          source={photo}
          style={styles.photo}
          contentFit="cover"
          transition={200}
          accessibilityIgnoresInvertColors
          accessibilityLabel={`Foto van ${balloon.name}`}
        />
      ) : (
        <ThemedText style={styles.emoji} accessibilityElementsHidden>
          {balloon.emoji}
        </ThemedText>
      )}

      <ThemedText type="hero" style={styles.name}>
        {balloon.name}
      </ThemedText>

      <View style={[styles.categoryChip, { backgroundColor: theme.backgroundElement }]}>
        <ThemedText type="small" style={{ color: theme[meta.colorRole], fontWeight: '700' }}>
          {meta.emoji} {meta.label}
        </ThemedText>
      </View>

      {balloon.funFact && (
        <ThemedText type="small" themeColor="textSecondary" style={styles.funFact}>
          {balloon.funFact}
        </ThemedText>
      )}

      {spotted ? (
        <View style={[styles.spottedChip, { backgroundColor: theme.goldSoft }]}>
          <ThemedText type="smallBold" style={{ color: theme.secondary }}>
            ✓ Gespot in jouw Ballonbingo
          </ThemedText>
        </View>
      ) : (
        <>
          {balloon.points != null && (
            <ThemedText type="smallBold" style={{ color: theme.gold }}>
              +{balloon.points} punten in de Bingo
            </ThemedText>
          )}
          <Pressable
            onPress={() => {
              triggerHaptic('medium');
              onGoToBingo();
            }}
            accessibilityRole="button"
            accessibilityLabel={`${balloon.name} spotten in de Ballonbingo`}
            style={[styles.primaryButton, { backgroundColor: theme.primary }]}>
            <ThemedText type="smallBold" style={{ color: theme.onBrand }}>
              Spot ’m in de Bingo 🎈
            </ThemedText>
          </Pressable>
        </>
      )}

      <Pressable onPress={onClose} accessibilityRole="button" hitSlop={8}>
        <ThemedText type="link" themeColor="textSecondary">
          Sluiten
        </ThemedText>
      </Pressable>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  photo: {
    width: '100%',
    height: 220,
    borderRadius: Radius.card,
    borderCurve: 'continuous',
  },
  emoji: {
    fontSize: 64,
    lineHeight: 76,
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
  spottedChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Radius.pill,
    borderCurve: 'continuous',
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
