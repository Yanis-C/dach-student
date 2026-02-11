import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/fr';
import Head from 'expo-router/head';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { SwitchButton } from '@/components/base/SwitchButton';
import { Tag } from '@/components/base/Tag';
import { ThemedText } from '@/components/base/ThemedText';
import { ExamCard } from '@/components/ExamCard';
import { MainSubject } from '@/components/MainSubject';
import ExamForm from '@/components/modals/ExamForm';
import SubjectForm from '@/components/modals/SubjectForm';
import { Colors } from '@/constants/Colors';
import { CommonStyles } from '@/constants/CommonStyles';
import { Radius, Spacing } from '@/constants/Spacing';
import * as schema from '@/db/schema';
import { useDrizzle } from '@/hooks/useDrizzle';
import { Subject } from '@/types/Subject';

dayjs.extend(relativeTime);
dayjs.locale('fr');

type ViewType = 'exams' | 'subjects';

type ExamWithSubjects = {
  id: number;
  name: string;
  date: Date;
  subjects: {
    subjectId: number;
    coefficient: number;
  }[];
};

export default function ExamsScreen() {
  const db = useDrizzle();
  const { data: subjects } = useLiveQuery(db.select().from(schema.subjects));
  const { data: exams } = useLiveQuery(db.select().from(schema.exams));
  const { data: examsToSubjects } = useLiveQuery(db.select().from(schema.examsToSubjects));

  const [activeView, setActiveView] = useState<ViewType>('exams');
  const [editingSubject, setEditingSubject] = useState<Subject | undefined>(undefined);
  const [isCreatingSubject, setIsCreatingSubject] = useState(false);
  const [editingExam, setEditingExam] = useState<ExamWithSubjects | undefined>(undefined);
  const [isCreatingExam, setIsCreatingExam] = useState(false);

  const isSubjectFormVisible = isCreatingSubject || editingSubject !== undefined;
  const isExamFormVisible = isCreatingExam || editingExam !== undefined;

  // Build exams with their subjects
  const examsWithSubjects: ExamWithSubjects[] = (exams ?? []).map((exam) => ({
    id: exam.id,
    name: exam.name,
    date: exam.date,
    subjects: (examsToSubjects ?? [])
      .filter((ets) => ets.examId === exam.id)
      .map((ets) => ({
        subjectId: ets.subjectId,
        coefficient: ets.coefficient ?? 1,
      })),
  }));

  const handleAddPress = () => {
    if (activeView === 'subjects') {
      setIsCreatingSubject(true);
    } else {
      setIsCreatingExam(true);
    }
  };

  const handleCloseSubjectForm = () => {
    setIsCreatingSubject(false);
    setEditingSubject(undefined);
  };

  const handleCloseExamForm = () => {
    setIsCreatingExam(false);
    setEditingExam(undefined);
  };

  return (
    <View style={[CommonStyles.container, CommonStyles.content]}>
      <Head>
        <title>Examens - Dash Student</title>
      </Head>

      <View style={styles.switchContainer}>
        <SwitchButton
          options={['exams', 'subjects'] as [ViewType, ViewType]}
          labels={['Mes Examens', 'Mes Matières']}
          value={activeView}
          onChange={setActiveView}
          radius={Radius.md}
          activeStyle={{ backgroundColor: Colors.primary }}
          activeTextColor={Colors.white}
        />
      </View>

      {activeView === 'exams' ? (
        <FlatList
          data={examsWithSubjects}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <ThemedText variant="subheading">À venir</ThemedText>
              <Tag
                text={`${examsWithSubjects.length} examen${examsWithSubjects.length > 1 ? 's' : ''}`}
                color={Colors.primary}
                backgroundColor={Colors.primary + '20'}
              />
            </View>
          }
          renderItem={({ item }) => {
            const examSubjects = item.subjects.map((es) => {
              const subject = subjects?.find((s) => s.id === es.subjectId);
              return {
                name: subject?.name ?? 'Unknown',
                color: subject?.color ?? Colors.greyText,
              };
            });

            return (
              <ExamCard
                type="controle" // TODO: Add type to exam schema
                title={item.name}
                dateRange={dayjs(item.date).format('D MMM')}
                dateSubtext={dayjs(item.date).fromNow()}
                subjects={examSubjects}
                preparation={0} // TODO: Add preparation tracking
                color={examSubjects[0]?.color ?? Colors.secondary}
                onPress={() => setEditingExam(item)}
              />
            );
          }}
        />
      ) : (
        <FlatList
          data={subjects ?? []}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <MainSubject subject={item} onPress={() => setEditingSubject(item)} />
          )}
        />
      )}

      {/* Floating Action Button */}
      <Pressable
        style={({ pressed }) => [styles.floatingButton, pressed && styles.floatingButtonPressed]}
        onPress={handleAddPress}
      >
        <Ionicons name="add" size={28} color={Colors.white} />
      </Pressable>

      {/* Modals */}
      {isSubjectFormVisible && (
        <SubjectForm
          isVisible={isSubjectFormVisible}
          onClose={handleCloseSubjectForm}
          subject={editingSubject}
        />
      )}

      {isExamFormVisible && (
        <ExamForm isVisible={isExamFormVisible} onClose={handleCloseExamForm} exam={editingExam} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  switchContainer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
  },
  list: {
    padding: Spacing.md,
    gap: Spacing.md,
    paddingBottom: 100, // Space for floating button
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  floatingButton: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  floatingButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
});
