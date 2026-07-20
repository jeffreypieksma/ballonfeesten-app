import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ErrorBanner } from '@/components/home/error-banner';
import { DaySelector } from '@/components/program/day-selector';
import { DevTimeTravel } from '@/components/program/dev-time-travel';
import { ProgramSkeleton } from '@/components/program/program-skeleton';
import { ProgramTimeline } from '@/components/program/program-timeline';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useProgram } from '@/hooks/use-program';
import { setDevTimeOverride, useDevTimeOverride } from '@/lib/dev-time';
import { getDefaultDayId, getProgramLiveStatus, toLocalYmd } from '@/lib/program';
import type { ProgramDay } from '@/types/program';

export default function ProgrammaScreen() {
  const insets = useSafeAreaInsets();
  const program = useProgram();
  const bottomInset = insets.bottom + BottomTabInset + Spacing.six;
  const devBottomOffset = insets.bottom + BottomTabInset + Spacing.two;

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.three }]}>
        <ThemedText type="hero" themeColor="primary">
          Programma
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Friese Ballonfeesten · 2026
        </ThemedText>
      </View>

      {program.status === 'loading' && <ProgramSkeleton />}

      {program.status === 'error' && (
        <View style={styles.errorWrap}>
          <ErrorBanner
            message="Het programma kon niet worden geladen."
            onRetry={program.retry}
          />
        </View>
      )}

      {program.status === 'ready' && (
        <ProgramReady days={program.days} bottomInset={bottomInset} devBottomOffset={devBottomOffset} />
      )}
    </ThemedView>
  );
}

function ProgramReady({
  days,
  bottomInset,
  devBottomOffset,
}: {
  days: ProgramDay[];
  bottomInset: number;
  devBottomOffset: number;
}) {
  const [now, setNow] = useState(() => new Date());
  // Dev-only override to simulate a festival moment; null = real clock.
  // Shared via dev-time.ts so the Home "Nu & Straks" block follows along.
  const override = useDevTimeOverride();
  const [selectedDayId, setSelectedDayId] = useState(() => getDefaultDayId(days, now));

  // Keep the "nu / straks" marking fresh while on the real clock.
  useEffect(() => {
    if (override) return;
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, [override]);

  const effectiveNow = override ?? now;

  // Jump the day selector to the simulated day when time-travelling.
  const handleOverride = (value: Date | null) => {
    setDevTimeOverride(value);
    if (value) setSelectedDayId(getDefaultDayId(days, value));
  };

  const live = useMemo(() => getProgramLiveStatus(days, effectiveNow), [days, effectiveNow]);
  const todayId = useMemo(() => {
    const ymd = toLocalYmd(effectiveNow);
    return days.find((day) => day.date === ymd)?.id ?? null;
  }, [days, effectiveNow]);

  const selectedDay = days.find((day) => day.id === selectedDayId) ?? days[0];

  return (
    <>
      <DaySelector
        days={days}
        selectedDayId={selectedDay.id}
        onSelect={setSelectedDayId}
        todayId={todayId}
      />
      <ProgramTimeline
        day={selectedDay}
        currentEntryId={live.currentEntryId}
        nextEntryId={live.nextEntryId}
        bottomInset={bottomInset}
      />
      {__DEV__ && <DevTimeTravel value={override} onChange={handleOverride} bottomOffset={devBottomOffset} />}
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
});
