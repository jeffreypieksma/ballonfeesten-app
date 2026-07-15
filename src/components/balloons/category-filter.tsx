import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Balloon } from '@/lib/balloons';
import { categoryMeta } from '@/lib/bingo';
import { triggerHaptic } from '@/lib/haptics';
import type { BingoCategory } from '@/types/bingo';

export type CategorySelection = BingoCategory | 'alle';

type CategoryFilterProps = {
  balloons: Balloon[];
  selected: CategorySelection;
  onSelect: (selection: CategorySelection) => void;
};

/** Chips for the categories present in the data, plus "Alle". */
export function CategoryFilter({ balloons, selected, onSelect }: CategoryFilterProps) {
  const theme = useTheme();
  const categories = [...new Set(balloons.map((balloon) => balloon.category))];
  const options: { key: CategorySelection; label: string }[] = [
    { key: 'alle', label: 'Alle' },
    ...categories.map((category) => ({ key: category, label: categoryMeta(category).label })),
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.selector}
      contentContainerStyle={styles.row}
      accessibilityRole="tablist">
      {options.map((option) => {
        const active = option.key === selected;
        return (
          <Pressable
            key={option.key}
            onPress={() => {
              triggerHaptic('light');
              onSelect(option.key);
            }}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`Filter: ${option.label}`}
            style={[styles.chip, { backgroundColor: active ? theme.secondary : theme.backgroundElement }]}>
            <ThemedText type="smallBold" style={active ? styles.activeLabel : { color: theme.textSecondary }}>
              {option.label}
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
