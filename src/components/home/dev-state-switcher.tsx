import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { HomeScreenStateKey } from '@/types/home';

const STATE_LABELS: Record<HomeScreenStateKey, string> = {
  new: 'Nieuw',
  active: 'Actief',
  rowCompleted: 'Rij compleet',
  noProgram: 'Geen programma',
  offline: 'Offline',
  cancelled: 'Geannuleerd',
  loading: 'Laden',
  error: 'Fout',
};

type DevStateSwitcherProps = {
  current: HomeScreenStateKey;
  onSelect: (state: HomeScreenStateKey) => void;
  bottomOffset: number;
};

export function DevStateSwitcher({ current, onSelect, bottomOffset }: DevStateSwitcherProps) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`Ontwikkelaars: huidige status ${STATE_LABELS[current]}. Tik om te wijzigen.`}
        style={[styles.handle, { bottom: bottomOffset, backgroundColor: theme.accent }]}>
        <ThemedText type="small" style={styles.handleText}>
          🛠 {STATE_LABELS[current]}
        </ThemedText>
      </Pressable>
    );
  }

  return (
    <ThemedView
      type="backgroundElement"
      style={[styles.container, { bottom: bottomOffset }]}
      accessibilityLabel="Ontwikkelaars: schakel tussen schermstatussen">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {(Object.keys(STATE_LABELS) as HomeScreenStateKey[]).map((key) => (
          <Pressable
            key={key}
            onPress={() => {
              onSelect(key);
              setOpen(false);
            }}
            accessibilityRole="button"
            accessibilityLabel={`Status: ${STATE_LABELS[key]}`}
            style={[
              styles.chip,
              { backgroundColor: current === key ? theme.accent : theme.backgroundSelected },
            ]}>
            <ThemedText type="small" style={current === key ? styles.activeLabel : undefined}>
              {STATE_LABELS[key]}
            </ThemedText>
          </Pressable>
        ))}
      </ScrollView>
      <Pressable
        onPress={() => setOpen(false)}
        accessibilityRole="button"
        accessibilityLabel="Statuskiezer sluiten"
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
    opacity: 0.85,
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
    paddingLeft: Spacing.one,
    paddingRight: Spacing.one,
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
  activeLabel: {
    color: '#ffffff',
  },
  close: {
    width: 28,
    height: 28,
    borderRadius: Radius.avatar,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
