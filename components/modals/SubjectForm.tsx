import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet } from 'react-native';
import { z } from 'zod';

import { BottomModal } from '@/components/base/BottomModal';
import { Button } from '@/components/base/Button';
import { Input } from '@/components/base/Input';
import { Radius, Spacing } from '@/constants/Spacing';
import { Colors } from '@/constants/Colors';

type Props = {
  isVisible: boolean;
  onClose: () => void;
};

const subjectSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Le nom de la matière est requis.' })
    .max(50, { message: 'Le nom ne peut pas dépasser 50 caractères.' }),
  color: z
    .string()
    .regex(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/, {
      message: 'Code hexadécimal invalide.',
    }),
  icon: z.string().optional(),
});

type SubjectFormData = z.infer<typeof subjectSchema>;

export default function SubjectForm({ isVisible, onClose }: Props) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: '',
      color: '#5856D6',
      icon: '',
    },
  });

  const onSubmit: SubmitHandler<SubjectFormData> = (data) => {
    console.log('Subject created:', data);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <BottomModal isVisible={isVisible} onClose={handleClose} title="Nouvelle matière" height={"60%"}>
      <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Nom de la matière"
              placeholder="Ex: Mathématiques"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="color"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Couleur"
              placeholder="#5856D6"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.color?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="icon"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Icône (optionnel)"
              placeholder="Ex: book"
              value={value ?? ''}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.icon?.message}
            />
          )}
        />

        <Button title="Créer la matière" style={styles.submitButton} onPress={() => handleSubmit(onSubmit)()} variant='filled' color={Colors.white} backgroundColor={Colors.secondary} />
      </ScrollView>
    </BottomModal>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.lg,
    flexGrow: 1,
  },
  submitButton: {
    width: '70%',
    alignSelf: 'center',
    marginTop: 'auto',
    borderRadius: Radius.lg,
  },
});
