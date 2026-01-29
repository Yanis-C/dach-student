import { Text, TextProps, StyleSheet } from 'react-native';

import { Colors } from '@/constants/Colors';
import { FontFamily, FontSize } from '@/constants/Typography';

type TextVariant = 'body' | 'heading' | 'subheading' | 'caption' | 'label';

interface ThemedTextProps extends TextProps {
  variant?: TextVariant;
  bold?: boolean;
  color?: string;
}

export function ThemedText({
  variant = 'body',
  bold = false,
  color,
  style,
  ...props
}: ThemedTextProps) {
  return (
    <Text
      style={[
        styles.base,
        styles[variant],
        bold && styles.bold,
        color ? { color } : null,
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: FontFamily.regular,
    color: Colors.black,
  },
  bold: {
    fontFamily: FontFamily.bold,
  },

  // Variants
  body: {
    fontSize: FontSize.md,
  },
  heading: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
  },
  subheading: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
  },
  caption: {
    fontSize: FontSize.xs,
  },
  label: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
  },
});
