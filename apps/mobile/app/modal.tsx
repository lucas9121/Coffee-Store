import { Link } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';
import { CartItem } from '@/components/cart-item-row';
import { useCart } from '@/context/CartContext';
import { ThemedScrollView } from '@/components/ui/themed-scroll-view';

export default function ModalScreen() {
  const { cartItems } = useCart();

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  return (
    <ThemedScrollView contentContainerStyle={styles.container}>
      <ThemedView style={styles.mainContainer}>
        <ThemedView style={styles.cartInfo}>
          <ThemedText type="title" style={styles.title}>Cart</ThemedText>

          {cartItems.length === 0 && (
            <ThemedView style={styles.emptyCartInfo}>
              <ThemedText type='defaultSemiBold'>Your cart is empty</ThemedText>
            </ThemedView>
          )}

          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}

          {cartItems.length > 0 && (
            <Pressable
              onPress={() => console.log("checkout")}
              style={styles.checkoutButton}
            >
              <ThemedText type='subtitle'>Checkout ${subtotal.toFixed(2)}</ThemedText>
            </Pressable>
          )}
        </ThemedView>
      
        <Link href="/" dismissTo style={styles.link}>
          <ThemedText type="link" style={styles.linkText}>Close</ThemedText>
        </Link>
      </ThemedView>
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  mainContainer:{
    flexGrow: 1,
    justifyContent: "space-between",
    gap: 10,
  },
  cartInfo: {
    gap: 10,
    flex: 1,
  },
  title: {
    paddingBottom: 30,
  },
  emptyCartInfo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutButton: {
    padding: 15,
    borderRadius: 50,
    backgroundColor: "#02c4ccba",
    alignItems: "center",
  },
  link: {
    paddingVertical: 15,
  },
  linkText: {
    textAlign: "center",
  }
});
