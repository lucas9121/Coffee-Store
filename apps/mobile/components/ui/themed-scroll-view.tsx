import { ScrollView, type ScrollViewProps, type ViewStyle } from "react-native";
import { useThemeColor } from "@/hooks/use-theme-color";
import { spacing } from "@/constants/tokens";

type SpacingKey = keyof typeof spacing;

export type ThemedScrollViewProps = ScrollViewProps & {
  lightColor?: string;
  darkColor?: string;
  padding?: SpacingKey;
  gap?: SpacingKey;
};

export function ThemedScrollView({
  style,
  contentContainerStyle,
  lightColor,
  darkColor,
  padding,
  gap,
  ...otherProps
}: ThemedScrollViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "background");
  const tokenContentStyle: ViewStyle = {
    padding: padding ? spacing[padding] : undefined,
    gap: gap ? spacing[gap] : undefined,
    flexGrow: 1,
  };

  return (
    <ScrollView
      style={[
        {flex: 1, backgroundColor},
        style,
      ]}
      contentContainerStyle={[tokenContentStyle, contentContainerStyle]}
      {...otherProps}
    />
  );
}