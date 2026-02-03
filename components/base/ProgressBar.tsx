import { StyleSheet, View, ViewStyle } from 'react-native';

import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';

interface ProgressBarProps {
  progress: number; // 0 to 1
  color?: string;
  backgroundColor?: string;
  height?: number;
  style?: ViewStyle;
}

export function ProgressBar({
  progress,
  color = Colors.primary,
  backgroundColor = Colors.greyLight,
  height = 6,
  style,
}: ProgressBarProps) {
  const clampedProgress = Math.min(1, Math.max(0, progress));

  return (
    <View style={[styles.container, { backgroundColor, height, borderRadius: height / 2 }, style]}>
      <View
        style={[
          styles.fill,
          {
            backgroundColor: color,
            width: `${clampedProgress * 100}%`,
            height,
            borderRadius: height / 2,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    marginTop: Spacing.xs,
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});
