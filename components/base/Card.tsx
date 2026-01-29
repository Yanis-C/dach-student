import { PropsWithChildren } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { Colors } from '@/constants/Colors';
import { Spacing, Radius } from '@/constants/Spacing';

import { ThemedText } from '@/components/base/ThemedText';

interface CardProps {
  title?: string;
  style?: ViewStyle;
}

export function Card({ title, style, children }: PropsWithChildren<CardProps>) {
  return (
    <View style={[styles.card, style]}>
      {title && <ThemedText variant="subheading">{title}</ThemedText>}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
