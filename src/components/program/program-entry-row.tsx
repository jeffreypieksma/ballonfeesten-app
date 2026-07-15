import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { categoryMeta } from '@/lib/program';
import type { ProgramEntry } from '@/types/program';

type ProgramEntryRowProps = {
  entry: ProgramEntry;
  isNow?: boolean;
  isNext?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
};

export function ProgramEntryRow({ entry, isNow, isNext, isFirst, isLast }: ProgramEntryRowProps) {
  const theme = useTheme();
  const meta = categoryMeta(entry.category);
  const dotColor = isNow ? theme.primary : theme[meta.colorRole];

  const statusLabel = isNow ? ' — nu bezig' : isNext ? ' — straks' : '';

  return (
    <View
      style={styles.row}
      accessibilityLabel={`${entry.time}, ${entry.title}${statusLabel}`}
      {...(isNow ? { accessibilityLiveRegion: 'polite' as const } : {})}>
      <View style={styles.timeCol}>
        <ThemedText type="smallBold" style={[styles.time, { color: theme.secondary }]}>
          {entry.time}
        </ThemedText>
      </View>

      <View style={styles.lineCol}>
        <View
          style={[styles.segment, { backgroundColor: isFirst ? 'transparent' : theme.backgroundSelected }, styles.segmentTop]}
        />
        <View style={[styles.dot, { backgroundColor: dotColor, borderColor: theme.background }]} />
        <View
          style={[styles.segment, { backgroundColor: isLast ? 'transparent' : theme.backgroundSelected }, styles.segmentBottom]}
        />
      </View>

      <View style={styles.contentCol}>
        <View
          style={[
            styles.content,
            isNow && { backgroundColor: theme.primarySoft },
            isNext && { backgroundColor: theme.backgroundElement },
          ]}>
          {(isNow || isNext) && (
            <View
              style={[
                styles.badge,
                { backgroundColor: isNow ? theme.primary : theme.secondarySoft },
              ]}>
              <ThemedText
                type="small"
                style={[styles.badgeText, { color: isNow ? theme.onBrand : theme.secondary }]}>
                {isNow ? 'NU' : 'STRAKS'}
              </ThemedText>
            </View>
          )}
          <ThemedText type="small">{entry.title}</ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  timeCol: {
    width: 48,
    paddingTop: Spacing.two,
    alignItems: 'flex-end',
  },
  time: {
    fontVariant: ['tabular-nums'],
  },
  lineCol: {
    width: 28,
    alignItems: 'center',
  },
  segment: {
    width: 2,
  },
  segmentTop: {
    // Aligns the dot with the time / first title line (both start at Spacing.two).
    height: Spacing.two,
  },
  segmentBottom: {
    flex: 1,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: Radius.pill,
    borderWidth: 3,
  },
  contentCol: {
    flex: 1,
    paddingBottom: Spacing.three,
  },
  content: {
    borderRadius: Radius.chip,
    borderCurve: 'continuous',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    gap: Spacing.one,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.two,
    paddingVertical: 1,
  },
  badgeText: {
    fontWeight: '800',
    letterSpacing: 0.5,
    fontSize: 11,
  },
});
