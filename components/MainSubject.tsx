import { StyleSheet, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { Spacing, Radius } from '@/constants/Spacing';
import { ThemedText } from '@/components/base/ThemedText';
import { Subject } from '@/types/Subject';

interface MainSubjectProps {
  subject: Subject;
  onPress?: () => void;
}

export function MainSubject({ subject, onPress }: MainSubjectProps) {
  const progress = subject.chapters > 0
    ? Math.round((subject.completedChapters / subject.chapters) * 100)
    : 0;

  return (
    <Pressable
      style={[styles.container, { backgroundColor: subject.color }]}
      onPress={onPress}
    >
      {/* Header Row */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons
            name={subject.icon as keyof typeof Ionicons.glyphMap}
            size={24}
            color={Colors.white}
          />
        </View>
        <ThemedText variant="subheading" style={styles.name}>
          {subject.name}
        </ThemedText>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <ThemedText variant="caption" style={styles.statsText}>
          {subject.chapters} chapitres • {subject.completedChapters} terminés
        </ThemedText>
        <ThemedText variant="caption" style={styles.percentText}>
          {progress}%
        </ThemedText>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    flex: 1,
    color: Colors.white,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsText: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  percentText: {
    color: Colors.white,
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.white,
    borderRadius: Radius.full,
  },
});
