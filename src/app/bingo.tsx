import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BingoCelebration } from '@/components/bingo/bingo-celebration';
import { BingoConfirmSheet } from '@/components/bingo/bingo-confirm-sheet';
import { BingoGrid } from '@/components/bingo/bingo-grid';
import { BingoProgressHeader } from '@/components/bingo/bingo-progress-header';
import { BingoSkeleton } from '@/components/bingo/bingo-skeleton';
import { DevBingoTools } from '@/components/bingo/dev-bingo-tools';
import { ErrorBanner } from '@/components/home/error-banner';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useBingo, type BingoState } from '@/hooks/use-bingo';
import { triggerHaptic } from '@/lib/haptics';
import type { BingoTile } from '@/types/bingo';

export default function BingoScreen() {
  const insets = useSafeAreaInsets();
  const bingo = useBingo();

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.three }]}>
        <ThemedText type="hero" themeColor="primary">
          Ballonbingo
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Spot de ballonnen boven Joure · 9 vakken
        </ThemedText>
      </View>

      {bingo.status === 'loading' && <BingoSkeleton />}

      {bingo.status === 'error' && (
        <View style={styles.errorWrap}>
          <ErrorBanner message="De bingokaart kon niet worden geladen." onRetry={bingo.retry} />
        </View>
      )}

      {bingo.status === 'ready' && (
        <BingoReady
          bingo={bingo}
          bottomInset={insets.bottom + BottomTabInset + Spacing.six}
          devBottomOffset={insets.bottom + BottomTabInset + Spacing.two}
        />
      )}
    </ThemedView>
  );
}

function BingoReady({
  bingo,
  bottomInset,
  devBottomOffset,
}: {
  bingo: Extract<BingoState, { status: 'ready' }>;
  bottomInset: number;
  devBottomOffset: number;
}) {
  const [selectedTile, setSelectedTile] = useState<BingoTile | null>(null);

  const handlePressTile = (tile: BingoTile) => {
    triggerHaptic('light');
    setSelectedTile(tile);
  };

  const handleConfirm = () => {
    if (selectedTile) bingo.toggleSpot(selectedTile.id);
    setSelectedTile(null);
  };

  return (
    <>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: bottomInset }]}>
        <BingoProgressHeader
          found={bingo.spottedIds.length}
          total={bingo.card.tiles.length}
          isComplete={bingo.isComplete}
          completedLineCount={bingo.completedLines.length}
        />

        <BingoGrid
          card={bingo.card}
          spottedIds={bingo.spottedIds}
          completedLines={bingo.completedLines}
          lastSpottedId={bingo.lastSpottedId}
          onPressTile={handlePressTile}
        />

        <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>
          Tik op een vak zodra je de ballon ziet.
        </ThemedText>
      </ScrollView>

      {selectedTile && (
        <BingoConfirmSheet
          tile={selectedTile}
          spotted={bingo.spottedIds.includes(selectedTile.id)}
          onConfirm={handleConfirm}
          onClose={() => setSelectedTile(null)}
        />
      )}

      {bingo.celebration && (
        <BingoCelebration
          key={bingo.celebration.key}
          celebration={bingo.celebration}
          onDone={bingo.dismissCelebration}
        />
      )}

      {__DEV__ && (
        <DevBingoTools
          card={bingo.card}
          onSetSpottedIds={bingo.setSpottedIds}
          onReset={bingo.resetProgress}
          bottomOffset={devBottomOffset}
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
  content: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    gap: Spacing.three,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  hint: {
    textAlign: 'center',
  },
});
