import { Text, TextProps, StyleSheet } from 'react-native';

export function ThemedText({ style, ...props }: TextProps) {
  return <Text style={[styles.default, style]} {...props} />;
}

const styles = StyleSheet.create({
  default: {
    fontFamily: 'Comfortaa_400Regular',
  },
});
