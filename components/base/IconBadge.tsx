import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { Colors } from '@/constants/Colors';
import { Radius, Spacing } from '@/constants/Spacing';

type IoniconsName = keyof typeof Ionicons.glyphMap;

interface IconBadgeProps {
  icon: IoniconsName;
  color?: string;
  backgroundColor?: string;
  size?: number;
  style?: ViewStyle;
}

export function IconBadge({
  icon,
  color = Colors.white,
  backgroundColor = Colors.greyLight,
  size = 20,
  style,
}: IconBadgeProps) {
  const containerSize = size + Spacing.md * 2;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          width: containerSize,
          height: containerSize,
          borderRadius: Radius.md,
        },
        style,
      ]}
    >
      <Ionicons name={icon} size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
