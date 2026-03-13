import { StyleSheet, Image, ImageSourcePropType, Pressable } from "react-native";
import { ThemedView } from "@/components/ui/themed-view";
import { ThemedText } from "@/components/ui/themed-text";

type MenuCardProps = {
  name: string;
  image: ImageSourcePropType | string;
  price: number;
  isFavorite?: boolean;
  onFavoritePress?: () => void;
  onAddPress?: () => void;
};

export function MenuCard({ name, image, price, isFavorite, onFavoritePress, onAddPress }: MenuCardProps) {
  const imageSource = typeof image === "string" ? {uri: image} : image
  return (
    <ThemedView style={styles.card}>
      <Pressable style={styles.favoriteButton} onPress={() => onFavoritePress?.()}>
        <ThemedText>{isFavorite ? "♥" : "♡"}</ThemedText>
      </Pressable>
      <Image source={imageSource} style={styles.image} />
      <ThemedText style={styles.name}>{name}</ThemedText>
      <ThemedText style={styles.price}>${price.toFixed(2)}</ThemedText>
      <Pressable style={styles.addButton} onPress={() => onAddPress?.()}>
        <ThemedText>Add</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    alignItems: "center",
    gap: 8,
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 8,
  },
  favoriteButton: {
    position: "absolute",
    top: 6,
    right: 6,
    padding: 6,
    zIndex: 1,
  },
  image: {
    width: 84,
    height: 84,
    borderRadius: 42,
    resizeMode: "cover"
  },
  name: {
    textAlign: "center",
    textTransform: "capitalize"
  },
  price: {
    textAlign: "center",
    fontSize: 14
  },
   addButton: {
    marginTop: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "red",
    borderRadius: 10,
  }
});