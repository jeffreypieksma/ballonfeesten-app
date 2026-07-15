import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export function usePressScale(pressedScale = 0.96) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    scale.value = withTiming(pressedScale, { duration: 100 });
  };

  const onPressOut = () => {
    scale.value = withTiming(1, { duration: 150 });
  };

  return { animatedStyle, onPressIn, onPressOut };
}
