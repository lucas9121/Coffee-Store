import { Image, StyleSheet } from "react-native";

import { ThemedView } from "./ui/themed-view";
import { ThemedText } from "./ui/themed-text";

import { spacing, radius } from "@/constants/tokens";

type AppHeaderProps = {
  subtitle?: string;
};

export function AppHeader({ subtitle }: AppHeaderProps) {
  return (
    <ThemedView style={styles.container}>
      <Image
        source={require("@/assets/images/logo.jpg")}
        style={styles.logo}
      />

      <ThemedView style={styles.textContainer}>
        <ThemedText type="subtitle">
          Church Coffee
        </ThemedText>

        {subtitle && (
          <ThemedText>
            {subtitle}
          </ThemedText>
        )}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: radius.pill,
  },
  textContainer: {
    gap: spacing.xs,
  },
});