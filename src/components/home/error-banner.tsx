import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ErrorBannerProps = {
  message?: string;
  onRetry: () => void;
};

export function ErrorBanner({ message = 'Er ging iets mis bij het laden.', onRetry }: ErrorBannerProps) {
  const theme = useTheme();

  return (
    <ThemedView style={[styles.banner, { backgroundColor: theme.accentSoft }]} accessibilityLabel={message}>
      <View style={styles.textColumn}>
        <ThemedText type="small">⚠️ {message}</ThemedText>
      </View>
      <Pressable onPress={onRetry} accessibilityRole="button" accessibilityLabel="Opnieuw proberen" hitSlop={8}>
        <ThemedText type="link" themeColor="accent">
          Opnieuw proberen
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: Radius.chip,
    borderCurve: 'continuous',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  textColumn: {
    flex: 1,
  },
});
