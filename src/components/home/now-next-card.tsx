import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { SectionHeader } from '@/components/home/section-header';
import { ThemedText } from '@/components/themed-text';
import { CardShadow, Radius, Spacing } from '@/constants/theme';
import { useProgram } from '@/hooks/use-program';
import { useTheme } from '@/hooks/use-theme';
import { useDevTimeOverride } from '@/lib/dev-time';
import { categoryMeta, findProgramEntry, getProgramLiveStatus, toLocalYmd } from '@/lib/program';
import type { ProgramDay, ProgramEntry } from '@/types/program';

type ResolvedEntry = { day: ProgramDay; entry: ProgramEntry };

/**
 * "Nu & Straks": the live programme peek on Home, fed by the same real data
 * and live-status logic as the Programma tab. Hides itself while the
 * programme is loading or unavailable — the tab surfaces errors with a retry.
 */
export function NowNextSection() {
  const theme = useTheme();
  const program = useProgram();
  const [now, setNow] = useState(() => new Date());
  const override = useDevTimeOverride();

  // Keep the NU/STRAKS marking fresh while on the real clock.
  useEffect(() => {
    if (override) return;
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, [override]);

  const effectiveNow = override ?? now;
  const days = program.status === 'ready' ? program.days : null;

  const live = useMemo(
    () => (days ? getProgramLiveStatus(days, effectiveNow) : null),
    [days, effectiveNow],
  );

  if (!days || days.length === 0 || !live) return null;

  const current = live.currentEntryId ? findProgramEntry(days, live.currentEntryId) : null;
  const straks = live.nextEntryId ? findProgramEntry(days, live.nextEntryId) : null;
  const upcoming = live.upcomingEntryId ? findProgramEntry(days, live.upcomingEntryId) : null;

  const goToProgram = () => router.push('/programma');

  return (
    <View style={styles.section}>
      <SectionHeader title="Nu & Straks" actionLabel="Volledig programma" onPressAction={goToProgram} />
      <Pressable
        onPress={goToProgram}
        accessibilityRole="button"
        accessibilityLabel={cardAccessibilityLabel(current, straks, upcoming)}
        style={({ pressed }) => [
          styles.card,
          CardShadow,
          { backgroundColor: theme.backgroundElement },
          pressed && styles.pressed,
        ]}>
        <CardBody
          current={current}
          straks={straks}
          upcoming={upcoming}
          effectiveNow={effectiveNow}
          isFestivalStart={
            upcoming !== null &&
            upcoming.day.id === days[0].id &&
            upcoming.entry.id === days[0].entries[0]?.id
          }
        />
      </Pressable>
    </View>
  );
}

function CardBody({
  current,
  straks,
  upcoming,
  effectiveNow,
  isFestivalStart,
}: {
  current: ResolvedEntry | null;
  straks: ResolvedEntry | null;
  upcoming: ResolvedEntry | null;
  effectiveNow: Date;
  isFestivalStart: boolean;
}) {
  // After the festival: nothing running, nothing upcoming.
  if (!current && !upcoming) {
    return <MessageRow text="Het festival zit erop — tot volgend jaar!" />;
  }

  // Nothing live and nothing within the 2h "straks" window.
  if (!current && !straks && upcoming) {
    if (isFestivalStart) {
      return (
        <View style={styles.rows}>
          <MessageRow
            text={`Het festival begint ${upcoming.day.weekday.toLowerCase()} om ${upcoming.entry.time}`}
          />
          <ThemedText type="small" themeColor="textSecondary" numberOfLines={2}>
            {categoryMeta(upcoming.entry.category).emoji} {upcoming.entry.title}
          </ThemedText>
        </View>
      );
    }
    return (
      <View style={styles.rows}>
        <ThemedText type="small" themeColor="textSecondary">
          Nu even geen programma
        </ThemedText>
        <LaterRow item={upcoming} effectiveNow={effectiveNow} />
      </View>
    );
  }

  return (
    <View style={styles.rows}>
      {current && <EntryRow badge="NU" item={current} />}
      {straks && <EntryRow badge="STRAKS" item={straks} />}
      {current && !straks && upcoming && <LaterRow item={upcoming} effectiveNow={effectiveNow} />}
    </View>
  );
}

function MessageRow({ text }: { text: string }) {
  return (
    <View style={styles.messageRow}>
      <ThemedText style={styles.messageEmoji}>🎈</ThemedText>
      <ThemedText type="smallBold" style={styles.messageText}>
        {text}
      </ThemedText>
    </View>
  );
}

function EntryRow({ badge, item }: { badge: 'NU' | 'STRAKS'; item: ResolvedEntry }) {
  const theme = useTheme();
  const isNow = badge === 'NU';

  return (
    <View style={styles.row}>
      <View style={[styles.badge, { backgroundColor: isNow ? theme.primary : theme.secondarySoft }]}>
        <ThemedText style={[styles.badgeText, { color: isNow ? theme.onBrand : theme.secondary }]}>
          {badge}
        </ThemedText>
      </View>
      <ThemedText style={styles.emoji}>{categoryMeta(item.entry.category).emoji}</ThemedText>
      <ThemedText type="smallBold" style={[styles.time, { color: theme.secondary }]}>
        {item.entry.time}
      </ThemedText>
      <ThemedText type="small" numberOfLines={2} style={styles.title}>
        {item.entry.title}
      </ThemedText>
    </View>
  );
}

function LaterRow({ item, effectiveNow }: { item: ResolvedEntry; effectiveNow: Date }) {
  const sameDay = item.day.date === toLocalYmd(effectiveNow);
  const prefix = sameDay ? '' : `${item.day.weekday} `;

  return (
    <ThemedText type="small" themeColor="textSecondary" numberOfLines={2}>
      Daarna · {prefix}
      {item.entry.time} · {item.entry.title}
    </ThemedText>
  );
}

function cardAccessibilityLabel(
  current: ResolvedEntry | null,
  straks: ResolvedEntry | null,
  upcoming: ResolvedEntry | null,
): string {
  const parts: string[] = [];
  if (current) parts.push(`Nu: ${current.entry.time} ${current.entry.title}.`);
  if (straks) parts.push(`Straks: ${straks.entry.time} ${straks.entry.title}.`);
  if (!current && !straks && upcoming) {
    parts.push(`Volgende: ${upcoming.day.weekday} ${upcoming.entry.time} ${upcoming.entry.title}.`);
  }
  if (parts.length === 0) parts.push('Het festival zit erop.');
  parts.push('Tik voor het volledige programma.');
  return parts.join(' ');
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.two,
  },
  card: {
    borderRadius: Radius.card,
    borderCurve: 'continuous',
    padding: Spacing.three,
  },
  pressed: {
    opacity: 0.85,
  },
  rows: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  badge: {
    minWidth: 58,
    alignItems: 'center',
    paddingHorizontal: Spacing.one,
    paddingVertical: 3,
    borderRadius: Radius.pill,
    borderCurve: 'continuous',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    lineHeight: 14,
  },
  emoji: {
    fontSize: 18,
    lineHeight: 24,
  },
  time: {
    fontVariant: ['tabular-nums'],
  },
  title: {
    flex: 1,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  messageEmoji: {
    fontSize: 24,
    lineHeight: 30,
  },
  messageText: {
    flex: 1,
  },
});
