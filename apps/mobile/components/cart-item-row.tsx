import { StyleSheet, Image, Pressable } from "react-native";
import { ThemedView } from "./ui/themed-view";
import { ThemedText } from "./ui/themed-text";

import { useCart } from "@/context/CartContext";

type MenuListItem = {
  id: string;
  name: string;
  price: number;
  image: string | number;
  quantity: number
};

export function CartItem({item}: {item: MenuListItem}){
  const {cartItems, setCartItems} = useCart()
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
    <ThemedView style={styles.card}>
      <Image source={imageSource} style={styles.image}></Image>
      <ThemedView style={styles.cardInfo}>
        <ThemedText style={styles.name}>{item.name}</ThemedText>
        <ThemedText style={styles.price}>${item.price.toFixed(2)}</ThemedText>
        <ThemedView style={styles.quantity}>
          <Pressable 
            onPress={() => reduceQuantity()}
          >
            <ThemedText>[-]</ThemedText>
          </Pressable>
          <ThemedText>{item.quantity}</ThemedText>
          <Pressable 
            onPress={() => addQuantity()}
          >
            <ThemedText>[+]</ThemedText>
          </Pressable>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  )
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderTopWidth: 2,
    borderColor: "red",
  },
  cardInfo: {
    flex: 1,
  },
  image: {
    width: 84,
    height: 84,
    borderRadius: 42,
    resizeMode: "cover"
  },
  name: {
    textAlign: "center",
    textTransform: "capitalize",
  },
  price: {
    textAlign: "center",
    fontSize: 14
  },
  quantity: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center"
  }
});
