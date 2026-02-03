import { PropsWithChildren, ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { Colors } from '@/constants/Colors';
import { Radius, Spacing } from '@/constants/Spacing';

interface SmallCardProps {
  icon?: ReactNode;
  rightElement?: ReactNode;
  style?: ViewStyle;
}

export function SmallCard({
  icon,
  rightElement,
  style,
  children,
}: PropsWithChildren<SmallCardProps>) {
  return (
    <View style={[styles.card, style]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <View style={styles.content}>{children}</View>
      {rightElement && <View style={styles.rightContainer}>{rightElement}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  iconContainer: {
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  rightContainer: {
    marginLeft: Spacing.sm,
  },
});
