import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CardShadow, Radius, Spacing } from '@/constants/theme';

export function NoProgramNotice() {
  return (
    <ThemedView
      type="backgroundElement"
      style={[styles.card, CardShadow]}
      accessibilityLabel="Geen programma beschikbaar. Probeer in de tussentijd een bingo-opdracht.">
      <ThemedText style={styles.emoji}>🧭</ThemedText>
      <View style={styles.textColumn}>
        <ThemedText type="smallBold">Nog geen programma bekend</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Zodra er nieuws is zie je het hier. Spot ondertussen gewoon door voor je Bingo!
        </ThemedText>
      </View>
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
