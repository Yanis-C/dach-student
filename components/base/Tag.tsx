import { StyleSheet, View, ViewStyle } from 'react-native';

import { Colors } from '@/constants/Colors';
import { Radius, Spacing } from '@/constants/Spacing';

import { ThemedText } from './ThemedText';

interface TagProps {
  text: string;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
}

export function Tag({
  text,
  color = Colors.greyText,
  backgroundColor = Colors.greyLight,
  style,
}: TagProps) {
  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      <ThemedText variant="caption" bold color={color}>
        {text}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.md,
  },
});
