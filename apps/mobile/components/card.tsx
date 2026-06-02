import { StyleSheet } from "react-native";
import { ThemedView } from "./ui/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { spacing } from "@/constants/tokens";

export function Card({ children }: { children: React.ReactNode }) {
  const borderColor = useThemeColor({}, "border");
  const shadowColor = useThemeColor({}, "text");
  const cardColor = useThemeColor({}, "card");

  return (
    <ThemedView
      padding="lg"
      gap="sm"
      radius="lg"
      style={[
        styles.card,
        styles.cardShadow,
        {
          borderColor,
          shadowColor,
          backgroundColor: cardColor,
        },
      ]}
    >
      {children}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
  },
  cardShadow: {
    shadowOffset: { width: 0, height: spacing.xs },
    shadowOpacity: 0.20,
    shadowRadius: spacing.sm,
    elevation: spacing.xs,
  },
});