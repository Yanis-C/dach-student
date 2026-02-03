import { StyleSheet, View, ViewStyle } from 'react-native';

import { Colors } from '@/constants/Colors';
import { Radius, Spacing } from '@/constants/Spacing';

import { ThemedText } from '@/components/base/ThemedText';

interface EventCardProps {
  title: string;
  description?: string;
  hours?: string;
  color: string;
  style?: ViewStyle;
}

export function EventCard({ title, description, hours, color, style }: EventCardProps) {
  return (
    <View style={[styles.card, style]}>
      <View style={[styles.colorStripe, { backgroundColor: color }]} />
      <View style={styles.content}>
        {hours && (
          <ThemedText variant="caption" color={Colors.greyText}>
            {hours}
          </ThemedText>
        )}
        <ThemedText variant="subheading" style={styles.title}>
          {title}
        </ThemedText>
        {description && (
          <ThemedText variant="caption" color={color}>
            {description}
          </ThemedText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  colorStripe: {
    width: 4,
    /*marginVertical: Spacing.md,
    borderRadius: Radius.full,*/
  },
  content: {
    flex: 1,
    padding: Spacing.md,
    paddingLeft: Spacing.lg,
    gap: Spacing.xs,
  },
  title: {
    fontSize: 15,
  },
});
