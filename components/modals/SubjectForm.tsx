import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { z } from 'zod';

import { BottomModal } from '@/components/base/BottomModal';
import { Button } from '@/components/base/Button';
import { Input } from '@/components/base/Input';
import { ThemedText } from '@/components/base/ThemedText';
import { Radius, Spacing } from '@/constants/Spacing';
import { Colors } from '@/constants/Colors';
import { useSubjectsStore } from '@/stores/subjectsStore';

type Props = {
  isVisible: boolean;
  onClose: () => void;
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

const subjectSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Le nom de la matière est requis.' })
    .max(50, { message: 'Le nom ne peut pas dépasser 50 caractères.' }),
  color: z.string().min(1),
  icon: z.string().min(1),
});

type SubjectFormData = z.infer<typeof subjectSchema>;

export default function SubjectForm({ isVisible, onClose }: Props) {
  const addSubject = useSubjectsStore((state) => state.addSubject);

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

  const selectedColor = watch('color');
  const selectedIcon = watch('icon');

  const onSubmit: SubmitHandler<SubjectFormData> = (data) => {
    addSubject({
      name: data.name,
      color: data.color,
      icon: data.icon,
      chapters: 0,
      completedChapters: 0,
    });
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <BottomModal isVisible={isVisible} onClose={handleClose} title="Nouvelle matière" height="60%">
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
        <View style={styles.fieldSection}>
          <View style={styles.fieldHeader}>
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
        <View style={styles.fieldSection}>
          <View style={styles.fieldHeader}>
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

        <Button
          title="Créer la matière"
          style={styles.submitButton}
          onPress={() => handleSubmit(onSubmit)()}
          variant="filled"
          color={Colors.white}
          backgroundColor={Colors.secondary}
        />
      </ScrollView>
    </BottomModal>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.xl,
    flexGrow: 1,
  },
  fieldSection: {
    gap: Spacing.sm,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'flex-start',
    gap: Spacing.sm,
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
});
