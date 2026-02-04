import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { BottomModal } from '@/components/base/BottomModal';
import { Button } from '@/components/base/Button';
import { Dropdown } from '@/components/base/Dropdown';
import { Input } from '@/components/base/Input';
import { ThemedText } from '@/components/base/ThemedText';
import { Colors } from '@/constants/Colors';
import { Radius, Spacing } from '@/constants/Spacing';
import { FontFamily, FontSize } from '@/constants/Typography';
import SubjectForm from './SubjectForm';

type Props = {
  isVisible: boolean;
  onClose: () => void;
};

type Chapter = {
  id: string;
  name: string;
  selected: boolean;
};

type SubjectWithChapters = {
  id: string;
  name: string;
  color: string;
  coefficient: number;
  chapters: Chapter[];
  expanded: boolean;
};

// Available subjects that can be added to an exam
const AVAILABLE_SUBJECTS = [
  {
    id: '1',
    name: 'Mathématiques',
    color: Colors.secondary,
    chapters: [
      { id: '1', name: 'Chapitre 1 - Suites numériques' },
      { id: '2', name: 'Chapitre 2 - Limites et continuité' },
      { id: '3', name: 'Chapitre 5 - Intégrales' },
    ],
  },
  {
    id: '2',
    name: 'Physique-Chimie',
    color: Colors.primary,
    chapters: [
      { id: '1', name: 'Chapitre 1 - Mécanique' },
      { id: '2', name: 'Chapitre 2 - Thermodynamique' },
    ],
  },
  {
    id: '3',
    name: 'Français',
    color: Colors.success,
    chapters: [],
  },
  {
    id: '4',
    name: 'Philosophie',
    color: Colors.warning,
    chapters: [],
  },
];

export default function ExamForm({ isVisible, onClose }: Props) {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectWithChapters[]>([]);
  const [isSubjectFormVisible, setIsSubjectFormVisible] = useState(false);

  const [selectedSubjectId, setSelectedSubjectId] = useState<string | undefined>(undefined);

  // Subjects not yet added to the exam
  const unselectedSubjectsDropdown = AVAILABLE_SUBJECTS
    .filter((s) => !selectedSubjects.find((sel) => sel.id === s.id))
    .map((s) => ({ id: s.id, label: s.name, color: s.color }));


  const onSubjectAdd = () => {
    if (selectedSubjectId === 'add') {
      setIsSubjectFormVisible(true);
    } else if (selectedSubjectId) {
      handleAddSubject(selectedSubjectId);
    }
    setSelectedSubjectId(undefined);
  };

  const handleAddSubject = (subjectId: string) => {
    const subject = AVAILABLE_SUBJECTS.find((s) => s.id === subjectId);
    if (subject) {
      const newSubject: SubjectWithChapters = {
        id: subject.id,
        name: subject.name,
        color: subject.color,
        coefficient: 1,
        chapters: subject.chapters.map((c) => ({ ...c, selected: false })),
        expanded: false,
      };
      setSelectedSubjects((prev) => [...prev, newSubject]);
    }
  };

  const handleSubjectCreated = (subject: { name: string; color: string; icon: string }) => {
    console.log('New subject created in ExamForm:', subject);
    setIsSubjectFormVisible(false);
  };

  const handleRemoveSubject = (subjectId: string) => {
    setSelectedSubjects((prev) => prev.filter((s) => s.id !== subjectId));
  };

  const toggleSubjectExpanded = (subjectId: string) => {
    setSelectedSubjects((prev) =>
      prev.map((s) => (s.id === subjectId ? { ...s, expanded: !s.expanded } : s))
    );
  };

  const toggleChapterSelected = (subjectId: string, chapterId: string) => {
    setSelectedSubjects((prev) =>
      prev.map((s) =>
        s.id === subjectId
          ? {
            ...s,
            chapters: s.chapters.map((c) =>
              c.id === chapterId ? { ...c, selected: !c.selected } : c
            ),
          }
          : s
      )
    );
  };

  const updateCoefficient = (subjectId: string, value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) || value === '') {
      setSelectedSubjects((prev) =>
        prev.map((s) =>
          s.id === subjectId ? { ...s, coefficient: isNaN(num) ? 0 : num } : s
        )
      );
    }
  };

  const handleClose = () => {
    setName('');
    setDate('');
    setSelectedSubjectId(undefined);
    setSelectedSubjects([]);
    onClose();
  };

  const handleSubmit = () => {
    console.log('Create exam:', { name, date, subjects: selectedSubjects });
    handleClose();
  };

  return (
    <BottomModal isVisible={isVisible} onClose={handleClose} title="Nouvel examen" height="85%">
      <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
        {/* Name input */}
        <Input
          label="Nom de l'examen"
          placeholder="Baccalauréat 2026"
          value={name}
          onChangeText={setName}
        />

        {/* Date input */}
        <Input
          label="Date"
          labelIcon="calendar-outline"
          placeholder="15 Juin 2026"
          value={date}
          onChangeText={setDate}
        />

        {/* Subjects & Chapters */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText variant="label" color={Colors.greyText}>
              Matières
            </ThemedText>
            {selectedSubjectId && (
              <Pressable onPress={onSubjectAdd}>
                <ThemedText variant="caption" color={Colors.secondary} bold>
                  + Ajouter
                </ThemedText>
              </Pressable>

            )}
          </View>

          {/* Dropdown to add subjects */}
          <Dropdown
            options={[...unselectedSubjectsDropdown, { id: 'add', label: 'Nouvelle matière' }]}
            onChange={(optionId) =>  setSelectedSubjectId(optionId)}
            value={selectedSubjectId}
            placeholder="Ajouter une matière..."
          />

          {/* Selected subjects list */}
          <View style={styles.subjectsList}>
            {selectedSubjects.map((subject) => (
              <View key={subject.id} style={styles.subjectItem}>
                {/* Subject header */}
                <View style={styles.subjectHeader}>
                  <Pressable
                    style={styles.subjectInfo}
                    onPress={() => toggleSubjectExpanded(subject.id)}
                  >
                    <View style={[styles.colorDot, { backgroundColor: subject.color }]} />
                    <ThemedText variant="body" bold>
                      {subject.name}
                    </ThemedText>
                    <Ionicons
                      name={subject.expanded ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color={Colors.greyText}
                    />
                  </Pressable>
                  <View style={styles.subjectRight}>
                    <ThemedText variant="caption" color={Colors.greyText}>
                      Coef.
                    </ThemedText>
                    <TextInput
                      style={styles.coefficientInput}
                      value={subject.coefficient.toString()}
                      onChangeText={(value) => updateCoefficient(subject.id, value)}
                      keyboardType="numeric"
                      maxLength={2}
                    />
                    <Pressable onPress={() => handleRemoveSubject(subject.id)}>
                      <Ionicons name="close-circle" size={20} color={Colors.greyText} />
                    </Pressable>
                  </View>
                </View>

                {/* Chapters (expanded) */}
                {subject.expanded && (
                  <View style={styles.chaptersContainer}>
                    {subject.chapters.map((chapter) => (
                      <Pressable
                        key={chapter.id}
                        style={styles.chapterItem}
                        onPress={() => toggleChapterSelected(subject.id, chapter.id)}
                      >
                        <Ionicons
                          name={chapter.selected ? 'checkbox' : 'square-outline'}
                          size={22}
                          color={chapter.selected ? Colors.secondary : Colors.greyText}
                        />
                        <ThemedText
                          variant="caption"
                          color={chapter.selected ? Colors.black : Colors.greyText}
                        >
                          {chapter.name}
                        </ThemedText>
                      </Pressable>
                    ))}
                    <Pressable style={styles.addChapterButton}>
                      <ThemedText variant="caption" color={Colors.secondary}>
                        + Nouveau chapitre
                      </ThemedText>
                    </Pressable>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.buttonRow}>
          <Button
            title="Annuler"
            variant="outline"
            onPress={handleClose}
            style={styles.cancelButton}
          />
          <Button
            title="+ Créer l'examen"
            variant="filled"
            backgroundColor={Colors.secondary}
            color={Colors.white}
            onPress={handleSubmit}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>

      {/* Subject Form Modal */}
      {isSubjectFormVisible && (
        <SubjectForm
          isVisible={isSubjectFormVisible}
          onClose={() => setIsSubjectFormVisible(false)}
          onSubjectCreated={handleSubjectCreated}
        />
      )}
    </BottomModal>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  section: {
    gap: Spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectsList: {
    gap: Spacing.sm,
  },
  subjectItem: {
    backgroundColor: Colors.greyLight + '50',
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
  },
  subjectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  subjectRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  coefficientInput: {
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Radius.sm,
    textAlign: 'center',
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xxs,
    color: Colors.black,
  },
  chaptersContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    gap: Spacing.xs,
  },
  chapterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  addChapterButton: {
    paddingVertical: Spacing.xs,
    marginTop: Spacing.xs,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 1.5,
  },
});
