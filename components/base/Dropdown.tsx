import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';

import { ThemedText } from '@/components/base/ThemedText';
import { Colors } from '@/constants/Colors';
import { Radius, Spacing } from '@/constants/Spacing';

type DropdownOption = {
  id: string;
  label: string;
  color?: string;
};

interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  style?: ViewStyle;
}

export function Dropdown({
  options,
  value,
  onChange,
  placeholder = 'Sélectionner...',
  style,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((o) => o.id === value);

  const handleSelect = (optionId: string) => {
    onChange(optionId);
    setIsOpen(false);
  };

  return (
    <View style={style}>
      <Pressable
        style={styles.selectInput}
        onPress={() => setIsOpen(!isOpen)}
      >
        {selectedOption?.color && (
          <View style={[styles.colorDot, { backgroundColor: selectedOption.color }]} />
        )}
        <ThemedText
          style={styles.selectInputText}
          color={selectedOption ? Colors.black : Colors.greyText}
        >
          {selectedOption?.label || placeholder}
        </ThemedText>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={Colors.greyText}
        />
      </Pressable>
      {isOpen && (
        <View style={styles.dropdownList}>
          {options.map((option, index) => (
            <Pressable
              key={option.id}
              style={[
                styles.dropdownItem,
                index === options.length - 1 && styles.dropdownItemLast,
              ]}
              onPress={() => handleSelect(option.id)}
            >
              {option.color && (
                <View style={[styles.colorDot, { backgroundColor: option.color }]} />
              )}
              <ThemedText
                color={value === option.id ? Colors.secondary : Colors.black}
                bold={value === option.id}
              >
                {option.label}
              </ThemedText>
              {value === option.id && (
                <Ionicons
                  name="checkmark"
                  size={18}
                  color={Colors.secondary}
                  style={styles.checkIcon}
                />
              )}
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.greyLight,
    backgroundColor: Colors.white,
  },
  selectInputText: {
    flex: 1,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  dropdownList: {
    marginTop: Spacing.xs,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.greyLight,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.greyLight,
  },
  dropdownItemLast: {
    borderBottomWidth: 0,
  },
  checkIcon: {
    marginLeft: 'auto',
  },
});
