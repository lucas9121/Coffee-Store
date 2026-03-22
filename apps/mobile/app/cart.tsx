import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';
import { CartItem } from '@/components/cart-item-row';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ThemedScrollView } from '@/components/ui/themed-scroll-view';



export default function ModalScreen() {
  const { cartItems, setCartItems } = useCart();
  const { accountType, accessToken } = useAuth()
  const router = useRouter();
  const { guestName } = useLocalSearchParams<{ guestName?: string }>();

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  
  // This will be a separate file called send request and function will be exported
  async function sendRequest(
    url: string,
    method: string = 'GET',
    payload: object | null = null
  ) {
    const options: RequestInit = { method };

    if (payload) {
      options.headers = { 'Content-Type': 'application/json' };
      options.body = JSON.stringify(payload);
    }

    if (accessToken) {
      options.headers = {
        ...(options.headers || {}),
        Authorization: `Bearer ${accessToken}`,
      };
    }

    try {
      const res = await fetch(url, options);

      if (res.ok) {
        return res.json();
      } else {
        const errorResponse = await res.json();
        console.error('Error Response:', errorResponse);
        throw new Error(`Request failed with status ${res.status}`);
      }
    } catch (error) {
      console.error('Request Error ', error);
      throw new Error('Request failed. Please check your network connection and try again.');
    }
  }


  // this will also be a separate file called carts-api that will export all functions like get/create/etc
  // it will import send request from send request file. 
  const BASE_URL = `${process.env.EXPO_PUBLIC_API_URL}/orders`
  async function createOrder(payload:{
    customerName: string;
    orderItems: { item: string; quantity: number}[];
  }){
      return await sendRequest(BASE_URL, "POST", payload)
  }


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

    const payload = {
      customerName: customer.customerName,
      orderItems: cartItems.map((item) => ({
        // This must eventually be a REAL backend OrderItem _id
        item: item.id,
        quantity: item.quantity,
      })),
    };

    try {
      await createOrder(payload);
      setCartItems([]);
      router.replace("/");
    } catch (error) {
      console.log(error);
    }
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

          {cartItems.length > 0 && (
            <Pressable
              onPress={() => handleCheckout()}
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
