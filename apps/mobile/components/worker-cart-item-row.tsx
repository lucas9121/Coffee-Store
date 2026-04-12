import { StyleSheet, Image, Pressable } from "react-native";
import { ThemedView } from "./ui/themed-view";
import { ThemedText } from "./ui/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";

type WorkerCartItem = {
  id: string;
  name: string;
  price: number;
  image: string | number;
  quantity: number;
};

type WorkerCartItemRowProps = {
  item: WorkerCartItem;
  onIncrease: () => void;
  onDecrease: () => void;
};

export function WorkerCartItemRow({
  item,
  onIncrease,
  onDecrease,
}: WorkerCartItemRowProps) {
  const borderColor = useThemeColor({}, "border");
  const imageSource =
    typeof item.image === "string" ? { uri: item.image } : item.image;

  return (
    <ThemedView style={[styles.card, { borderColor }]}>
      <Image source={imageSource} style={styles.image} />
      <ThemedView style={styles.cardInfo}>
        <ThemedText style={styles.name}>{item.name}</ThemedText>
        <ThemedText style={styles.price}>${item.price.toFixed(2)}</ThemedText>
        <ThemedView style={styles.quantity}>
          <Pressable onPress={onDecrease}>
            <ThemedText>[-]</ThemedText>
          </Pressable>
          <ThemedText>{item.quantity}</ThemedText>
          <Pressable onPress={onIncrease}>
            <ThemedText>[+]</ThemedText>
          </Pressable>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderTopWidth: 2,
  },
  cardInfo: {
    flex: 1,
  },
  image: {
    width: 84,
    height: 84,
    borderRadius: 42,
    resizeMode: "cover",
  },
  name: {
    textAlign: "center",
    textTransform: "capitalize",
  },
  price: {
    textAlign: "center",
    fontSize: 14,
  },
  quantity: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },
});