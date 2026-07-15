import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { triggerHaptic } from '@/lib/haptics';

type DevTimeTravelProps = {
  /** Simulated moment, or null for the real clock ("Live"). */
  value: Date | null;
  onChange: (value: Date | null) => void;
  bottomOffset: number;
};

type Preset = { label: string; iso: string | null };

// Curated festival moments that put "NU" / "STRAKS" in interesting states.
const PRESETS: Preset[] = [
  { label: 'Live', iso: null },
  { label: 'Wo 16:15', iso: '2026-07-15T16:15:00' },
  { label: 'Wo 19:30', iso: '2026-07-15T19:30:00' },
  { label: 'Vr 23:00', iso: '2026-07-17T23:00:00' },
  { label: 'Za 20:30', iso: '2026-07-18T20:30:00' },
  { label: 'Zo 18:30', iso: '2026-07-19T18:30:00' },
];

const STEP_MINUTES = 15;
const WEEKDAYS = ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'];

function formatMoment(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${WEEKDAYS[date.getDay()]} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function DevTimeTravel({ value, onChange, bottomOffset }: DevTimeTravelProps) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const simulating = value !== null;
  const collapsedLabel = simulating ? formatMoment(value) : 'Live';

  const step = (deltaMinutes: number) => {
    const base = value ?? new Date('2026-07-15T16:15:00');
    onChange(new Date(base.getTime() + deltaMinutes * 60_000));
  };

  if (!open) {
    return (
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`Ontwikkelaars: tijdreis, nu ${collapsedLabel}. Tik om te wijzigen.`}
        style={[styles.handle, { bottom: bottomOffset, backgroundColor: simulating ? theme.warning : theme.accent }]}>
        <ThemedText type="small" style={styles.handleText}>
          🕐 {collapsedLabel}
        </ThemedText>
      </Pressable>
    );
  }

  return (
    <ThemedView
      type="backgroundElement"
      style={[styles.container, { bottom: bottomOffset }]}
      accessibilityLabel="Ontwikkelaars: simuleer een festivalmoment">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {PRESETS.map((preset) => {
          const active =
            preset.iso === null
              ? !simulating
              : simulating && new Date(preset.iso).getTime() === value.getTime();
          return (
            <Pressable
              key={preset.label}
              onPress={() => {
                triggerHaptic('light');
                onChange(preset.iso === null ? null : new Date(preset.iso));
              }}
              accessibilityRole="button"
              accessibilityLabel={preset.label}
              style={[styles.chip, { backgroundColor: active ? theme.accent : theme.backgroundSelected }]}>
              <ThemedText type="small" style={active ? styles.activeLabel : undefined}>
                {preset.label}
              </ThemedText>
            </Pressable>
          );
        })}

        <Pressable
          onPress={() => step(-STEP_MINUTES)}
          accessibilityRole="button"
          accessibilityLabel="15 minuten terug"
          style={[styles.chip, { backgroundColor: theme.backgroundSelected }]}>
          <ThemedText type="small">−15m</ThemedText>
        </Pressable>
        <Pressable
          onPress={() => step(STEP_MINUTES)}
          accessibilityRole="button"
          accessibilityLabel="15 minuten vooruit"
          style={[styles.chip, { backgroundColor: theme.backgroundSelected }]}>
          <ThemedText type="small">+15m</ThemedText>
        </Pressable>
      </ScrollView>

      <Pressable
        onPress={() => setOpen(false)}
        accessibilityRole="button"
        accessibilityLabel="Tijdreis sluiten"
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
