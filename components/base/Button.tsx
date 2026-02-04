import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Radius, Spacing } from '@/constants/Spacing';
import { ThemedText } from '@/components/base/ThemedText';

type ButtonVariant = 'filled' | 'outline' | 'plain';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  color?: string;
  backgroundColor?: string;
  disabled?: boolean;
  iconLeft?: keyof typeof Ionicons.glyphMap;
  iconRight?: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  iconLeft,
  iconRight,
  iconSize = 20,
  variant = 'filled',
  color = Colors.white,
  backgroundColor = Colors.secondary,
  disabled = false,
  style,
}: ButtonProps) {
  
  const getBackgroundColor = () => {
    if (variant === 'filled') return backgroundColor;
    return 'transparent';
  };

  const getTextColor = () => {
    if (variant === 'filled') return color;
    return backgroundColor;
  };

  const getBorderStyle = () => {
    if (variant === 'outline') return backgroundColor;
    return 'transparent';
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: getBackgroundColor(), borderColor: getBorderStyle() },
        disabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      <View style={styles.content}>
        {iconLeft && (
          <Ionicons
            name={iconLeft}
            size={iconSize}
            color={getTextColor()}
            style={styles.iconLeft}
          />
        )}
        <ThemedText style={[styles.text, { color: getTextColor() }]}>
          {title}
        </ThemedText>
        {iconRight && (
          <Ionicons
            name={iconRight}
            size={iconSize}
            color={getTextColor()}
            style={styles.iconRight}
          />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: Radius.md,
    alignItems: 'center',
    borderWidth: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    fontFamily: 'Comfortaa_700Bold',
    fontSize: 16,
  },
  iconLeft: {
    marginRight: Spacing.sm,
  },
  iconRight: {
    marginLeft: Spacing.sm,
  },
});
