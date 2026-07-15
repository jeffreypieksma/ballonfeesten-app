import { useEffect, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CardShadow, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useTheme } from '@/hooks/use-theme';

type BottomSheetProps = {
  onClose: () => void;
  children: ReactNode;
};

/**
 * In-screen bottom sheet: dimmed backdrop (tap to close) + a bottom-anchored
 * card that springs up. No modal route — NativeTabs has no stack, and a
 * sibling overlay behaves identically on web. The parent unmounts it to close.
 * Reduced motion: everything renders in place without animation.
 */
export function BottomSheet({ onClose, children }: BottomSheetProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();

  const backdrop = useSharedValue(reducedMotion ? 1 : 0);
  const slide = useSharedValue(reducedMotion ? 0 : 240);

  useEffect(() => {
    if (reducedMotion) return;
    backdrop.value = withTiming(1, { duration: 200 });
    slide.value = withSpring(0, { damping: 18, stiffness: 220 });
  }, [reducedMotion, backdrop, slide]);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdrop.value }));
  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: slide.value }] }));

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Sluiten"
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.sheet,
          { backgroundColor: theme.background, paddingBottom: insets.bottom + Spacing.four },
          CardShadow,
          sheetStyle,
        ]}
        accessibilityViewIsModal>
        <View style={[styles.grabber, { backgroundColor: theme.backgroundSelected }]} />
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
    borderTopLeftRadius: Radius.card,
    borderTopRightRadius: Radius.card,
    borderCurve: 'continuous',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    alignItems: 'center',
    gap: Spacing.two,
  },
  grabber: {
    width: 36,
    height: 4,
    borderRadius: Radius.pill,
    marginBottom: Spacing.one,
  },
});
