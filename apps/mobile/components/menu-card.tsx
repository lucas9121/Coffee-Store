import { StyleSheet, Image, ImageSourcePropType, Pressable } from "react-native";
import { spacing, radius, fontSize } from "@/constants/tokens";
import { ThemedButton } from "@/components/ui/themed-button";
import { ThemedView } from "@/components/ui/themed-view";
import { ThemedText } from "@/components/ui/themed-text";

type MenuCardProps = {
  name: string;
  image: ImageSourcePropType | string;
  price: number;
  isFavorite?: boolean;
  isOpen: boolean;
  isUser: boolean;
  onFavoritePress?: () => void;
  onAddPress?: () => void;
};

export function MenuCard({ name, image, price, isFavorite, isOpen, isUser, onFavoritePress, onAddPress }: MenuCardProps) {
  const imageSource = typeof image === "string" ? {uri: image} : image
  return (
    <ThemedView style={styles.card}>
      {isUser && 
        <Pressable style={styles.favoriteButton} onPress={() => onFavoritePress?.()}>
          <ThemedText>{isFavorite ? "♥" : "♡"}</ThemedText>
        </Pressable>
      }
      <Image source={imageSource} style={styles.image} />
      <ThemedText style={styles.name}>{name}</ThemedText>
      <ThemedText style={styles.price}>${price.toFixed(2)}</ThemedText>
      <ThemedButton 
        variant="primary"
        size="sm"
        onPress={() => onAddPress?.()} 
        disabled={!isOpen}
      >
        Add
      </ThemedButton>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    alignItems: "center",
    gap: spacing.sm,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  favoriteButton: {
    position: "absolute",
    top: spacing.xs,
    right: spacing.xs,
    padding: spacing.xs,
    zIndex: 1,
  },
  image: {
    width: 84,
    height: 84,
    borderRadius: radius.pill,
    resizeMode: "cover"
  },
  name: {
    textAlign: "center",
    textTransform: "capitalize"
  },
  price: {
    textAlign: "center",
    fontSize: fontSize.sm
  },
});