import { useWindowDimensions } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface UseSwipeNavigationOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
}

/**
 * Custom hook for swipe navigation with animations
 * @example
 * const { panGesture, animatedStyle } = useSwipeNavigation({
 *   onSwipeLeft: () => goToNext(),
 *   onSwipeRight: () => goToPrevious(),
 * });
 *
 */
export function useSwipeNavigation({
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
}: UseSwipeNavigationOptions) {
  const { width } = useWindowDimensions();
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((event) => {
      translateX.value = Math.max(
        -width * 0.3,
        Math.min(width * 0.3, event.translationX),
      );
      opacity.value = 1 - Math.abs(event.translationX) / (width * 0.5);
    })
    .onEnd((event) => {
      if (event.translationX > threshold && onSwipeRight) {
        // Swipe right
        translateX.value = withTiming(width, { duration: 200 });
        opacity.value = withTiming(0, { duration: 200 }, () => {
          runOnJS(onSwipeRight)();
          translateX.value = -width;
          translateX.value = withTiming(0, { duration: 200 });
          opacity.value = withTiming(1, { duration: 200 });
        });
      } else if (event.translationX < -threshold && onSwipeLeft) {
        // Swipe left
        translateX.value = withTiming(-width, { duration: 200 });
        opacity.value = withTiming(0, { duration: 200 }, () => {
          runOnJS(onSwipeLeft)();
          translateX.value = width;
          translateX.value = withTiming(0, { duration: 200 });
          opacity.value = withTiming(1, { duration: 200 });
        });
      } else {
        // Snap back
        translateX.value = withTiming(0, { duration: 150 });
        opacity.value = withTiming(1, { duration: 150 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  return { panGesture, animatedStyle };
}
