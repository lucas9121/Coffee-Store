import { StyleSheet, Image, ImageSourcePropType } from "react-native";
import { ThemedView } from "@/components/ui/themed-view";
import { ThemedText } from "@/components/ui/themed-text";

type MenuCardProps = {
  name: string;
  image: ImageSourcePropType | string;
};

export function MenuCard({ name, image }: MenuCardProps) {
  const imageSource = typeof image === "string" ? {uri: image} : image
  return (
    <ThemedView style={styles.card}>
      <Image source={imageSource} style={styles.image} />
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