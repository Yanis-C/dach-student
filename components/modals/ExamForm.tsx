import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { DatePickerModal } from 'react-native-paper-dates';

import { BottomModal } from '@/components/base/BottomModal';
import { Button } from '@/components/base/Button';
import { Dropdown } from '@/components/base/Dropdown';
import { Input } from '@/components/base/Input';
import { ThemedText } from '@/components/base/ThemedText';
import { Colors } from '@/constants/Colors';
import { CommonStyles } from '@/constants/CommonStyles';
import { Radius, Spacing } from '@/constants/Spacing';
import { FontFamily, FontSize } from '@/constants/Typography';
import { ExamFormData, examSchema } from '@/types/Exam';
import SubjectForm from './SubjectForm';

dayjs.locale('fr');

type Props = {
  isVisible: boolean;
  onClose: () => void;
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
  const { control, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<ExamFormData>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      name: '',
      date: undefined,
      subjects: [],
    }
  });

  //UI state
  const [expandedSubjects, setExpandedSubjects] = useState<string[]>([]);

  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const selectedDate = watch('date');

  const {
    fields: subjectFields, append: appendSubject, remove: removeSubject, update: updateSubject
  } = useFieldArray({ control, name: 'subjects', keyName: '_id' });


  const onSubmit: SubmitHandler<ExamFormData> = (data: ExamFormData) => {
    console.log('Create exam with form data:', data);
    handleClose();
  }

  const [isSubjectFormVisible, setIsSubjectFormVisible] = useState(false);

  // Subjects not yet added to the exam
  const unselectedSubjectsDropdown = AVAILABLE_SUBJECTS
    .filter((s) => !subjectFields.find((sel) => sel.id === s.id))
    .map((s) => ({ id: s.id, label: s.name, color: s.color }));



  const [subjectToAdd, setSubjectToAdd] = useState<string | undefined>(undefined);

  const onSubjectAdd = () => {
    if (subjectToAdd === 'new') {
      setIsSubjectFormVisible(true);
    } else if (subjectToAdd) {
      handleAddSubject(subjectToAdd);
    }
    setSubjectToAdd(undefined);
  };


  // ===== Methods =====

  const handleAddSubject = (subjectId: string) => {
    const subject = AVAILABLE_SUBJECTS.find((s) => s.id === subjectId);
    if (subject) {
      const newSubject = {
        id: subject.id,
        coefficient: 1,
        chapters: subject.chapters.map((c) => ({ id: c.id, name: c.name, selected: false })),
      };
      appendSubject(newSubject);
    }
  };

  const toggleSubjectExpanded = (subjectId: string) => {
    setExpandedSubjects(prev =>
      prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const isExpanded = (subjectId: string) => expandedSubjects.includes(subjectId);

  const handleRemoveSubject = (subjectIndex: number) => {
    removeSubject(subjectIndex);
  };

  const toggleChapterSelected = (subjectIndex: number, chapterIndex: number) => {
    const currentValue = subjectFields[subjectIndex].chapters[chapterIndex].selected;
    setValue(`subjects.${subjectIndex}.chapters.${chapterIndex}.selected`, !currentValue);
  };

  //TODO: types
  const handleSubjectCreated = (subject: { name: string; color: string; icon: string }) => {
    console.log('New subject created in ExamForm:', subject);
    setIsSubjectFormVisible(false);
    //TODO: refresh AVAILABLE_SUBJECTS list with new subject from DB
  };

  const handleClose = () => {
    reset();
    setSubjectToAdd(undefined);
    onClose();
  };


  return (
    <BottomModal isVisible={isVisible} onClose={handleClose} title="Nouvel examen" height="65%">
      <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value }, fieldState: { error }, }) => (
            <Input
              label="Nom de l'examen"
              labelColor={Colors.greyText}
              labelIcon={"document-text-outline"}
              placeholder="Baccalauréat 2026"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={error?.message}
            />
          )}
        />

        {/* Date input */}
        <View style={CommonStyles.fieldSection}>
          <View style={CommonStyles.fieldHeader}>
            <Ionicons name="calendar-outline" size={16} color={Colors.greyText} />
            <ThemedText variant="label" color={Colors.greyText}>Date</ThemedText>
          </View>
          <View>
            <Pressable
              style={[CommonStyles.pickerInput, errors.date && CommonStyles.pickerInputError]}
              onPress={() => setDatePickerVisible(true)}
            >
              <ThemedText color={selectedDate ? Colors.black : Colors.greyText}>
                {selectedDate ? dayjs(selectedDate).format('D MMMM YYYY') : 'Sélectionner une date...'}
              </ThemedText>
            </Pressable>
            {errors.date && (
              <ThemedText variant="caption" color={Colors.error} style={{marginTop: Spacing.xs}}>{errors.date.message}</ThemedText>
            )}
          </View>
        </View>

        {/* Subjects & Chapters */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={CommonStyles.fieldHeader}>
              <Ionicons name="book-outline" size={16} color={Colors.greyText} />
              <ThemedText variant="label" color={Colors.greyText}>Matières</ThemedText>
            </View>

            {subjectToAdd && (
              <Pressable onPress={onSubjectAdd}>
                <ThemedText variant="caption" color={Colors.secondary} bold>+ Ajouter</ThemedText>
              </Pressable>
            )}
          </View>

          {/* Dropdown to add subjects */}
          <Dropdown
            options={[...unselectedSubjectsDropdown, { id: 'new', label: 'Nouvelle matière' }]}
            onChange={(optionId) => setSubjectToAdd(optionId)}
            value={subjectToAdd}
            placeholder="Ajouter une matière..."
          />

          {/* Selected subjects list */}
          <View style={styles.subjectsList}>
            {subjectFields.map((field, subjectIndex) => {
              const subjectData = AVAILABLE_SUBJECTS.find((s) => s.id === field.id);
              return (
                <View key={field._id} style={styles.subjectItem}>
                  {/* Subject header */}
                  <View style={styles.subjectHeader}>
                    <Pressable style={styles.subjectInfo} onPress={() => toggleSubjectExpanded(field.id)}>
                      <View style={[styles.colorDot, { backgroundColor: subjectData?.color }]} />
                      <ThemedText variant="body" bold>
                        {subjectData?.name}
                      </ThemedText>
                      <Ionicons name={isExpanded(field.id) ? 'chevron-up' : 'chevron-down'} size={18} color={Colors.greyText} />
                    </Pressable>

                    <View style={styles.subjectRight}>
                      <ThemedText variant="caption" color={Colors.greyText}>
                        Coef.
                      </ThemedText>
                      <Controller
                        control={control}
                        name={`subjects.${subjectIndex}.coefficient`}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextInput
                            style={styles.coefficientInput}
                            value={String(value ?? '')}
                            onChangeText={(text) => {
                              const num = parseInt(text, 10);
                              onChange(isNaN(num) ? '' : num);
                            }}
                            onBlur={() => {
                              if (!value || value === 0)
                                onChange(1);
                              onBlur();
                            }}
                            keyboardType="numeric"
                            maxLength={2}
                          />
                        )}
                      />
                      <Pressable onPress={() => handleRemoveSubject(subjectIndex)}>
                        <Ionicons name="close-circle" size={20} color={Colors.greyText} />
                      </Pressable>
                    </View>
                  </View>

                  {/* Chapters (expanded) */}
                  {isExpanded(field.id) && (
                    <View style={styles.chaptersContainer}>
                      {field.chapters.map((chapter, chapterIndex) => (
                        <Pressable key={chapter.id} style={styles.chapterItem}
                          onPress={() => toggleChapterSelected(subjectIndex, chapterIndex)}
                        >
                          <Ionicons name={chapter.selected ? 'checkbox' : 'square-outline'} size={22}
                            color={chapter.selected ? Colors.secondary : Colors.greyText}
                          />
                          <ThemedText variant="caption" color={chapter.selected ? Colors.black : Colors.greyText}>
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
              )
            }
            )}
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.buttonRow}>
          <Button
            title="Annuler"
            onPress={handleClose}
            variant="filled"
            color={Colors.greyText}
            backgroundColor={Colors.greyLight}
            style={CommonStyles.buttonFlex}
          />
          <Button
            title="Créer"
            variant="filled"
            iconLeft='add'
            backgroundColor={Colors.secondary}
            color={Colors.white}
            onPress={handleSubmit(onSubmit)}
            style={CommonStyles.buttonFlex}
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

      {/* Date Picker Modal */}
      <DatePickerModal
        locale="fr"
        mode="single"
        visible={datePickerVisible}
        onDismiss={() => setDatePickerVisible(false)}
        date={selectedDate}
        onConfirm={(params) => {
          setValue('date', params.date as Date);
          setDatePickerVisible(false);
        }}
      />
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
});
