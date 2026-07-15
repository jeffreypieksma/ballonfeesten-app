import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useProfile } from '@/hooks/use-profile';
import { useTheme } from '@/hooks/use-theme';
import { triggerHaptic } from '@/lib/haptics';
import { NICKNAME_MAX_LENGTH, NICKNAME_MIN_LENGTH } from '@/lib/profile-storage';

/** Edit-your-nickname form for the settings screen. */
export function NicknameForm() {
  const theme = useTheme();
  const profileState = useProfile();
  const savedNickname =
    profileState.status === 'ready' && profileState.profile ? profileState.profile.nickname : '';

  const [name, setName] = useState(savedNickname);
  const [saved, setSaved] = useState(false);
  const savedTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (savedTimeout.current) clearTimeout(savedTimeout.current);
    };
  }, []);

  if (profileState.status !== 'ready' || !profileState.profile) return null;

  const trimmed = name.trim();
  const valid = trimmed.length >= NICKNAME_MIN_LENGTH && trimmed !== savedNickname;

  const handleSave = () => {
    if (!valid) return;
    triggerHaptic('success');
    profileState.updateNickname(trimmed);
    setSaved(true);
    if (savedTimeout.current) clearTimeout(savedTimeout.current);
    savedTimeout.current = setTimeout(() => setSaved(false), 2000);
  };

  return (
    <View style={styles.form}>
      <ThemedText type="smallBold">Hoe mogen we je noemen?</ThemedText>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Bijv. Luchtverkenner"
        placeholderTextColor={theme.textSecondary}
        maxLength={NICKNAME_MAX_LENGTH}
        autoCapitalize="words"
        autoCorrect={false}
        returnKeyType="done"
        onSubmitEditing={handleSave}
        accessibilityLabel="Jouw naam"
        style={[
          styles.input,
          { backgroundColor: theme.backgroundElement, color: theme.text, borderColor: theme.secondarySoft },
        ]}
      />
      <Pressable
        onPress={handleSave}
        disabled={!valid}
        accessibilityRole="button"
        accessibilityState={{ disabled: !valid }}
        accessibilityLabel="Naam opslaan"
        style={[styles.button, { backgroundColor: valid ? theme.primary : theme.backgroundSelected }]}>
        <ThemedText type="smallBold" style={{ color: valid ? theme.onBrand : theme.textSecondary }}>
          Opslaan
        </ThemedText>
      </Pressable>
      {saved && (
        <ThemedText
          type="small"
          themeColor="textSecondary"
          accessibilityLiveRegion="polite"
          style={styles.savedNote}>
          Opgeslagen!
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.two,
  },
  savedNote: {
    alignSelf: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: Radius.chip,
    borderCurve: 'continuous',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 2,
    fontSize: 16,
  },
  button: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: Spacing.three,
    borderRadius: Radius.pill,
    borderCurve: 'continuous',
    marginTop: Spacing.one,
  },
});
