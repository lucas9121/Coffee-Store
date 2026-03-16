import { StyleSheet, Image } from "react-native";
import { ThemedView } from "./ui/themed-view";
import { ThemedText } from "./ui/themed-text";

type MenuListItem = {
  id: string;
  name: string;
  price: number;
  image: string | number;
  quantity: number
};

export function CartItem({item}: {item: MenuListItem}){
  const imageSource = typeof item.image === "string" ? {uri: item.image} : item.image
  return(
    <ThemedView style={styles.card}>
      <Image source={imageSource} style={styles.image}></Image>
      <ThemedText style={styles.name}>{item.name}</ThemedText>
      <ThemedText style={styles.price}>${item.price.toFixed(2)}</ThemedText>
      <ThemedText>Quantity: {item.quantity}</ThemedText>
    </ThemedView>
  )
};

const styles = StyleSheet.create({
  card: {
    width: 140,
    alignItems: "center",
    gap: 8,
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 8,
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
});
