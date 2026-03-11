import { StyleSheet } from "react-native";
import { ThemedView } from "@/components/ui/themed-view";
import { ThemedText } from "@/components/ui/themed-text";

type MenuCardProps = {
  name: string;
};

export function MenuCard({ name }: MenuCardProps) {
  return (
    <ThemedView style={styles.card}>
      <ThemedView style={styles.imagePlaceholder} />
      <ThemedText style={styles.name}>{name}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 120,
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
  },
  imagePlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
  },
  name: {
    textAlign: "center",
  },
});