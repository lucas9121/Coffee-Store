import { useState } from 'react';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';
import { CartItem } from '@/components/cart-item-row';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useOrder } from '@/context/OrderContext';
import { ThemedScrollView } from '@/components/ui/themed-scroll-view';
import { createOrder } from '@/services/orders-api';



export default function ModalScreen() {
  const { cartItems, setCartItems } = useCart();
  const { accountType, accessToken} = useAuth();
  const {setLatestOrderId} = useOrder();
  const router = useRouter();
  const { guestName } = useLocalSearchParams<{ guestName?: string }>();
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  async function resolveCheckoutCustomer(): Promise<{ customerName: string } | null> {
    if (accountType === "user") {
      // Temporary until real backend user data exists
      return { customerName: "Customer" };
    }

    if (guestName && guestName.trim()) {
      return { customerName: guestName.trim() };
    }

    // Guest has not chosen login or entered a name yet
    router.push("/login?fromCheckout=true");
    return null;
  }

  async function handleCheckout() {
    const customer = await resolveCheckoutCustomer();

    // Stop here if redirected customer to login / guest flow
    if (!customer) return;

    setCheckoutError("");
    setIsSubmitting(true);

    const payload = {
      customerName: customer.customerName,
      orderItems: cartItems.map((item) => ({
        item: item.id,
        quantity: item.quantity,
      })),
      source: "MOBILE",
    };

    try {
      const order = await createOrder(payload, accessToken);
      setCartItems([]);
      setOrderSuccess(true)
      setLatestOrderId(order._id)
    } catch (error) {
      setCheckoutError("Could not place order. Please try again.")
      console.error(error);
    } finally {
      setIsSubmitting(false)
    };
  };

  if (orderSuccess) {
    return (
      <ThemedView style={styles.emptyCartInfo}>
        <ThemedText type="title">Order placed successfully</ThemedText>

        <Pressable
          onPress={() => router.replace("/")}
          style={styles.checkoutButton}
        >
          <ThemedText type="subtitle">Done</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

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

          {checkoutError ? (
            <ThemedText>{checkoutError}</ThemedText>
          ) : null}

          {cartItems.length > 0 && (
            <Pressable
              onPress={handleCheckout}
              style={styles.checkoutButton}
              disabled={isSubmitting}
            >
              <ThemedText type='subtitle'>{isSubmitting ? "Placing order..." : `Checkout $${subtotal.toFixed(2)}`}</ThemedText>
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
