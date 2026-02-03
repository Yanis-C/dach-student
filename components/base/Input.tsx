import { TextInput, StyleSheet, View, ViewStyle, KeyboardTypeOptions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { Spacing, Radius } from '@/constants/Spacing';

import { ThemedText } from '@/components/base/ThemedText';

export interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  label?: string;
  labelIcon?: keyof typeof Ionicons.glyphMap;
  labelColor?: string;
  error?: string;
  disabled?: boolean;
  style?: ViewStyle;
  keyboardType?: KeyboardTypeOptions;
}

export function Input({
  value,
  onChangeText,
  onBlur,
  placeholder,
  label,
  labelIcon,
  labelColor = Colors.black,
  error,
  disabled = false,
  style,
  keyboardType,
}: InputProps) {
  return (
    <View style={style}>
      {label && (
        <View style={styles.labelContainer}>
          {labelIcon && (
            <Ionicons name={labelIcon} size={16} color={labelColor} />
          )}
          <ThemedText style={[styles.label, { color: labelColor }]}>
            {label}
          </ThemedText>
        </View>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholder={placeholder}
        placeholderTextColor={Colors.black + '60'}
        editable={!disabled}
        keyboardType={keyboardType}
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
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  label: {
    fontFamily: 'Comfortaa_700Bold',
    fontSize: 14,
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
