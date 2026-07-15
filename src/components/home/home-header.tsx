import { Pressable, StyleSheet, View } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { EventStatus } from '@/types/home';

type HomeHeaderProps = {
  nickname: string;
  levelName: string;
  eventStatus: EventStatus;
  onPressProfile: () => void;
};

export function HomeHeader({ nickname, levelName, eventStatus, onPressProfile }: HomeHeaderProps) {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      <Pressable
        onPress={onPressProfile}
        accessibilityRole="button"
        accessibilityLabel="Open instellingen"
        style={({ pressed }) => [styles.left, pressed && styles.pressed]}>
        <View style={[styles.avatar, { backgroundColor: theme.accentSoft }]}>
          <ThemedText style={styles.avatarEmoji}>🧑‍✈️</ThemedText>
        </View>
        <View>
          <ThemedText type="default" accessibilityRole="header">
            Hoi, {nickname}!
          </ThemedText>
          <View style={styles.levelRow}>
            <SymbolView name={{ ios: 'star.fill', web: 'star' }} tintColor={theme.sunrise} size={12} />
            <ThemedText type="small" themeColor="textSecondary">
              {levelName}
            </ThemedText>
          </View>
        </View>
      </Pressable>

      <View style={styles.right}>
        <ThemedView
          type="backgroundElement"
          style={styles.statusChip}
          accessibilityLabel={`Evenementstatus: ${eventStatus.title}`}>
          <ThemedText style={styles.statusEmoji}>🌤️</ThemedText>
        </ThemedView>
        <Pressable
          onPress={onPressProfile}
          accessibilityRole="button"
          accessibilityLabel="Instellingen"
          hitSlop={8}
          style={({ pressed }) => [styles.settingsButton, { backgroundColor: theme.backgroundElement }, pressed && styles.pressed]}>
          <SymbolView name={{ ios: 'gearshape.fill', web: 'settings' }} tintColor={theme.text} size={18} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    flexShrink: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: Radius.avatar,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 22,
    lineHeight: 28,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.half,
    marginTop: 2,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  statusChip: {
    width: 36,
    height: 36,
    borderRadius: Radius.avatar,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusEmoji: {
    fontSize: 16,
    lineHeight: 20,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.avatar,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});
