import Animated from 'react-native-reanimated';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useDriftAnimation } from '@/hooks/use-drift-animation';
import { useFloatAnimation } from '@/hooks/use-float-animation';
import { useTheme } from '@/hooks/use-theme';

export function FloatingBalloonIllustration() {
  const theme = useTheme();
  const floatStyle = useFloatAnimation(10, 2200);
  const cloudDrift1 = useDriftAnimation(14, 5000);
  const cloudDrift2 = useDriftAnimation(-18, 6500);

  return (
    <View style={styles.container} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Animated.Text style={[styles.cloud, styles.cloudOne, cloudDrift1]}>☁️</Animated.Text>
      <Animated.Text style={[styles.cloud, styles.cloudTwo, cloudDrift2]}>☁️</Animated.Text>
      <Animated.View style={[styles.balloonWrap, floatStyle]}>
        <View style={[styles.glow, { backgroundColor: theme.gold, opacity: 0.35 }]} />
        <ThemedText style={styles.balloon}>🎈</ThemedText>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  balloonWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 999,
    opacity: 0.5,
  },
  balloon: {
    fontSize: 64,
    lineHeight: 72,
    textAlign: 'center',
  },
  cloud: {
    position: 'absolute',
    fontSize: 22,
    opacity: 0.8,
  },
  cloudOne: {
    top: 4,
    left: -8,
  },
  cloudTwo: {
    top: 26,
    right: -14,
  },
});
