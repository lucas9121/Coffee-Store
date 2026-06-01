import { useState, useEffect, useRef } from "react";
import { Pressable, StyleSheet, Modal, KeyboardAvoidingView, Platform } from "react-native";

import { ThemedView } from "@/components/ui/themed-view";
import { ThemedText } from "@/components/ui/themed-text";
import { Section } from "@/components/section";
import { ThemedTextInput } from "@/components/ui/themed-text-input";
import { spacing, radius } from "@/constants/tokens";
import { ThemedButton } from "./ui/themed-button";
import { ThemedScrollView } from "./ui/themed-scroll-view";
import { MenuCard } from "./menu-card";

import { useThemeColor } from "@/hooks/use-theme-color";
import { getMenuItems } from "@/services/menu-api";
import { createOrder } from "@/services/orders-api";
import { getStoreStatus, setStoreOverride } from "@/services/store-settings";
import { RequestError } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";

type MenuItem = {
  id: string;
  name: string;
  price: number;
  image: string | number;
  category: string;
  inStock: boolean;
};

type InPersonCartItem = {
  id: string;
  name: string;
  price: number;
  image: string | number;
  quantity: number;
};

type WorkerHomeScreenProps = {
  accountType: string;
  accessToken: string | null;
};


export default function WorkerHomeScreen({accountType, accessToken}: WorkerHomeScreenProps) {
  const [isStoreOpen, setIsStoreOpen] = useState<boolean>(false);
  const [isLoadingStore, setIsLoadingStore] = useState(false);
  const [storeError, setStoreError] = useState("");
  const borderColor = useThemeColor({}, "border");
  const [customerName, setCustomerName] = useState("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cartItems, setCartItems] = useState<InPersonCartItem[]>([]);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const skipNextStorePollRef = useRef(false);
  const isFirstStoreLoadRef = useRef(true);
  const lastStoreStatusRef = useRef<boolean | null>(null);
  const router = useRouter();
  const { logout } = useAuth();
  const errorColor = useThemeColor({}, "danger");
  const primaryColor = useThemeColor({}, "primary");
  const shadowColor = useThemeColor(
    { light: "#000000", dark: undefined },
    "text"
  );

  const imageMap: Record<string, any> = {
    coffee: require("@/assets/images/coffee.jpg"),
    espresso: require("@/assets/images/espresso.jpg"),
    cappuccino: require("@/assets/images/cappuccino.jpg"),
    latte: require("@/assets/images/latte.jpg"),
    "iced coffee": require("@/assets/images/iced-coffee.jpg"),
    "orange juice": require("@/assets/images/orange-juice.jpg"),
    "pao de queijo": require("@/assets/images/pao-de-queijo.jpg"),
    "misto quente": require("@/assets/images/misto-quente.jpg"),
  };

  async function handleUnauthorized(error: unknown) {
    if (error instanceof RequestError && error.status === 401) {
      await logout();
      router.replace("/login?sessionExpired=true");
      return true;
    }
    return false;
  }

  async function loadMenuItems(): Promise<void> {
    try {
      const data = await getMenuItems();
      setMenuItems(
        data.map((item: any) => ({
          id: item._id,
          name: item.name,
          price: item.price,
          image: imageMap[item.name.toLowerCase()] || require("@/assets/images/logo.jpg"),
          category: item.category,
          inStock: item.inStock,
        }))
      );
    } catch (error) {
      console.error(error);
    }
  }

  async function loadStoreStatus(showLoading = false): Promise<void> {
    try {
      if(showLoading) setIsLoadingStore(true);
      setStoreError("");
      const data = await getStoreStatus();
      if(lastStoreStatusRef.current !== data.isOpen) {
        setIsStoreOpen(data.isOpen);
        lastStoreStatusRef.current = data.isOpen
      }
    } catch (error) {
      console.error(error);
      setStoreError("Unable to load store status.");
    } finally {
      if(showLoading){
        setIsLoadingStore(false);
        isFirstStoreLoadRef.current = false;
      }
    }
  }

  async function handleSetStore(status: "open" | "closed"): Promise<void> {
    try {
      setStoreError("");

      // temporary manual override for 8 hours
      const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();

      await setStoreOverride(
        {status, expiresAt}, 
        accessToken
      );
      skipNextStorePollRef.current = true;
      await loadStoreStatus(false);
    } catch (error) {
      if (await handleUnauthorized(error)) return;
      console.error(error);
      setStoreError("Unable to update store status.");
    }
  };

  function handleAddToInPersonCart(item: MenuItem) {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);

      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }

      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: 1,
        },
      ];
    });
  };

  function handleIncreaseQuantity(itemId: string) {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }

  function handleDecreaseQuantity(itemId: string) {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  async function handleCreateInPersonOrder(): Promise<void> {
    if (!customerName.trim()) {
      setOrderError("Please enter a customer name.");
      return;
    }

    if (cartItems.length === 0) {
      setOrderError("Please add at least one item.");
      return;
    }

    if (customerName.trim().length > 10) {
      setOrderError("Customer name must be 10 characters or less.");
      return;
    }

    try {
      setOrderError("");
      setIsSubmittingOrder(true);

      const payload = {
        customerName: customerName.trim(),
        source: "IN PERSON",
        orderItems: cartItems.map((item) => ({
          item: item.id,
          quantity: item.quantity,
        })),
      };

      await createOrder(payload, accessToken);

      setCustomerName("");
      setCartItems([]);
      setIsOrderModalOpen(false);
    } catch (error) {
      if (await handleUnauthorized(error)) return;
      console.error(error);
      setOrderError("Unable to create in-person order.");
    } finally {
      setIsSubmittingOrder(false);
    }
  }

  useEffect(() => {
    if (accountType !== "worker") return;

    loadStoreStatus(isFirstStoreLoadRef.current);
    loadMenuItems();

    const interval = setInterval(() => {
      if (skipNextStorePollRef.current) {
        skipNextStorePollRef.current = false;
        return;
      }

      loadStoreStatus(false);
    }, 50000);

    return () => clearInterval(interval);
  }, [accountType]);

  const menuCategories: string[] = [...new Set(menuItems.map((item) => item.category))];
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <ThemedView style={styles.container}>
      <ThemedScrollView padding="md" gap="xl" contentContainerStyle={{alignItems: "center"}}>

        <Section title="Store Status" style={{alignItems: "center"}}>
          {isLoadingStore ? (
            <ThemedText style={{textAlign: "center"}}>Loading store status...</ThemedText>
          ) : (
            <ThemedText style={{textAlign: "center"}}>{isStoreOpen ? "OPEN" : "CLOSED"}</ThemedText>
          )}

          {storeError ? (
            <ThemedText style={{color: errorColor}}>{storeError}</ThemedText>
          ) : null}

          <ThemedView style={styles.buttonRow}>
            <ThemedButton
              variant="success"
              size="sm"
              onPress={() => handleSetStore("open")}
            >
              Open Store
            </ThemedButton>

            <ThemedButton
              variant="danger"
              size="sm"
              onPress={() => handleSetStore("closed")}
            >
              Close Store
            </ThemedButton>
          </ThemedView>
        </Section>

        <Section title="In-Person Orders" style={{alignItems: "center"}}>
          <ThemedTextInput
            placeholder="Add customer name"
            value={customerName}
            onChangeText={setCustomerName}
          />

          {menuCategories.map((category) => {
            const filteredMenuItems = menuItems.filter(
              (item) => item.category.toLowerCase() === category.toLowerCase()
            );

            return (
              <ThemedView key={category} gap="md" paddingVertical="md" style={{borderTopWidth: 2, borderColor}}>
                <ThemedText type="defaultSemiBold" style={{ textTransform: "capitalize" }}>
                  {category}
                </ThemedText>

                <ThemedView style={styles.menuList}>
                  {filteredMenuItems.map((item) => (
                    <ThemedView key={item.id} padding="xs" radius="md" style={[styles.cardShadow, {borderColor, shadowColor}]} >
                      <MenuCard
                        name={item.name}
                        image={item.image}
                        price={item.price}
                        isOpen={isStoreOpen}
                        isUser={false}
                        onAddPress={() => handleAddToInPersonCart(item)}
                      />
                    </ThemedView>
                  ))}
                </ThemedView>
              </ThemedView>
            );
          })}
        </Section>
      </ThemedScrollView>
      {cartCount > 0 && (
        <Pressable 
          style={[styles.orderButton, {borderColor, backgroundColor: primaryColor}]}
          onPress={() => { 
            setOrderError("");
            setIsOrderModalOpen(true);
          }}
        >
          <ThemedText >Current Order </ThemedText>
          <ThemedText>{cartCount}</ThemedText>
        </Pressable>
      )}
      <Modal
        visible={isOrderModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsOrderModalOpen(false)}
      >
        <ThemedView style={styles.modalOverlay}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoiding}
          >
            <ThemedView style={[styles.modalContent, { borderColor }]}>
              <ThemedText type="title">Current Order</ThemedText>

              <ThemedTextInput
                placeholder="Add customer name"
                value={customerName}
                onChangeText={setCustomerName}
              />

              {cartItems.length === 0 ? (
                <ThemedText>No items added yet</ThemedText>
              ) : (
                cartItems.map((item) => (
                  <ThemedView key={item.id} style={styles.cartRow}>
                    <ThemedText>{item.name}</ThemedText>

                    <ThemedView style={styles.quantityControls}>
                      <Pressable
                        style={[styles.quantityButton, { borderColor }]}
                        onPress={() => handleDecreaseQuantity(item.id)}
                      >
                        <ThemedText>-</ThemedText>
                      </Pressable>

                      <ThemedText>{item.quantity}</ThemedText>

                      <Pressable
                        style={[styles.quantityButton, { borderColor }]}
                        onPress={() => handleIncreaseQuantity(item.id)}
                      >
                        <ThemedText>+</ThemedText>
                      </Pressable>
                    </ThemedView>
                  </ThemedView>
                ))
              )}

              <ThemedText type="defaultSemiBold">
                Total: ${cartTotal.toFixed(2)}
              </ThemedText>

              {orderError ? (
                <ThemedText style={{color: errorColor}}>{orderError}</ThemedText>
              ) : null}

              <ThemedView style={styles.modalButtons}>
                <ThemedButton
                  variant="ghost"
                  onPress={() => setIsOrderModalOpen(false)}
                >
                  Close
                </ThemedButton>

                <ThemedButton
                  variant="primary"
                  onPress={handleCreateInPersonOrder}
                  disabled={isSubmittingOrder}
                >
                  {isSubmittingOrder ? "Creating..." : "Create Order"}
                </ThemedButton>
              </ThemedView>
            </ThemedView>
          </KeyboardAvoidingView>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
  },
  buttonRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.md,
  },
  orderButton: {
    position: "absolute",
    bottom: spacing.md,
    right: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    flexDirection: "row",
    gap: spacing.sm,
    zIndex: 10,
    // opacity: .85,
  },
  menuList: {
    gap: spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  cardShadow: {
    borderWidth: 1,
    shadowOffset: { width: 0, height: spacing.xs },
    shadowOpacity: 0.15,
    shadowRadius: spacing.xs,
    elevation: spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  modalContent: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  cartRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  quantityButton: {
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: spacing.md
  },
  keyboardAvoiding: {
    width: "100%",
  },
});