import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { triggerHaptic } from '@/lib/haptics';
import type { ProgramDay } from '@/types/program';

type DaySelectorProps = {
  days: ProgramDay[];
  selectedDayId: string;
  onSelect: (dayId: string) => void;
  /** Day matching the current date, marked with a "vandaag" dot. */
  todayId?: string | null;
};

export function DaySelector({ days, selectedDayId, onSelect, todayId }: DaySelectorProps) {
  const theme = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.selector}
      contentContainerStyle={styles.row}
      accessibilityRole="tablist">
      {days.map((day) => {
        const selected = day.id === selectedDayId;
        const isToday = day.id === todayId;

        return (
          <Pressable
            key={day.id}
            onPress={() => {
              triggerHaptic('light');
              onSelect(day.id);
            }}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={`${day.label}${isToday ? ', vandaag' : ''}`}
            style={[
              styles.chip,
              { backgroundColor: selected ? theme.secondary : theme.backgroundElement },
            ]}>
            <ThemedText
              type="smallBold"
              style={selected ? styles.selectedLabel : { color: theme.textSecondary }}>
              {day.shortLabel}
            </ThemedText>
            {isToday && (
              <View
                style={[
                  styles.todayDot,
                  { backgroundColor: selected ? theme.onBrand : theme.gold },
                ]}
              />
            )}
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.pill,
    borderCurve: 'continuous',
  },
  selectedLabel: {
    color: '#ffffff',
  },
  todayDot: {
    width: 6,
    height: 6,
    borderRadius: Radius.pill,
  },
});
