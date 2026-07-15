import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { triggerHaptic } from '@/lib/haptics';
import type { BingoCard } from '@/types/bingo';

type PassportYearSelectorProps = {
  cards: BingoCard[];
  selectedCardId: string;
  onSelect: (cardId: string) => void;
};

/** Edition chips (2026 · 2025 · …). Render only when there is more than one edition. */
export function PassportYearSelector({ cards, selectedCardId, onSelect }: PassportYearSelectorProps) {
  const theme = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.selector}
      contentContainerStyle={styles.row}
      accessibilityRole="tablist">
      {cards.map((card, index) => {
        const active = card.id === selectedCardId;
        return (
          <Pressable
            key={card.id}
            onPress={() => {
              triggerHaptic('light');
              onSelect(card.id);
            }}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`Editie ${card.year}${index === 0 ? ', huidige editie' : ''}`}
            style={[styles.chip, { backgroundColor: active ? theme.secondary : theme.backgroundElement }]}>
            <ThemedText type="smallBold" style={active ? styles.activeLabel : { color: theme.textSecondary }}>
              {card.year}
            </ThemedText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  selector: {
    flexGrow: 0,
    flexShrink: 0,
  },
  row: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    gap: Spacing.two,
    alignItems: 'center',
  },
  chip: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.pill,
    borderCurve: 'continuous',
  },
  activeLabel: {
    color: '#ffffff',
  },
});
