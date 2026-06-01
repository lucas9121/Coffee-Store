import { Image, StyleSheet } from "react-native";

import { ThemedView } from "./ui/themed-view";
import { ThemedText } from "./ui/themed-text";

import { spacing, radius } from "@/constants/tokens";
import { useThemeColor } from "@/hooks/use-theme-color";

type AppHeaderProps = {
  subtitle?: string;
};

export function AppHeader({ subtitle }: AppHeaderProps) {
  const borderColor = useThemeColor({}, "border");

  return (
    <ThemedView style={[styles.container, {borderColor}]}>
      <Image
        source={require("@/assets/images/logo.jpg")}
        style={styles.logo}
      />

      <ThemedView style={styles.textContainer}>
        <ThemedText type="subtitle">
          Catedral Coffee
        </ThemedText>

        {subtitle && (
          <ThemedText>
            {subtitle}
          </ThemedText>
        )}
      </ThemedView>
      
      <ThemedView style={styles.spacer}></ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.md
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: radius.pill,
  },
  textContainer: {
    gap: spacing.xs,
    flex: 1,
    alignItems: "center",
  },
  spacer: {
    width: 60,
  }
});