import { TextInput, StyleSheet, type TextInputProps } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  lightBackgroundColor?: string;
  darkBackgroundColor?: string;
  lightBorderColor?: string;
  darkBorderColor?: string;
  lightPlaceholderColor?: string;
  darkPlaceholderColor?: string;
};

export function ThemedTextInput({ 
  style, 
  lightColor, 
  darkColor, 
  lightBackgroundColor,
  darkBackgroundColor,
  lightBorderColor,
  darkBorderColor,
  lightPlaceholderColor,
  darkPlaceholderColor,
  ...otherProps 
}: ThemedTextInputProps) {
  const textColor = useThemeColor(
    { light: lightColor, dark: darkColor }, 
    "text"
  );

  const backgroundColor = useThemeColor(
    {light: lightBackgroundColor, dark: darkBackgroundColor}, 
    "background"
  );

  const borderColor = useThemeColor(
    {light: lightBorderColor, dark: darkBorderColor},
    "border"
  );

  const placeholderTextColor = useThemeColor(
    {light: lightPlaceholderColor, dark: darkPlaceholderColor},
    "text"
  );

  return (
    <TextInput style={[
      styles.input,
      { 
        color: textColor,
        backgroundColor,
        borderColor
      },
      style
    ]} 
    placeholderTextColor={placeholderTextColor}
    {...otherProps} />
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    width: "100%"
  }
})