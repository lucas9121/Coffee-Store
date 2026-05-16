import { TextInput, View, StyleSheet, type TextInputProps, type ViewStyle, type TextStyle} from "react-native";
import { ReactNode } from "react";
import { useThemeColor } from "@/hooks/use-theme-color";
import { spacing, radius, fontSize, buttonHeight} from "@/constants/tokens";

type SpacingKey = keyof typeof spacing;
type RadiusKey = keyof typeof radius;
type FontSizeKey = keyof typeof fontSize;
type HeightKey = keyof typeof buttonHeight;

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
  paddingHorizontalSize?: SpacingKey;
  paddingVerticalSize?: SpacingKey;
  radiusSize?: RadiusKey;
  fontSizeSize?: FontSizeKey;
  heightSize?: HeightKey;
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
  paddingHorizontalSize = "md",
  paddingVerticalSize = "sm",
  radiusSize = "md",
  fontSizeSize = "md",
  heightSize = "md",
  ...otherProps
}: ThemedTextInputProps) {
  const textColor = useThemeColor( {light: lightColor, dark: darkColor},"text");
  const backgroundColor = useThemeColor({light: lightBackgroundColor, dark: darkBackgroundColor}, "surface");
  const borderColor = useThemeColor({light: lightBorderColor, dark: darkBorderColor}, "border");
  const placeholderTextColor = useThemeColor({light: lightPlaceholderColor, dark: darkPlaceholderColor}, "mutedText");

  const tokenContainerStyle: ViewStyle = {
    backgroundColor,
    borderColor,
    borderRadius: radius[radiusSize],
    paddingHorizontal: spacing[paddingHorizontalSize],
    minHeight: buttonHeight[heightSize],
  };

  const tokenInputStyle: TextStyle = {
    color: textColor,
    fontSize: fontSize[fontSizeSize],
    paddingVertical: spacing[paddingVerticalSize],
  };

  return (
    <View
      style={[styles.container, tokenContainerStyle, containerStyle]}
    >
      <TextInput
        style={[styles.input, tokenInputStyle, style]}
        placeholderTextColor={placeholderTextColor}
        {...otherProps}
      />
      {rightAccessory ? (
        <View style={styles.accessory}>
          {rightAccessory}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  input: {
    flex: 1,
  },

  accessory: {
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});