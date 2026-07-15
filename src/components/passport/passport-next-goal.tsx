import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CardShadow, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { triggerHaptic } from '@/lib/haptics';

type PassportNextGoalProps = {
  remaining: number;
  onGoToBingo: () => void;
};

export function PassportNextGoal({ remaining, onGoToBingo }: PassportNextGoalProps) {
  const theme = useTheme();

  if (remaining === 0) {
    return (
      <View
        style={[styles.completeChip, { backgroundColor: theme.goldSoft }]}
        accessibilityLabel="Volle kaart, alle ballonnen gespot">
        <ThemedText type="smallBold" style={{ color: theme.secondary }}>
          Volle kaart! 🏆 Alle ballonnen gespot
        </ThemedText>
      </View>
    );
  }

  return (
    <ThemedView type="backgroundElement" style={[styles.card, CardShadow]}>
      <View style={styles.textColumn}>
        <ThemedText type="smallBold">
          Nog {remaining} {remaining === 1 ? 'ballon' : 'ballonnen'} tot een volle kaart
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Elke spot is een nieuwe stempel in je paspoort.
        </ThemedText>
      </View>
      <Pressable
        onPress={() => {
          triggerHaptic('medium');
          onGoToBingo();
        }}
        accessibilityRole="button"
        accessibilityLabel="Verder spotten in de Ballonbingo"
        style={[styles.button, { backgroundColor: theme.primary }]}>
        <ThemedText type="smallBold" style={{ color: theme.onBrand }}>
          Verder spotten 🎈
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.card,
    borderCurve: 'continuous',
    padding: Spacing.three,
    gap: Spacing.two,
  },
  textColumn: {
    gap: 2,
  },
  button: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
    borderRadius: Radius.pill,
    borderCurve: 'continuous',
  },
  completeChip: {
    alignSelf: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
    borderCurve: 'continuous',
  },
});
