import { FlatList, StyleSheet, View } from 'react-native';

import { ProgramEntryRow } from '@/components/program/program-entry-row';
import { ThemedText } from '@/components/themed-text';
import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { ProgramDay } from '@/types/program';

type ProgramTimelineProps = {
  day: ProgramDay;
  currentEntryId: string | null;
  nextEntryId: string | null;
  bottomInset: number;
};

export function ProgramTimeline({ day, currentEntryId, nextEntryId, bottomInset }: ProgramTimelineProps) {
  const theme = useTheme();

  return (
    <FlatList
      data={day.entries}
      keyExtractor={(entry) => entry.id}
      extraData={`${currentEntryId}:${nextEntryId}`}
      style={styles.list}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.content, { paddingBottom: bottomInset }]}
      ListHeaderComponent={
        <View style={styles.dayHeader}>
          <View style={[styles.accentBar, { backgroundColor: theme.primary }]} />
          <ThemedText type="smallBold" style={styles.dayLabel} accessibilityRole="header">
            {day.label}
          </ThemedText>
        </View>
      }
      renderItem={({ item, index }) => (
        <ProgramEntryRow
          entry={item}
          isFirst={index === 0}
          isLast={index === day.entries.length - 1}
          isNow={item.id === currentEntryId}
          isNext={item.id === nextEntryId}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingBottom: Spacing.three,
  },
  accentBar: {
    width: 4,
    height: 18,
    borderRadius: Radius.pill,
  },
  dayLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
