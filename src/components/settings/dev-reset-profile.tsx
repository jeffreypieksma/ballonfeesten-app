import { router } from 'expo-router';
import { Alert, Platform, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useProfile } from '@/hooks/use-profile';
import { useTheme } from '@/hooks/use-theme';

const CONFIRM_TITLE = 'Profiel wissen?';
const CONFIRM_MESSAGE = 'Alleen je profiel wordt gewist; je bingo-voortgang blijft bewaard.';

/**
 * Dev-only: wipes the stored profile so onboarding can be re-tested.
 * Pops back to Home first so re-onboarding doesn't land on a stale screen.
 */
export function DevResetProfile() {
  const theme = useTheme();
  const profileState = useProfile();

  if (profileState.status !== 'ready') return null;
  const { resetProfile } = profileState;

  const confirmReset = () => {
    router.back();
    resetProfile();
  };

  const handlePress = () => {
    // Alert.alert is a no-op on web.
    if (Platform.OS === 'web') {
      if (window.confirm(`${CONFIRM_TITLE}\n\n${CONFIRM_MESSAGE}`)) confirmReset();
      return;
    }
    Alert.alert(CONFIRM_TITLE, CONFIRM_MESSAGE, [
      { text: 'Annuleer', style: 'cancel' },
      { text: 'Wis profiel', style: 'destructive', onPress: confirmReset },
    ]);
  };

  return (
    <View style={styles.section}>
      <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionTitle}>
        Ontwikkelaar
      </ThemedText>
      <Pressable
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel="Profiel wissen"
        style={({ pressed }) => [styles.button, { borderColor: theme.danger }, pressed && styles.pressed]}>
        <ThemedText type="smallBold" style={{ color: theme.danger }}>
          Profiel wissen
        </ThemedText>
      </Pressable>
      <ThemedText type="small" themeColor="textSecondary">
        Wist alleen je profiel, zodat je de onboarding opnieuw kunt testen.
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.two,
  },
  sectionTitle: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  button: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: Spacing.three,
    borderRadius: Radius.pill,
    borderCurve: 'continuous',
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.7,
  },
});
