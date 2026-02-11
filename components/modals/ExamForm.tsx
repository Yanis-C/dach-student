import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
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
import * as schema from '@/db/schema';
import { useDrizzle } from '@/hooks/useDrizzle';
import { ExamFormData, examSchema } from '@/types/Exam';
import SubjectForm from './SubjectForm';

dayjs.locale('fr');

type ExamWithSubjects = {
  id: number;
  name: string;
  date: Date;
  subjects: {
    subjectId: number;
    coefficient: number;
  }[];
};

type Props = {
  isVisible: boolean;
  onClose: () => void;
  exam?: ExamWithSubjects;
};

export default function ExamForm({ isVisible, onClose, exam }: Props) {
  const db = useDrizzle();
  const isEditMode = !!exam;

  // Load subjects and chapters from database
  const { data: dbSubjects } = useLiveQuery(db.select().from(schema.subjects));
  const { data: dbChapters } = useLiveQuery(db.select().from(schema.chapters));

  // Build subjects with their chapters (memoized to prevent infinite loops)
  const availableSubjects = useMemo(() => {
    return (dbSubjects ?? []).map((subject) => ({
      id: String(subject.id),
      name: subject.name,
      color: subject.color,
      chapters: (dbChapters ?? [])
        .filter((chapter) => chapter.subjectId === subject.id)
        .map((chapter) => ({
          id: String(chapter.id),
          name: chapter.name,
        })),
    }));
  }, [dbSubjects, dbChapters]);

  const { control, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<ExamFormData>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      name: '',
      date: undefined,
      subjects: [],
    }
  });

  // Populate form when editing
  useEffect(() => {
    if (exam && availableSubjects.length > 0) {
      reset({
        name: exam.name,
        date: exam.date,
        subjects: exam.subjects.map((examSubject) => {
          const subject = availableSubjects.find((s) => s.id === String(examSubject.subjectId));
          return {
            id: String(examSubject.subjectId),
            coefficient: examSubject.coefficient,
            chapters: subject?.chapters.map((c) => ({
              id: c.id,
              name: c.name,
              selected: false
            })) ?? [],
          };
        }),
      });
    } else if (!exam) {
      reset({
        name: '',
        date: undefined,
        subjects: [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exam, availableSubjects]);

  //UI state
  const [expandedSubjects, setExpandedSubjects] = useState<string[]>([]);

  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const selectedDate = watch('date');

  const {
    fields: subjectFields, append: appendSubject, remove: removeSubject
  } = useFieldArray({ control, name: 'subjects', keyName: '_id' });


  const onSubmit: SubmitHandler<ExamFormData> = (data: ExamFormData) => {
    if (isEditMode) {
      // Update existing exam
      db.update(schema.exams)
        .set({ name: data.name, date: data.date })
        .where(eq(schema.exams.id, exam.id))
        .run();

      // Delete old subject associations
      db.delete(schema.examsToSubjects)
        .where(eq(schema.examsToSubjects.examId, exam.id))
        .run();

      // Insert new subject associations
      data.subjects.forEach((subject) => {
        db.insert(schema.examsToSubjects).values({
          examId: exam.id,
          subjectId: Number(subject.id),
          coefficient: subject.coefficient,
        }).run();
      });
    } else {
      // Create new exam
      const result = db.insert(schema.exams).values({
        name: data.name,
        date: data.date,
      }).returning({ id: schema.exams.id }).get();

      // Insert subject associations
      if (result) {
        data.subjects.forEach((subject) => {
          db.insert(schema.examsToSubjects).values({
            examId: result.id,
            subjectId: Number(subject.id),
            coefficient: subject.coefficient,
          }).run();
        });
      }
    }
    handleClose();
  }

  const [isSubjectFormVisible, setIsSubjectFormVisible] = useState(false);

  // Subjects not yet added to the exam
  const unselectedSubjectsDropdown = availableSubjects
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

  const handleDelete = () => {
    Alert.alert(
      "Supprimer l'examen",
      "Êtes-vous sûr de vouloir supprimer cet examen ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            if (exam) {
              // Delete exam (cascade will delete examsToSubjects entries)
              db.delete(schema.exams)
                .where(eq(schema.exams.id, exam.id))
                .run();
              onClose();
            }
          }
        }
      ]
    );
  };

  const handleAddSubject = (subjectId: string) => {
    const subject = availableSubjects.find((s) => s.id === subjectId);
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

  const handleSubjectCreated = () => {
    setIsSubjectFormVisible(false);
    // availableSubjects will auto-refresh via useLiveQuery
  };

  const handleClose = () => {
    reset();
    setSubjectToAdd(undefined);
    onClose();
  };


  return (
    <BottomModal isVisible={isVisible} onClose={handleClose} title={isEditMode ? "Modifier l'examen" : "Nouvel examen"} height="65%">
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
              const subjectData = availableSubjects.find((s) => s.id === field.id);
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
        {isEditMode ? (
          <View style={styles.buttonRow}>
            <Button
              title="Supprimer"
              iconLeft="trash-outline"
              onPress={handleDelete}
              variant="outline"
              color={Colors.error}
              backgroundColor={Colors.error}
              style={CommonStyles.buttonFlex}
            />
            <Button
              title="Enregistrer"
              onPress={handleSubmit(onSubmit)}
              variant="filled"
              color={Colors.white}
              backgroundColor={Colors.secondary}
              style={CommonStyles.buttonFlex}
            />
          </View>
        ) : (
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
        )}
      </ScrollView>

      {/* Subject Form Modal */}
      {isSubjectFormVisible && (
        <SubjectForm
          isVisible={isSubjectFormVisible}
          onClose={handleSubjectCreated}
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
