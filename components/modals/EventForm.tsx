import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import { z } from 'zod';

import { BottomModal } from '@/components/base/BottomModal';
import { Button } from '@/components/base/Button';
import { Dropdown } from '@/components/base/Dropdown';
import { Input } from '@/components/base/Input';
import { ThemedText } from '@/components/base/ThemedText';
import { Colors } from '@/constants/Colors';
import { Radius, Spacing } from '@/constants/Spacing';

dayjs.locale('fr');

type Props = {
  isVisible: boolean;
  onClose: () => void;
};

const MOCK_SUBJECTS = [
  { id: '1', name: 'Mathématiques', color: '#5856D6', icon: 'calculator' },
  { id: '2', name: 'Physique-Chimie', color: '#E67E22', icon: 'flask' },
  { id: '3', name: 'Français', color: '#34C759', icon: 'book' },
];

const EVENT_TYPES = [
  { id: 'activity', label: 'Activité', icon: 'fitness-outline' },
  { id: 'revision', label: 'Révision', icon: 'book-outline' },
] as const;


const eventSchema = z.object({
  type: z.enum(['activity', 'revision']),
  title: z
    .string()
    .min(1, { message: "Le titre de l'événement est requis." })
    .max(100, { message: 'Le titre ne peut pas dépasser 100 caractères.' }),
  subjectId: z.string().optional(),
  date: z.date({ message: 'La date est requise.' }),
  time: z.string().optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

export default function EventForm({ isVisible, onClose }: Props) {
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      type: 'activity',
      title: '',
      subjectId: undefined,
      date: undefined,
      time: '',
    },
  });

  const selectedType = watch('type');
  const selectedSubjectId = watch('subjectId');
  const selectedDate = watch('date');
  const selectedTime = watch('time');

  // Parse time string to hours/minutes for the time picker
  const parseTime = (timeStr: string | undefined) => {
    if (!timeStr) return { hours: 12, minutes: 0 };
    const [hours, minutes] = timeStr.split(':').map(Number);
    return { hours: hours || 12, minutes: minutes || 0 };
  };

  const { hours, minutes } = parseTime(selectedTime);

  const onSubmit: SubmitHandler<EventFormData> = (data) => {
    console.log('Event created:', data);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <BottomModal
      isVisible={isVisible}
      onClose={handleClose}
      title="Nouvel événement"
      height="75%"
    >
      <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
        {/* Event Type Selector */}
        <View style={styles.fieldSection}>
          <View style={styles.fieldHeader}>
            <Ionicons name="sparkles-outline" size={16} color={Colors.greyText} />
            <ThemedText variant="label" color={Colors.greyText}>
              Type d&apos;événement
            </ThemedText>
          </View>
          <View style={styles.typeSelector}>
            {EVENT_TYPES.map((eventType) => (
              <Pressable
                key={eventType.id}
                style={[
                  styles.typeButton,
                  selectedType === eventType.id && styles.typeButtonSelected,
                ]}
                onPress={() => {
                  setValue('type', eventType.id);
                  if (eventType.id === 'activity') {
                    setValue('subjectId', undefined);
                  }
                }}
              >
                <Ionicons
                  name={eventType.icon as keyof typeof Ionicons.glyphMap}
                  size={20}
                  color={selectedType === eventType.id ? Colors.secondary : Colors.greyText}
                />
                <ThemedText
                  variant="label"
                  color={selectedType === eventType.id ? Colors.secondary : Colors.greyText}
                >
                  {eventType.label}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Title Input */}
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Titre de l'événement"
              labelIcon="pencil-outline"
              placeholder="Ex: Séance de sport"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.title?.message}
            />
          )}
        />

        {/* Subject Selector (only for Révision) */}
        {selectedType === 'revision' && (
          <View style={styles.fieldSection}>
            <View style={styles.fieldHeader}>
              <Ionicons name="book-outline" size={16} color={Colors.greyText} />
              <ThemedText variant="label" color={Colors.greyText}>
                Matière
              </ThemedText>
            </View>
            <Dropdown
              options={MOCK_SUBJECTS.map((s) => ({ id: s.id, label: s.name, color: s.color }))}
              value={selectedSubjectId}
              onChange={(id) => setValue('subjectId', id)}
              placeholder="Sélectionner une matière..."
            />
          </View>
        )}

        {/* Date and Time Row */}
        <View style={styles.dateTimeRow}>
          {/* Date Picker */}
          <View style={[styles.fieldSection, { flex: 1 }]}>
            <View style={styles.fieldHeader}>
              <Ionicons name="calendar-outline" size={16} color={Colors.greyText} />
              <ThemedText variant="label" color={Colors.greyText}>
                Date
              </ThemedText>
            </View>
            <Pressable
              style={[styles.pickerInput, errors.date && styles.pickerInputError]}
              onPress={() => setDatePickerVisible(true)}
            >
              <ThemedText color={selectedDate ? Colors.black : Colors.greyText}>
                {selectedDate ? dayjs(selectedDate).format('D MMM YYYY') : 'Sélectionner...'}
              </ThemedText>
              <Ionicons name="calendar-outline" size={20} color={Colors.greyText} />
            </Pressable>
            {errors.date && (
              <ThemedText variant="caption" color={Colors.error}>
                {errors.date.message}
              </ThemedText>
            )}
          </View>

          {/* Time Picker */}
          <View style={[styles.fieldSection, { flex: 1 }]}>
            <View style={styles.fieldHeader}>
              <Ionicons name="time-outline" size={16} color={Colors.greyText} />
              <ThemedText variant="label" color={Colors.greyText}>
                Heure
              </ThemedText>
            </View>
            <Pressable
              style={styles.pickerInput}
              onPress={() => setTimePickerVisible(true)}
            >
              <ThemedText color={selectedTime ? Colors.black : Colors.greyText}>
                {selectedTime || 'Optionnel'}
              </ThemedText>
              <Ionicons name="time-outline" size={20} color={Colors.greyText} />
            </Pressable>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Annuler"
            onPress={handleClose}
            variant="outline"
            color={Colors.greyText}
            style={styles.cancelButton}
          />
          <Button
            title="Créer ✓"
            onPress={() => handleSubmit(onSubmit)()}
            variant="filled"
            color={Colors.white}
            backgroundColor={Colors.secondary}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>

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

      {/* Time Picker Modal */}
      <TimePickerModal
        locale="fr"
        visible={timePickerVisible}
        onDismiss={() => setTimePickerVisible(false)}
        hours={hours}
        minutes={minutes}
        onConfirm={(params) => {
          setValue('time', `${params.hours}:${params.minutes.toString().padStart(2, '0')}`);
          setTimePickerVisible(false);
        }}
      />
    </BottomModal>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.xl,
    flexGrow: 1,
    paddingBottom: Spacing.lg,
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
  typeSelector: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.greyLight,
    backgroundColor: Colors.white,
  },
  typeButtonSelected: {
    borderWidth: 2,
    borderColor: Colors.secondary,
    borderStyle: 'dashed',
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  pickerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.greyLight,
    backgroundColor: Colors.white,
  },
  pickerInputError: {
    borderColor: Colors.error,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: 'auto',
    paddingTop: Spacing.lg,
  },
  cancelButton: {
    flex: 1,
    borderRadius: Radius.lg,
  },
  submitButton: {
    flex: 1,
    borderRadius: Radius.lg,
  },
});
