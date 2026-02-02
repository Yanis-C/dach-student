import { Pressable, StyleSheet, ViewStyle } from 'react-native';

import { Colors } from '@/constants/Colors';
import { Radius } from '@/constants/Spacing';
import { ThemedText } from '@/components/base/ThemedText';

type ButtonVariant = 'filled' | 'outline' | 'plain';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  color?: string;
  backgroundColor?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  variant = 'filled',
  color = Colors.white,
  backgroundColor = Colors.primary,
  disabled = false,
  style,
}: ButtonProps) {
  
  const getBackgroundColor = () => {
    if (backgroundColor) return backgroundColor;
    if (variant === 'filled') return Colors.primary;
    return 'transparent';
  };

  const getTextColor = () => {
    if (color) return color;
    if (variant === 'filled') return Colors.white;
    return Colors.primary;
  };

  const getBorderStyle = () => {
    if (variant === 'outline') {
      return {
        borderWidth: 2,
        borderColor: color || Colors.primary,
      };
    }
    return {};
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: getBackgroundColor() },
        getBorderStyle(),
        disabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      <ThemedText style={[styles.text, { color: getTextColor() }]}>
        {title}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: Radius.md,
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
});
