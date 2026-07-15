import { Image } from 'expo-image';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useTheme } from '@/hooks/use-theme';
import { triggerHaptic } from '@/lib/haptics';
import { NICKNAME_MAX_LENGTH, NICKNAME_MIN_LENGTH } from '@/lib/profile-storage';

type OnboardingScreenProps = {
  onComplete: (nickname: string) => void;
};

/**
 * One-time welcome overlay: logo, one question, one button. Rendered above
 * the tabs by the gate in `src/app/_layout.tsx` until a profile exists.
 */
export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  const [name, setName] = useState('');

  const trimmed = name.trim();
  const valid = trimmed.length >= NICKNAME_MIN_LENGTH;

  const handleStart = () => {
    if (!valid) return;
    triggerHaptic('success');
    onComplete(trimmed);
  };

  return (
    <Animated.View
      entering={reducedMotion ? undefined : FadeIn.duration(250)}
      style={[styles.overlay, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.avoider}>
        <View
          style={[
            styles.content,
            { paddingTop: insets.top + Spacing.six, paddingBottom: insets.bottom + Spacing.five },
          ]}>
          <Image
            source={require('@/assets/images/logo.svg')}
            style={styles.logo}
            contentFit="contain"
            accessibilityLabel="Friese Ballonfeesten"
          />

          <View style={styles.copy}>
            <ThemedText type="hero" themeColor="primary" style={styles.title}>
              Wolkom!
            </ThemedText>
            <ThemedText type="default" themeColor="textSecondary" style={styles.subtitle}>
              Spot ballonnen, speel Ballonbingo en vul je eigen ballonpaspoort.
            </ThemedText>
          </View>

          <View style={styles.form}>
            <ThemedText type="smallBold" style={styles.question}>
              Hoe mogen we je noemen?
            </ThemedText>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Bijv. Luchtverkenner"
              placeholderTextColor={theme.textSecondary}
              maxLength={NICKNAME_MAX_LENGTH}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleStart}
              accessibilityLabel="Jouw naam"
              style={[
                styles.input,
                { backgroundColor: theme.backgroundElement, color: theme.text, borderColor: theme.secondarySoft },
              ]}
            />

            <Pressable
              onPress={handleStart}
              disabled={!valid}
              accessibilityRole="button"
              accessibilityState={{ disabled: !valid }}
              accessibilityLabel="Start de app"
              style={[styles.button, { backgroundColor: valid ? theme.primary : theme.backgroundSelected }]}>
              <ThemedText type="smallBold" style={{ color: valid ? theme.onBrand : theme.textSecondary }}>
                Laat de ballonnen maar komen!
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 100,
  },
  avoider: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  logo: {
    width: 240,
    aspectRatio: 179 / 70,
    marginTop: Spacing.five,
  },
  copy: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  form: {
    width: '100%',
    gap: Spacing.two,
    alignItems: 'center',
  },
  question: {
    alignSelf: 'flex-start',
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
