import { StyleSheet, View } from 'react-native';

import { WebviewCard } from '@/components/home/webview-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { sponsorContentHtml } from '@/mocks/webview-content';
import type { Sponsor } from '@/types/home';

type SponsorMissionCardProps = {
  sponsor: Sponsor;
};

export function SponsorMissionCard({ sponsor }: SponsorMissionCardProps) {
  const theme = useTheme();

  return (
    <ThemedView type="backgroundElement" style={styles.card} accessibilityLabel={sponsor.missionLabel}>
      <ThemedText style={styles.emoji}>🤝</ThemedText>
      <View style={styles.content}>
        <WebviewCard
          html={sponsorContentHtml(sponsor, {
            text: theme.text,
            textSecondary: theme.textSecondary,
            accent: theme.accent,
            sunrise: theme.sunrise,
          })}
          minHeight={40}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.chip,
    borderCurve: 'continuous',
    padding: Spacing.two,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  emoji: {
    fontSize: 18,
    lineHeight: 24,
  },
  content: {
    flex: 1,
  },
});
