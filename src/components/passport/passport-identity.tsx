import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { CardShadow, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type PassportIdentityProps = {
  nickname: string;
};

/** The passport "cover": dark blue card with a gold trim and the holder's identity. */
export function PassportIdentity({ nickname }: PassportIdentityProps) {
  const theme = useTheme();

  return (
    <View
      style={[styles.cover, { backgroundColor: theme.secondary, borderColor: theme.gold }, CardShadow]}
      accessibilityLabel={`Ballonpaspoort van ${nickname}, Friese Ballonfeesten 2026`}>
      <View style={[styles.avatar, { backgroundColor: theme.secondarySoft }]}>
        <ThemedText style={styles.avatarEmoji} accessibilityElementsHidden>
          🧑‍✈️
        </ThemedText>
      </View>
      <View style={styles.textColumn}>
        <ThemedText type="small" style={[styles.label, { color: theme.goldSoft }]}>
          BALLONPASPOORT
        </ThemedText>
        <ThemedText type="hero" style={styles.name} numberOfLines={1}>
          {nickname}
        </ThemedText>
        <ThemedText type="small" style={[styles.edition, { color: theme.goldSoft }]}>
          Friese Ballonfeesten · editie 2026
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cover: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    borderWidth: 2,
    borderRadius: Radius.card,
    borderCurve: 'continuous',
    padding: Spacing.three,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: Radius.avatar,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 28,
    lineHeight: 36,
  },
  textColumn: {
    flex: 1,
    gap: 1,
  },
  label: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  name: {
    color: '#ffffff',
    fontSize: 22,
    lineHeight: 28,
  },
  edition: {
    fontSize: 12,
    lineHeight: 16,
  },
});
