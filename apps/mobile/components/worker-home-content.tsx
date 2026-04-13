import { useState, useEffect, useRef } from "react";
import { Pressable, StyleSheet, Modal } from "react-native";

import { ThemedView } from "@/components/ui/themed-view";
import { ThemedText } from "@/components/ui/themed-text";
import { Section } from "@/components/section";
import { ThemedTextInput } from "@/components/ui/themed-text-input";
import { ThemedScrollView } from "./ui/themed-scroll-view";
import { MenuCard } from "./menu-card";

import { useThemeColor } from "@/hooks/use-theme-color";
import { getMenuItems } from "@/services/menu-api";
import { createOrder } from "@/services/orders-api";
import { getStoreStatus, setStoreOverride } from "@/services/store-settings";

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

  async function loadMenuItems(): Promise<void> {
    try {
      const data = await getMenuItems();
      setMenuItems(
        data.map((item: any) => ({
          id: item._id,
          name: item.name,
          price: item.price,
          image: "",
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
      <ThemedScrollView contentContainerStyle={styles.screen}>
        <ThemedText type="title">Worker Home</ThemedText>

        <Section title="Store Status" style={{alignItems: "center"}}>
          {isLoadingStore ? (
            <ThemedText style={{textAlign: "center"}}>Loading store status...</ThemedText>
          ) : (
            <ThemedText style={{textAlign: "center"}}>{isStoreOpen ? "Open" : "Closed"}</ThemedText>
          )}

          {storeError ? (
            <ThemedText style={styles.errorText}>{storeError}</ThemedText>
          ) : null}

          <ThemedView style={styles.buttonRow}>
            <Pressable
              style={styles.actionButton}
              onPress={() => handleSetStore("open")}
            >
              <ThemedText>Open Store</ThemedText>
            </Pressable>

            <Pressable
              style={styles.actionButton}
              onPress={() => handleSetStore("closed")}
            >
              <ThemedText>Close Store</ThemedText>
            </Pressable>
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
              <ThemedView key={category} style={[styles.categoryBlock, { borderColor }]}>
                <ThemedText type="defaultSemiBold" style={{ textTransform: "capitalize" }}>
                  {category}
                </ThemedText>

                <ThemedView style={styles.menuList}>
                  {filteredMenuItems.map((item) => (
                    <ThemedView key={item.id} style={[styles.menuItemWrapper, {borderColor}]} >
                      <MenuCard
                        name={item.name}
                        image={require("@/assets/images/logo.jpg")}
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
      <Pressable 
          style={[styles.orderButton, {borderColor}]}
          onPress={() => { 
            setOrderError("");
            setIsOrderModalOpen(true);
          }}
        >
          <ThemedText >Current Order </ThemedText>
          <ThemedText>{cartCount}</ThemedText>
      </Pressable>
      <Modal
        visible={isOrderModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsOrderModalOpen(false)}
      >
        <ThemedView style={styles.modalOverlay}>
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
              <ThemedText style={styles.errorText}>{orderError}</ThemedText>
            ) : null}

            <ThemedView style={styles.modalButtons}>
              <Pressable
                style={[styles.actionButton, { borderColor }]}
                onPress={() => setIsOrderModalOpen(false)}
              >
                <ThemedText>Close</ThemedText>
              </Pressable>

              <Pressable
                style={[styles.actionButton, { borderColor }]}
                onPress={handleCreateInPersonOrder}
                disabled={isSubmittingOrder}
              >
                <ThemedText>
                  {isSubmittingOrder ? "Creating..." : "Create Order"}
                </ThemedText>
              </Pressable>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
  },
  screen: {
    flexGrow: 1,
    padding: 12,
    gap: 24,
    alignItems: "center"
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
  orderButton: {
    position: "absolute",
    bottom: 12,
    right: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 24,
    flexDirection: "row",
    gap: 8,
    zIndex: 10,
    backgroundColor: "#02c4ccba"
  },
  errorText: {
    color: "#ff6b6b",
  },
  menuList: {
    gap: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  categoryBlock: {
    borderTopWidth: 2,
    paddingVertical: 12,
    gap: 12,
  },
  menuItemWrapper: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 6,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  modalContent: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 16,
  },

  cartRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  quantityButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  modalButtons: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
});