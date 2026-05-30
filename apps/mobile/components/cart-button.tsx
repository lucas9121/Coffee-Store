import { StyleSheet } from "react-native";
import { useCart } from "@/context/CartContext";
import { useRouter } from "expo-router";
import { spacing, radius } from "@/constants/tokens";
import { ThemedButton } from "./ui/themed-button";


export function CartButton(){
  const {cartItems} = useCart();
  const router = useRouter();

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  if(cartCount > 0){
    return <ThemedButton
      variant="primary"
      size="lg"
      style={styles.cartButton}
      onPress={() => router.push("/cart")}
    >
      🛒 {cartCount.toString()}
    </ThemedButton>
  }

  return null;
}

const styles = StyleSheet.create({
  cartButton: {
    borderRadius: radius.pill,
    position: "absolute",
    bottom: spacing.md,
    right: spacing.md,
    zIndex: 1,
  }
})