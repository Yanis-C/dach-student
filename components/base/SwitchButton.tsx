import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';

import { ThemedText } from '@/components/base/ThemedText';
import { Colors } from '@/constants/Colors';
import { Radius, Spacing } from '@/constants/Spacing';


interface SwitchButtonProps<T extends string> {
  options: [T, T];
  labels: [string, string];
  value: T;
  onChange: (value: T) => void;
  radius?: number;
  style?: ViewStyle;
  activeStyle?: ViewStyle;
  activeTextColor?: string;
}

export function SwitchButton<T extends string>({
  options,
  labels,
  value,
  onChange,
  radius = Radius.full,
  style,
  activeStyle,
  activeTextColor = Colors.black,
}: SwitchButtonProps<T>) {
  return (
    <View style={[styles.container, { borderRadius: radius }, style]}>
      {options.map((option, index) => {
        const isActive = value === option;
        return (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            style={({ pressed }) => [
              styles.button,
              { borderRadius: radius },
              isActive && [styles.activeButton, activeStyle],
              pressed && !isActive && styles.pressed,
            ]}
          >
            <ThemedText
              bold={isActive}
              color={isActive ? activeTextColor : Colors.greyText}
            >
              {labels[index]}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.greyLight,
    padding: Spacing.xs,
  },
  button: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: Colors.white,
    color: Colors.black,
  },
  pressed: {
    opacity: 0.7,
  },
});
