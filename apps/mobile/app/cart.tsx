import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';
import { CartItem } from '@/components/cart-item-row';
import { ThemedScrollView } from '@/components/ui/themed-scroll-view';
import { ThemedButton } from "@/components/ui/themed-button";
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useOrder } from '@/context/OrderContext';
import { createOrder } from '@/services/orders-api';
import { getCurrentUser } from "@/services/user-api";
import { spacing } from "@/constants/tokens";
import { useThemeColor } from "@/hooks/use-theme-color";



export default function ModalScreen() {
  const { cartItems, setCartItems } = useCart();
  const { accountType, accessToken} = useAuth();
  const {setLatestOrderId} = useOrder();
  const router = useRouter();
  const { guestName } = useLocalSearchParams<{ guestName?: string }>();
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const errorColor = useThemeColor({}, "danger");

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  async function resolveCheckoutCustomer(): Promise<{ customerName: string } | null> {
    if (accountType === "user") {
      try {
        const userInfo = await getCurrentUser(accessToken);
        return {customerName: userInfo.user.name};
      } catch (error) {
        console.error(error);
        setCheckoutError("unable to load your account information.");
        return null;
      }
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

        <ThemedButton
          variant="primary"
          onPress={() => router.replace("/")}
        >
          Done
        </ThemedButton>
      </ThemedView>
    );
  }

  return (
    <ThemedScrollView padding='xl'>
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
            <ThemedText style={{color: errorColor}}>{checkoutError}</ThemedText>
          ) : null}

          {cartItems.length > 0 && (
            <ThemedButton
              variant='primary'
              size='lg'
              onPress={handleCheckout}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Placing order..." : `Checkout $${subtotal.toFixed(2)}`}
            </ThemedButton>
          )}
        </ThemedView>
      
        <ThemedButton 
          variant='link'
          onPress={() => router.back()}
        >
          Close
        </ThemedButton>
      </ThemedView>
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer:{
    flexGrow: 1,
    justifyContent: "space-between",
    gap: spacing.md,
  },
  cartInfo: {
    gap: spacing.md,
    flex: 1,
  },
  title: {
    paddingBottom: spacing.md,
  },
  emptyCartInfo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  link: {
    paddingVertical: spacing.md,
  },
  linkText: {
    textAlign: "center",
  }
});
