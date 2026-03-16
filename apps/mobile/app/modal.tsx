import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';
import { CartItem } from '@/components/cart-item-row';
import { useCart } from '@/context/CartContext';

export default function ModalScreen() {
  const { cartItems } = useCart();

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Cart</ThemedText>

      {cartItems.length === 0 && (
        <ThemedText>Your cart is empty</ThemedText>
      )}

      {cartItems.map((item) => (
        <CartItem key={item.id} item={item} />
      ))}

      {cartItems.length > 0 && (
        <ThemedText>Subtotal: ${subtotal.toFixed(2)}</ThemedText>
      )}

      <Link href="/" dismissTo style={styles.link}>
        <ThemedText type="link">Close</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
