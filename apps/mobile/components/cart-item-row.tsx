import { StyleSheet, Image } from "react-native";
import { ThemedView } from "./ui/themed-view";
import { ThemedText } from "./ui/themed-text";
import { ThemedButton } from "./ui/themed-button";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useCart } from "@/context/CartContext";
import { spacing, radius, fontSize } from "@/constants/tokens";

type MenuListItem = {
  id: string;
  name: string;
  price: number;
  image: string | number;
  quantity: number
};

export function CartItem({item}: {item: MenuListItem}){
  const { setCartItems} = useCart()
  const borderColor = useThemeColor({}, "border");
  const shadowColor = useThemeColor({}, "text")
  const imageSource = typeof item.image === "string" ? {uri: item.image} : item.image

  function addQuantity() {
    setCartItems((prev) => {
      return prev.map((i) => 
        i.id === item.id ?
          {...i, quantity: i.quantity + 1} :
        i
      )
    })
  }

  function reduceQuantity() {
    setCartItems((prev) => {
      const updatedCart = prev.map((i) =>{
        return(
          i.id === item.id ?
            {...i, quantity: i.quantity - 1} :
          i
        )
      })
      return updatedCart.filter((item) => item.quantity > 0)
    })
  }

  return(
    <ThemedView 
      padding="sm"
      radius="md"
      style={[styles.card, styles.cardShadow, {borderColor, shadowColor}]}
    >
      <Image source={imageSource} style={styles.image}></Image>
      <ThemedView style={styles.cardInfo}>
        <ThemedText style={styles.name}>{item.name}</ThemedText>
        <ThemedText style={styles.price}>${item.price.toFixed(2)}</ThemedText>
        <ThemedView style={styles.quantity}>
          <ThemedButton
            variant="secondary"
            size="icon"
            onPress={() => reduceQuantity()}
          >
            -
          </ThemedButton>
          <ThemedText>{item.quantity}</ThemedText>
          <ThemedButton
            variant="primary"
            size="icon"
            onPress={() => addQuantity()}
          >
            +
          </ThemedButton>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  )
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
  },
  cardShadow: {
    shadowOffset: { width: spacing.sm, height: spacing.xs },
    shadowOpacity: 0.20,
    shadowRadius: spacing.xs,
    elevation: spacing.xs,
  },
  cardInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  image: {
    width: 84,
    height: 84,
    borderRadius: radius.pill,
    resizeMode: "cover"
  },
  name: {
    textAlign: "center",
    textTransform: "capitalize",
  },
  price: {
    textAlign: "center",
    fontSize: fontSize.md,
  },
  quantity: {
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "center",
    alignItems: "center",
  }
});
