import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { triggerHaptic } from '@/lib/haptics';
import type { BingoCard } from '@/types/bingo';

type DevBingoToolsProps = {
  card: BingoCard;
  onSetSpottedIds: (ids: string[]) => void;
  onReset: () => void;
  bottomOffset: number;
};

/** Dev-only collapsible pill (same pattern as dev-time-travel) to demo celebrations. */
export function DevBingoTools({ card, onSetSpottedIds, onReset, bottomOffset }: DevBingoToolsProps) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const tileIds = card.tiles.map((tile) => tile.id);
  const actions: { label: string; run: () => void }[] = [
    { label: 'Reset', run: onReset },
    { label: 'Rij', run: () => onSetSpottedIds(tileIds.slice(0, 3)) },
    { label: 'Bijna', run: () => onSetSpottedIds(tileIds.slice(0, 8)) },
    { label: 'Vol', run: () => onSetSpottedIds(tileIds) },
  ];

  if (!open) {
    return (
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel="Ontwikkelaars: bingo-hulpmiddelen openen"
        style={[styles.handle, { bottom: bottomOffset, backgroundColor: theme.accent }]}>
        <ThemedText type="small" style={styles.handleText}>
          🎯 Bingo dev
        </ThemedText>
      </Pressable>
    );
  }

  return (
    <ThemedView
      type="backgroundElement"
      style={[styles.container, { bottom: bottomOffset }]}
      accessibilityLabel="Ontwikkelaars: bingo-hulpmiddelen">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {actions.map((action) => (
          <Pressable
            key={action.label}
            onPress={() => {
              triggerHaptic('light');
              action.run();
              setOpen(false);
            }}
            accessibilityRole="button"
            accessibilityLabel={action.label}
            style={[styles.chip, { backgroundColor: theme.backgroundSelected }]}>
            <ThemedText type="small">{action.label}</ThemedText>
          </Pressable>
        ))}
      </ScrollView>
      <Pressable
        onPress={() => setOpen(false)}
        accessibilityRole="button"
        accessibilityLabel="Sluiten"
        hitSlop={8}
        style={[styles.close, { backgroundColor: theme.backgroundSelected }]}>
        <ThemedText type="small">✕</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  handle: {
    position: 'absolute',
    left: Spacing.three,
    paddingVertical: Spacing.half,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.pill,
    borderCurve: 'continuous',
    opacity: 0.9,
  },
  handleText: {
    color: '#ffffff',
  },
  container: {
    position: 'absolute',
    left: Spacing.two,
    right: Spacing.two,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.one,
    borderRadius: Radius.pill,
    borderCurve: 'continuous',
  },
  row: {
    paddingHorizontal: Spacing.one,
    gap: Spacing.one,
    alignItems: 'center',
  },
  chip: {
    paddingVertical: Spacing.half,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.pill,
    borderCurve: 'continuous',
  },
  close: {
    width: 28,
    height: 28,
    borderRadius: Radius.avatar,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
