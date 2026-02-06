import { Ionicons } from '@expo/vector-icons';
import Head from 'expo-router/head';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

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
import { useDrizzle } from '@/hooks/useDrizzle';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import { Subject } from '@/types/Subject';

type ViewType = 'exams' | 'subjects';

type MockExam = {
  id: string;
  type: 'baccalaureat' | 'controle' | 'oral';
  title: string;
  dateRange: string;
  dateSubtext: string;
  subjects: { name: string; color: string }[];
  preparation: number;
  color: string;
};

const MOCK_EXAMS: MockExam[] = [
  {
    id: '1',
    type: 'baccalaureat',
    title: 'Épreuves de Juin',
    dateRange: '15-22 Juin',
    dateSubtext: 'dans 45 jours',
    subjects: [
      { name: 'Maths', color: Colors.secondary },
      { name: 'Physique', color: Colors.success },
    ],
    preparation: 45,
    color: Colors.success,
  },
  {
    id: '2',
    type: 'controle',
    title: 'DS Mathématiques',
    dateRange: 'Lun 12',
    dateSubtext: '10:00 • 2h',
    subjects: [{ name: 'Chapitre 3 - Fonctions', color: Colors.secondary }],
    preparation: 65,
    color: Colors.secondary,
  },
  {
    id: '3',
    type: 'oral',
    title: 'Exposé Histoire',
    dateRange: 'Ven 16',
    dateSubtext: '09:00 • 20min',
    subjects: [{ name: 'La Révolution française', color: Colors.error }],
    preparation: 20,
    color: Colors.error,
  },
];

export default function ExamsScreen() {
  const db = useDrizzle();
  const { data: subjects } = useLiveQuery(db.select().from(schema.subjects));

  const [activeView, setActiveView] = useState<ViewType>('exams');
  const [editingSubject, setEditingSubject] = useState<Subject | undefined>(undefined);
  const [isCreatingSubject, setIsCreatingSubject] = useState(false);
  const [isExamFormVisible, setIsExamFormVisible] = useState(false);

  const isSubjectFormVisible = isCreatingSubject || editingSubject !== undefined;

  const handleAddPress = () => {
    if (activeView === 'subjects') {
      setIsCreatingSubject(true);
    } else {
      setIsExamFormVisible(true);
    }
  };

  const handleCloseSubjectForm = () => {
    setIsCreatingSubject(false);
    setEditingSubject(undefined);
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
          data={MOCK_EXAMS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <ThemedText variant="subheading">À venir</ThemedText>
              <Tag
                text="3 cette semaine"
                color={Colors.primary}
                backgroundColor={Colors.primary + '20'}
              />
            </View>
          }
          renderItem={({ item }) => (
            <ExamCard
              type={item.type}
              title={item.title}
              dateRange={item.dateRange}
              dateSubtext={item.dateSubtext}
              subjects={item.subjects}
              preparation={item.preparation}
              color={item.color}
              onPress={() => console.log('pressed', item.title)}
            />
          )}
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
        <ExamForm isVisible={isExamFormVisible} onClose={() => setIsExamFormVisible(false)} />
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
