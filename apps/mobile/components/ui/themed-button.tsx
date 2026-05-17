import { Pressable, StyleSheet, type PressableProps, type ViewStyle } from "react-native";
import { ThemedText } from "./themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import { spacing, radius, buttonHeight, fontSize } from "@/constants/tokens";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type ThemedButtonProps = PressableProps & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  style?: ViewStyle;
};

export function ThemedButton({
  variant = "primary",
  size = "md",
  children,
  style,
  disabled,
  ...otherProps
}: ThemedButtonProps) {
  const primary = useThemeColor({}, "primary");
  const secondary = useThemeColor({}, "secondary");
  const danger = useThemeColor({}, "danger");
  const borderColor = useThemeColor({}, "border");
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "surface");

  const variantStyle: ViewStyle =
    variant === "primary" ? 
      { backgroundColor: primary, borderColor: primary } :
    variant === "secondary" ?
      { backgroundColor: secondary, borderColor: secondary } :
    variant === "danger" ?
      { backgroundColor: danger, borderColor: danger } 
    :
      { backgroundColor, borderColor };

  const labelColor = variant === "ghost" ? textColor : "#FFFFFF";

  const sizeStyle: ViewStyle = {
    minHeight: buttonHeight[size],
    paddingHorizontal: size === "sm" ? spacing.md : size === "md" ? spacing.lg : spacing.xl
  };

  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        variantStyle,
        sizeStyle,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style
      ]}
      {...otherProps}
    >
      <ThemedText
        style={[
          styles.text,
          {
            color: labelColor,
            fontSize: size === "sm" ? fontSize.sm : size === "md" ? fontSize.md : fontSize.lg
          }
        ]}
      >
        {children}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "600",
    textAlign: "center",
  },
  pressed: {
    opacity: 0.75,
  },
  disabled: {
    opacity: 0.5,
  }
});