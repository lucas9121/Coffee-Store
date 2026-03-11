import { StyleSheet, Image } from "react-native";
import { ThemedView } from "@/components/ui/themed-view";
import { ThemedText } from "@/components/ui/themed-text";

type MenuCardProps = {
  name: string;
  image: any;
};

export function MenuCard({ name, image }: MenuCardProps) {
  return (
    <ThemedView style={styles.card}>
      <Image source={image} style={styles.image} />
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
  image: {
    width: 72,
    height: 72,
    borderRadius: 36,
    resizeMode: "cover"
  },
  name: {
    textAlign: "center",
  },
});