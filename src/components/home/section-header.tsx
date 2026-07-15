import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
  onPressAction?: () => void;
};

export function SectionHeader({ title, actionLabel, onPressAction }: SectionHeaderProps) {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      <View style={styles.titleRow}>
        <View style={[styles.accentBar, { backgroundColor: theme.primary }]} />
        <ThemedText type="smallBold" style={styles.title} accessibilityRole="header">
          {title}
        </ThemedText>
      </View>
      {actionLabel && onPressAction && (
        <Pressable
          onPress={onPressAction}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          hitSlop={8}>
          <ThemedText type="link" themeColor="accent">
            {actionLabel}
          </ThemedText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    flexShrink: 1,
  },
  accentBar: {
    width: 4,
    height: 18,
    borderRadius: Radius.pill,
  },
  title: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
