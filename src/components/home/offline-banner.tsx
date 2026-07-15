import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Radius, Spacing } from '@/constants/theme';

export function OfflineBanner() {
  return (
    <ThemedView
      type="backgroundElement"
      style={styles.banner}
      accessibilityLabel="Je bent offline. Ballonbingo blijft beschikbaar, gegevens worden later bijgewerkt.">
      <ThemedText type="small">📡 Offline — Ballonbingo blijft gewoon werken</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: Radius.chip,
    borderCurve: 'continuous',
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
  },
});
