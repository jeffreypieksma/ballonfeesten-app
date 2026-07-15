import * as Haptics from 'expo-haptics';

export type HapticKind = 'light' | 'medium' | 'success';

export async function triggerHaptic(kind: HapticKind) {
  if (process.env.EXPO_OS === 'web') return;

  if (kind === 'success') {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    return;
  }

  await Haptics.impactAsync(
    kind === 'medium' ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light
  );
}
