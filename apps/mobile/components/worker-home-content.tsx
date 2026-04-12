import { useState, useEffect, useRef } from "react";
import { Pressable, StyleSheet } from "react-native";

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
  const skipNextStorePollRef = useRef(false);

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

  async function loadStoreStatus(): Promise<void> {
    try {
      setIsLoadingStore(true);
      setStoreError("");
      const data = await getStoreStatus();
      setIsStoreOpen(data.isOpen);
    } catch (error) {
      console.error(error);
      setStoreError("Unable to load store status.");
    } finally {
      setIsLoadingStore(false);
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
      await loadStoreStatus();
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
          quantity: 1,
        },
      ];
    });
  };

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
        source: "IN PERSON" as const,
        orderItems: cartItems.map((item) => ({
          item: item.id,
          quantity: item.quantity,
        })),
      };

      await createOrder(payload, accessToken);

      setCustomerName("");
      setCartItems([]);
    } catch (error) {
      console.error(error);
      setOrderError("Unable to create in-person order.");
    } finally {
      setIsSubmittingOrder(false);
    }
  }

  useEffect(() => {
    if (accountType !== "worker") return;

    loadStoreStatus();
    loadMenuItems();

    const interval = setInterval(() => {
      if (skipNextStorePollRef.current) {
        skipNextStorePollRef.current = false;
        return;
      }

      loadStoreStatus();
    }, 50000);

    return () => clearInterval(interval);
  }, [accountType]);

  const menuCategories: string[] = [...new Set(menuItems.map((item) => item.category))];

  return (
    <ThemedScrollView contentContainerStyle={styles.screen}>
      <ThemedText type="title">Worker Home</ThemedText>

      <Section title="Store Status">
        {isLoadingStore ? (
          <ThemedText>Loading store status...</ThemedText>
        ) : (
          <ThemedText>{isStoreOpen ? "Open" : "Closed"}</ThemedText>
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

      <Section title="In-Person Orders">
        <ThemedTextInput
          placeholder="Customer name"
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

        <ThemedView style={styles.inPersonCart}>
          <ThemedText type="defaultSemiBold">Current Order</ThemedText>

          {cartItems.length === 0 ? (
            <ThemedText>No items added yet</ThemedText>
          ) : (
            cartItems.map((item) => (
              <ThemedText key={item.id}>
                {item.quantity} {item.name}
              </ThemedText>
            ))
          )}
        </ThemedView>

        {orderError ? (
          <ThemedText style={styles.errorText}>{orderError}</ThemedText>
        ) : null}

        <Pressable
          style={[styles.actionButton, { borderColor }]}
          onPress={handleCreateInPersonOrder}
          disabled={isSubmittingOrder}
        >
          <ThemedText>
            {isSubmittingOrder ? "Creating order..." : "Create In-Person Order"}
          </ThemedText>
        </Pressable>
      </Section>
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    padding: 12,
    gap: 24,
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
  errorText: {
    color: "#ff6b6b",
  },
  menuList: {
    gap: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  inPersonCart: {
    gap: 6,
    paddingTop: 8,
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
});