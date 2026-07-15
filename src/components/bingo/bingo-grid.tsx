import { StyleSheet, View } from 'react-native';

import { BingoTile } from '@/components/bingo/bingo-tile';
import { Spacing } from '@/constants/theme';
import type { BingoCard, BingoLine, BingoTile as BingoTileType } from '@/types/bingo';

type BingoGridProps = {
  card: BingoCard;
  spottedIds: string[];
  completedLines: BingoLine[];
  lastSpottedId: string | null;
  onPressTile: (tile: BingoTileType) => void;
};

/** Fixed 3×3 — plain View rows, no list virtualization needed. */
export function BingoGrid({ card, spottedIds, completedLines, lastSpottedId, onPressTile }: BingoGridProps) {
  const spotted = new Set(spottedIds);
  const lineIndexes = new Set(completedLines.flatMap((line) => line.indexes));

  const rows = [card.tiles.slice(0, 3), card.tiles.slice(3, 6), card.tiles.slice(6, 9)];

  return (
    <View style={styles.grid} accessibilityLabel={`Bingokaart: ${card.title}`}>
      {rows.map((rowTiles, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {rowTiles.map((tile, colIndex) => (
            <BingoTile
              key={tile.id}
              tile={tile}
              spotted={spotted.has(tile.id)}
              inCompletedLine={lineIndexes.has(rowIndex * 3 + colIndex)}
              justSpotted={tile.id === lastSpottedId}
              onPress={onPressTile}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
});
