import { useEffect } from 'react';
import { Alert, FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { eq } from 'drizzle-orm';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { BottomModal } from '@/components/base/BottomModal';
import { Button } from '@/components/base/Button';
import { Input } from '@/components/base/Input';
import { ThemedText } from '@/components/base/ThemedText';
import { Colors } from '@/constants/Colors';
import { CommonStyles } from '@/constants/CommonStyles';
import { Radius, Spacing } from '@/constants/Spacing';
import { Subject, SubjectFormData, subjectSchema } from '@/types/Subject';
import { useDrizzle } from '@/hooks/useDrizzle';
import * as schema from '@/db/schema';

type Props = {
  isVisible: boolean;
  onClose: () => void;
  subject?: Subject; // If provided, form is in edit mode
};

const THEME_COLORS = [
  '#5856D6', // Purple
  '#34C759', // Green
  '#FF9500', // Orange
  '#FFCC00', // Yellow
  '#FF2D55', // Pink
  '#00BCD4', // Cyan
  '#E67E22', // Dark Orange
  '#9C27B0', // Deep Purple
  '#3F51B5', // Indigo
  '#009688', // Teal
  '#795548', // Brown
  '#607D8B', // Blue Grey
];

const THEME_ICONS = [
  'calculator',
  'book',
  'flask',
  'language',
  'globe',
  'musical-notes',
  'fitness',
  'brush',
  'code-slash',
  'hardware-chip',
  'leaf',
  'people',
] as const;

export default function SubjectForm({ isVisible, onClose, subject }: Props) {
  const db = useDrizzle();
  const isEditMode = !!subject;

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: '',
      color: THEME_COLORS[0],
      icon: THEME_ICONS[0],
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (subject) {
      reset({
        name: subject.name,
        color: subject.color,
        icon: subject.icon,
      });
    } else {
      reset({
        name: '',
        color: THEME_COLORS[0],
        icon: THEME_ICONS[0],
      });
    }
  }, [subject, reset]);

  const selectedColor = watch('color');
  const selectedIcon = watch('icon');

  const onSubmit: SubmitHandler<SubjectFormData> = (data) => {
    if (isEditMode) {
      db.update(schema.subjects)
        .set({ name: data.name, color: data.color, icon: data.icon })
        .where(eq(schema.subjects.id, subject.id))
        .run();
    } else {
      db.insert(schema.subjects).values({
        name: data.name,
        color: data.color,
        icon: data.icon,
      }).run();
    }
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleDelete = () => {
    Alert.alert(
      "Supprimer la matière",
      "Êtes-vous sûr de vouloir supprimer cette matière ?",
      [
        { text: " Annuler ", style: "cancel" },
        {
          text: " Supprimer ",
          style: "destructive",
          onPress: () => {
            if (subject) {
              db.delete(schema.subjects)
                .where(eq(schema.subjects.id, subject.id))
                .run();
              onClose();
            }
          }
        }
      ]
    );
  };

  return (
    <BottomModal isVisible={isVisible} onClose={handleClose} title={isEditMode ? "Modifier la matière" : "Nouvelle matière"} height="60%">
      <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
        {/* Name Field */}
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Nom de la matière"
              labelIcon="book-outline"
              placeholder="Ex: Mathématiques"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.name?.message}
            />
          )}
        />

        {/* Color Picker */}
        <View style={CommonStyles.fieldSection}>
          <View style={CommonStyles.fieldHeader}>
            <Ionicons name="color-palette-outline" size={16} color={Colors.greyText} />
            <ThemedText variant="label" color={Colors.greyText}>
              Couleur
            </ThemedText>
          </View>
          <FlatList
            data={THEME_COLORS}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pickerList}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable
                style={[styles.colorCircle, { backgroundColor: item }]}
                onPress={() => setValue('color', item)}
              >
                {selectedColor === item && (
                  <Ionicons name="checkmark" size={20} color={Colors.white} />
                )}
              </Pressable>
            )}
          />
        </View>

        {/* Icon Picker */}
        <View style={CommonStyles.fieldSection}>
          <View style={CommonStyles.fieldHeader}>
            <Ionicons name="sparkles-outline" size={16} color={Colors.greyText} />
            <ThemedText variant="label" color={Colors.greyText}>
              Icône
            </ThemedText>
          </View>
          <FlatList
            data={THEME_ICONS}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pickerList}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable
                style={[
                  styles.iconButton,
                  selectedIcon === item && styles.iconButtonSelected,
                ]}
                onPress={() => setValue('icon', item)}
              >
                <Ionicons
                  name={item as keyof typeof Ionicons.glyphMap}
                  size={22}
                  color={selectedIcon === item ? Colors.secondary : Colors.greyText}
                />
              </Pressable>
            )}
          />
        </View>

        {isEditMode ? (
          <View style={styles.buttonRow}>
            <Button
              title="Supprimer"
              iconLeft="trash-outline"
              onPress={handleDelete}
              variant="outline"
              color={Colors.error}
              backgroundColor={Colors.error}
              style={styles.editButton}
            />
            <Button
              title="Enregistrer"
              onPress={() => handleSubmit(onSubmit)()}
              variant="filled"
              color={Colors.white}
              backgroundColor={Colors.secondary}
              style={styles.editButton}
            />
          </View>
        ) : (
          <Button
            title="Créer la matière"
            style={styles.submitButton}
            onPress={() => handleSubmit(onSubmit)()}
            variant="filled"
            color={Colors.white}
            backgroundColor={Colors.secondary}
          />
        )}
      </ScrollView>
    </BottomModal>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.xl,
    flexGrow: 1,
  },
  pickerList: {
    gap: Spacing.sm,
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.greyLight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  iconButtonSelected: {
    borderWidth: 2,
    borderColor: Colors.secondary,
    borderStyle: 'dashed',
  },
  submitButton: {
    width: '70%',
    alignSelf: 'center',
    marginTop: 'auto',
    borderRadius: Radius.lg,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginTop: 'auto',
  },
  editButton: {
    flex: 1,
    borderRadius: Radius.lg,
  },
});
