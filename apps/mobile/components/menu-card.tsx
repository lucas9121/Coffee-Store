import { StyleSheet, Image, ImageSourcePropType, Pressable } from "react-native";
import { spacing, radius, fontSize } from "@/constants/tokens";
import { ThemedButton } from "@/components/ui/themed-button";
import { ThemedView } from "@/components/ui/themed-view";
import { ThemedText } from "@/components/ui/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "./card";

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
  const textColor = useThemeColor({}, "text");
  const borderColor = useThemeColor({}, "border");
  const shadowColor = useThemeColor({}, "text");
  return (
    <ThemedView radius="md" padding="sm" style={[styles.cardShadow, {borderColor, shadowColor}]}>
      <ThemedView  style={styles.card}>
        {isUser && 
          <Pressable style={styles.favoriteButton} onPress={() => onFavoritePress?.()}>
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={20}
              color={isFavorite ? "#D84B5A" : textColor}
            />
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
  cardShadow: {
    borderWidth: 1,
    shadowOffset: { width: spacing.xs, height: spacing.xs },
    shadowOpacity: 0.20,
    shadowRadius: spacing.xs,
    elevation: spacing.xs,
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