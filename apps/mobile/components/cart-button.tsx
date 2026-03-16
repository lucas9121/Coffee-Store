import { Pressable, StyleSheet } from "react-native";
import { ThemedText } from "./ui/themed-text";
import { useCart } from "@/context/CartContext";
import { useRouter } from "expo-router";


export function CartButton(){
  const {cartItems} = useCart();
  const router = useRouter();

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  if(cartCount > 0){
    return <Pressable 
      style={styles.cartButton}
      onPress={() => router.push("/modal")}
    >
      <ThemedText>🛒 {cartCount.toString()}</ThemedText>
    </Pressable>
  }

  return null;
}

const styles = StyleSheet.create({
  cartButton: {
    padding: 15,
    borderRadius: 50,
    backgroundColor: "#02c4ccba",
    position: "absolute",
    bottom: 6,
    right: 6,
    zIndex: 1,
  }
})