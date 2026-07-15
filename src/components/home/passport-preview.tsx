import { Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { PassportStamp } from '@/components/home/passport-stamp';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CardShadow, Radius, Spacing } from '@/constants/theme';
import { usePressScale } from '@/hooks/use-press-scale';
import type { BalloonCollection, PassportStamp as PassportStampType } from '@/types/home';

type PassportPreviewProps = {
  lastStamp: PassportStampType;
  collection: BalloonCollection;
  justStamped?: boolean;
  onPress: () => void;
};

export function PassportPreview({ lastStamp, collection, justStamped, onPress }: PassportPreviewProps) {
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();
  const lockedCount = Math.min(4, collection.total - collection.count);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole="button"
      accessibilityLabel={`Ballonpaspoort. ${collection.count} van ${collection.total} ballonnen verzameld. Bekijk mijn paspoort.`}>
      <Animated.View style={animatedStyle}>
        <ThemedView type="backgroundElement" style={[styles.card, CardShadow]}>
          <View style={styles.row}>
            <PassportStamp stamp={lastStamp} justStamped={justStamped} />

            <View style={styles.silhouettes}>
              {Array.from({ length: lockedCount }).map((_, index) => (
                <ThemedText key={index} style={styles.silhouette} accessibilityElementsHidden>
                  🎈
                </ThemedText>
              ))}
            </View>
          </View>

          <ThemedText type="smallBold" style={styles.count}>
            {collection.count} van {collection.total} ballonnen verzameld
          </ThemedText>
          <ThemedText type="link" themeColor="accent">
            Bekijk mijn paspoort
          </ThemedText>
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
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  silhouettes: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
  },
  silhouette: {
    fontSize: 22,
    lineHeight: 28,
    opacity: 0.25,
  },
  count: {
    marginTop: Spacing.half,
  },
});
