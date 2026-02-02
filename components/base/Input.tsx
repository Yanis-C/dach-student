import { TextInput, StyleSheet, View, ViewStyle } from 'react-native';

import { Colors } from '@/constants/Colors';
import { Spacing, Radius } from '@/constants/Spacing';

import { ThemedText } from '@/components/base/ThemedText';


interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Input({
  value,
  onChangeText,
  onBlur,
  placeholder,
  label,
  error,
  disabled = false,
  style,
}: InputProps) {
  return (
    <View style={style}>
      {label && <ThemedText style={styles.label}>{label}</ThemedText>}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholder={placeholder}
        placeholderTextColor={Colors.black + '60'}
        editable={!disabled}
        style={[
          styles.input,
          error && styles.inputError,
          disabled && styles.disabled,
        ]}
      />
      {error && <ThemedText style={styles.error}>{error}</ThemedText>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: 'Comfortaa_700Bold',
    fontSize: 14,
    color: Colors.black,
    marginBottom: Spacing.xs,
  },
  input: {
    fontFamily: 'Comfortaa_400Regular',
    fontSize: 16,
    color: Colors.black,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.black + '20',
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  inputError: {
    borderColor: Colors.error,
  },
  disabled: {
    opacity: 0.5,
  },
  error: {
    fontFamily: 'Comfortaa_400Regular',
    fontSize: 12,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
});
