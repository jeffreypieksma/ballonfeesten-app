import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CardShadow, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { EventStatus } from '@/types/home';

const STATUS_EMOJI: Record<EventStatus['kind'], string> = {
  expected: '🎈',
  buildingUp: '🧰',
  inTheAir: '🎈',
  decisionPending: '⏳',
  eveningProgram: '🌆',
  cancelled: '🌧️',
  alternative: '🧭',
};

type EventStatusCardProps = {
  status: EventStatus;
  onPressMore?: () => void;
};

export function EventStatusCard({ status, onPressMore }: EventStatusCardProps) {
  const theme = useTheme();
  const isCancelled = status.kind === 'cancelled';

  return (
    <ThemedView
      style={[styles.card, CardShadow, { backgroundColor: isCancelled ? theme.accentSoft : theme.backgroundElement }]}
      accessibilityLabel={`Evenementstatus: ${status.title}. ${status.nextUpdateLabel}`}>
      <ThemedText style={styles.emoji}>{STATUS_EMOJI[status.kind]}</ThemedText>
      <View style={styles.textColumn}>
        <ThemedText type="smallBold">{status.title}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {status.nextUpdateLabel}
        </ThemedText>
      </View>
      {onPressMore && (
        <Pressable
          onPress={onPressMore}
          accessibilityRole="button"
          accessibilityLabel="Meer informatie over evenementstatus"
          hitSlop={8}>
          <ThemedText type="link" themeColor="accent">
            Meer info
          </ThemedText>
        </Pressable>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.card,
    borderCurve: 'continuous',
    padding: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  emoji: {
    fontSize: 24,
    lineHeight: 30,
  },
  textColumn: {
    flex: 1,
    gap: 2,
  },
});
