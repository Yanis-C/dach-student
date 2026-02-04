import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';

import { ProgressBar } from '@/components/base/ProgressBar';
import { Tag } from '@/components/base/Tag';
import { ThemedText } from '@/components/base/ThemedText';
import { Colors } from '@/constants/Colors';
import { Radius, Spacing } from '@/constants/Spacing';

type ExamType = 'baccalaureat' | 'controle' | 'oral';

interface ExamCardProps {
  type: ExamType;
  title: string;
  dateRange: string;
  dateSubtext: string;
  subjects: { name: string; color: string }[];
  preparation: number;
  color: string;
  onPress?: () => void;
  style?: ViewStyle;
}

const TYPE_LABELS: Record<ExamType, string> = {
  baccalaureat: 'BACCALAURÉAT',
  controle: 'CONTRÔLE',
  oral: 'ORAL',
};

export function ExamCard({
  type,
  title,
  dateRange,
  dateSubtext,
  subjects,
  preparation,
  color,
  onPress,
  style,
}: ExamCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: color },
        pressed && styles.pressed,
        style,
      ]}
    >
      {/* Header row: Type badge + Date info */}
      <View style={styles.headerRow}>
        <View style={styles.typeBadge}>
          <ThemedText variant="caption" bold color={color}>
            {TYPE_LABELS[type]}
          </ThemedText>
        </View>
        <View style={styles.dateContainer}>
          <ThemedText variant="body" bold color={Colors.white}>
            {dateRange}
          </ThemedText>
          <ThemedText variant="caption" color="rgba(255,255,255,0.8)">
            {dateSubtext}
          </ThemedText>
        </View>
      </View>

      {/* Title */}
      <ThemedText variant="subheading" color={Colors.white} style={styles.title}>
        {title}
      </ThemedText>

      {/* Subject tags */}
      <View style={styles.tagsRow}>
        {subjects.map((subject, index) => (
          <Tag
            key={index}
            text={subject.name}
            color={Colors.white}
            backgroundColor={subject.color}
            style={styles.tag}
          />
        ))}
        {subjects.length > 2 && (
          <Tag
            text={`+${subjects.length - 2}`}
            color={Colors.white}
            backgroundColor="rgba(255,255,255,0.3)"
          />
        )}
      </View>

      {/* Progress section */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <ThemedText variant="caption" color="rgba(255,255,255,0.9)">
            Préparation globale
          </ThemedText>
          <ThemedText variant="caption" bold color={Colors.white}>
            {preparation}%
          </ThemedText>
        </View>
        <ProgressBar
          progress={preparation / 100}
          color={Colors.white}
          backgroundColor="rgba(255,255,255,0.3)"
          height={6}
          style={styles.progressBar}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.lg,
    padding: Spacing.lg,
  },
  pressed: {
    opacity: 0.9,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  typeBadge: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.sm,
  },
  dateContainer: {
    alignItems: 'flex-end',
  },
  title: {
    marginBottom: Spacing.md,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  tag: {
    marginRight: 0,
  },
  progressSection: {
    marginTop: 'auto',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressBar: {
    marginTop: Spacing.xs,
  },
});
