import { Pressable, StyleSheet } from "react-native";
import { ThemedText } from "./ui/themed-text";
import { useCart } from "@/context/CartContext";


export function CartButton(){
  const {cartItems} = useCart();

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  if(cartCount > 0){
    return <Pressable style={styles.cartButton}><ThemedText>🛒 {cartCount.toString()}</ThemedText></Pressable>
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