import { View, type ViewProps, type ViewStyle } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";
import { spacing, radius } from "@/constants/tokens"

type SpacingKey = keyof typeof spacing;
type RadiusKey = keyof typeof radius;

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;

  padding?: SpacingKey;
  paddingHorizontal?: SpacingKey;
  paddingVertical?: SpacingKey;

  margin?: SpacingKey;
  marginTop?: SpacingKey;
  marginBottom?: SpacingKey;

  gap?: SpacingKey;

  radius?: RadiusKey;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,

  padding,
  paddingHorizontal,
  paddingVertical,

  margin,
  marginTop,
  marginBottom,

  gap,

  radius: radiusSize,

  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  const tokenStyles: ViewStyle = {
    backgroundColor,

    padding: padding ? spacing[padding] : undefined,
    paddingHorizontal: paddingHorizontal
      ? spacing[paddingHorizontal]
      : undefined,
    paddingVertical: paddingVertical
      ? spacing[paddingVertical]
      : undefined,

    margin: margin ? spacing[margin] : undefined,
    marginTop: marginTop ? spacing[marginTop] : undefined,
    marginBottom: marginBottom
      ? spacing[marginBottom]
      : undefined,

    gap: gap ? spacing[gap] : undefined,

    borderRadius: radiusSize ? radius[radiusSize] : undefined,
  };

  return <View style={[tokenStyles, style]} {...otherProps} />;
}


// export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
//   const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

//   return <View style={[{ backgroundColor }, style]} {...otherProps} />;
// }
