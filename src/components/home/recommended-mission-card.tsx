import { Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { WebviewCard } from '@/components/home/webview-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CardShadow, Radius, Spacing } from '@/constants/theme';
import { usePressScale } from '@/hooks/use-press-scale';
import { useTheme } from '@/hooks/use-theme';
import { missionContentHtml } from '@/mocks/webview-content';
import type { Mission } from '@/types/home';

type RecommendedMissionCardProps = {
  mission: Mission;
  onPress: () => void;
};

export function RecommendedMissionCard({ mission, onPress }: RecommendedMissionCardProps) {
  const theme = useTheme();
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole="button"
      accessibilityLabel={`Aanbevolen missie: ${mission.title}. ${mission.hint}. ${mission.points} punten.`}>
      <Animated.View style={animatedStyle}>
        <ThemedView type="backgroundElement" style={[styles.card, CardShadow]}>
          <View style={styles.row}>
            <ThemedText style={styles.emoji}>🎯</ThemedText>
            <View style={styles.content}>
              <WebviewCard
                html={missionContentHtml(mission, {
                  text: theme.text,
                  textSecondary: theme.textSecondary,
                  accent: theme.accent,
                  sunrise: theme.sunrise,
                })}
                onAction={() => onPress()}
              />
            </View>
          </View>
        </ThemedView>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.card,
    borderCurve: 'continuous',
    padding: Spacing.three,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  emoji: {
    fontSize: 28,
    lineHeight: 34,
  },
  content: {
    flex: 1,
  },
});
