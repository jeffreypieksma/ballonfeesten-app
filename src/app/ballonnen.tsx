import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BalloonCard } from '@/components/balloons/balloon-card';
import { BalloonDetailSheet } from '@/components/balloons/balloon-detail-sheet';
import { BalloonsSkeleton } from '@/components/balloons/balloons-skeleton';
import { CategoryFilter, type CategorySelection } from '@/components/balloons/category-filter';
import { ErrorBanner } from '@/components/home/error-banner';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useBalloons } from '@/hooks/use-balloons';
import type { Balloon } from '@/lib/balloons';
import { triggerHaptic } from '@/lib/haptics';

export default function BallonnenScreen() {
  const insets = useSafeAreaInsets();
  const balloons = useBalloons();

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.three }]}>
        <ThemedText type="hero" themeColor="primary">
          Ballonnen
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          De sterren van het festival · Special shapes en meer
        </ThemedText>
      </View>

      {balloons.status === 'loading' && <BalloonsSkeleton />}

      {balloons.status === 'error' && (
        <View style={styles.errorWrap}>
          <ErrorBanner message="De ballonnen konden niet worden geladen." onRetry={balloons.retry} />
        </View>
      )}

      {balloons.status === 'ready' && (
        <BallonnenReady
          balloons={balloons.balloons}
          spottedIds={balloons.spottedIds}
          bottomInset={insets.bottom + BottomTabInset + Spacing.six}
        />
      )}
    </ThemedView>
  );
}

function BallonnenReady({
  balloons,
  spottedIds,
  bottomInset,
}: {
  balloons: Balloon[];
  spottedIds: string[];
  bottomInset: number;
}) {
  const [category, setCategory] = useState<CategorySelection>('alle');
  const [selectedBalloon, setSelectedBalloon] = useState<Balloon | null>(null);

  const spotted = new Set(spottedIds);
  const visible = category === 'alle' ? balloons : balloons.filter((balloon) => balloon.category === category);

  // Explicit rows of 2 (with a filler on odd counts) so every card is the same size.
  const rows: Balloon[][] = [];
  for (let i = 0; i < visible.length; i += 2) {
    rows.push(visible.slice(i, i + 2));
  }

  const handlePressCard = (balloon: Balloon) => {
    triggerHaptic('light');
    setSelectedBalloon(balloon);
  };

  return (
    <>
      <CategoryFilter balloons={balloons} selected={category} onSelect={setCategory} />

      <ScrollView
        style={styles.list}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: bottomInset }]}>
        {visible.length > 0 ? (
          <View style={styles.grid}>
            {rows.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.gridRow}>
                {row.map((balloon) => (
                  <BalloonCard
                    key={balloon.id}
                    balloon={balloon}
                    spotted={spotted.has(balloon.id)}
                    onPress={handlePressCard}
                  />
                ))}
                {row.length === 1 && <View style={styles.gridFiller} />}
              </View>
            ))}
          </View>
        ) : (
          <ThemedText type="small" themeColor="textSecondary" style={styles.empty}>
            Geen ballonnen in deze categorie.
          </ThemedText>
        )}
      </ScrollView>

      {selectedBalloon && (
        <BalloonDetailSheet
          balloon={selectedBalloon}
          spotted={spotted.has(selectedBalloon.id)}
          onGoToBingo={() => {
            setSelectedBalloon(null);
            router.push('/bingo');
          }}
          onClose={() => setSelectedBalloon(null)}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.two,
    gap: 2,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  errorWrap: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  list: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  grid: {
    gap: Spacing.two,
  },
  gridRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  gridFiller: {
    flex: 1,
  },
  empty: {
    textAlign: 'center',
    paddingTop: Spacing.five,
  },
});
