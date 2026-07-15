import { StyleSheet, View } from 'react-native';

import { WebviewCard } from '@/components/home/webview-card';
import { ThemedView } from '@/components/themed-view';
import { CardShadow, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { programContentHtml } from '@/mocks/webview-content';
import type { ProgramItem } from '@/types/home';

type UpcomingProgramCardProps = {
  items: ProgramItem[];
  onPressItem: (title: string) => void;
};

export function UpcomingProgramCard({ items, onPressItem }: UpcomingProgramCardProps) {
  const theme = useTheme();

  return (
    <ThemedView
      type="backgroundElement"
      style={[styles.card, CardShadow]}
      accessibilityLabel={`Vandaag op het programma: ${items.map((item) => `${item.time} ${item.title}`).join(', ')}`}>
      <View style={styles.content}>
        <WebviewCard
          html={programContentHtml(items, {
            text: theme.text,
            textSecondary: theme.textSecondary,
            accent: theme.accent,
            sunrise: theme.sunrise,
          })}
          onAction={(payload) => {
            const [, title] = payload.split(':');
            onPressItem(title ?? '');
          }}
          minHeight={items.length * 56}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.card,
    borderCurve: 'continuous',
    padding: Spacing.three,
  },
  content: {
    flex: 1,
  },
});
