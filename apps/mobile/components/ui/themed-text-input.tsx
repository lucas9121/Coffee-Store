import { TextInput, View, StyleSheet, type TextInputProps, type ViewStyle } from 'react-native';
import { ReactNode } from 'react';
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
  rightAccessory?: ReactNode;
  containerStyle?: ViewStyle;
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
  rightAccessory,
  containerStyle,
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
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          borderColor
        },
        containerStyle
      ]}
    >
      <TextInput 
        style={[
          styles.input,
          { 
            color: textColor
          },
          style
        ]} 
        placeholderTextColor={placeholderTextColor}
        {...otherProps} 
      />
      
      {rightAccessory ? (
        <View style={styles.accessory}>{rightAccessory}</View>
      ): null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 12,
    paddingRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
  },
  accessory: {
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
  }
});