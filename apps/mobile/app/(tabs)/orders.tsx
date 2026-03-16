import { StyleSheet } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";
import { ThemedScrollView } from "@/components/ui/themed-scroll-view";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";

import { Section } from "@/components/section";
import { HorizontalList } from "@/components/horizontal-list";
import { MenuCard } from "@/components/menu-card";
import { CartButton } from "@/components/cart-button";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { favoriteItems, recentItems, menuItems } from "@/constants/mock-menu-data";


type MenuListItem = {
  id: string;
  name: string;
  price: number;
  image: string | number;
};

type HandleAddToCart = (item: MenuListItem) => void;

export default function OrdersScreen() {
  const { accountType } = useAuth();
  const borderColor = useThemeColor({}, "border");
  const { cartItems, setCartItems } = useCart();

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  function handleAddToCart(item: MenuListItem) {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);

      if (existing) {
        return prev.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [...prev, { ...item, quantity: 1 }];
    });
  }

  if (accountType === "worker") {
    return renderWorkerOrders();
  }

  return renderCustomerOrders(accountType, borderColor, handleAddToCart, cartCount);
}

function renderCustomerOrders(
  accountType: string, 
  borderColor: string,
  handleAddToCart: HandleAddToCart,
  cartCount: number
) {
  const menuCategories: string[] = [... new Set(menuItems.map((item) => item.category))]

  return (
    <ThemedView style={{flex: 1}}>
      <ThemedScrollView contentContainerStyle={styles.screenContent}>
        <ThemedText type="title">Order Menu</ThemedText>
        
        {cartCount > 0 && (
          <ThemedText>Cart Items: {cartCount}</ThemedText>
        )}

        {accountType === "user" && (
          <Section title="Favorites">
            <HorizontalList
              data={favoriteItems}
              keyExtractor={(item) => item.id}
              renderItem={({item}) => (
                <MenuCard 
                name={item.name} 
                image={item.image} 
                price={item.price}
                onAddPress={() => handleAddToCart(item)}
              />
              )}
            />
          </Section>
        )}

        {accountType === "user" && (
          <Section title="Recents">
            <HorizontalList
              data={recentItems}
              keyExtractor={(item) => item.id}
              renderItem={({item}) => (
                <MenuCard 
                name={item.name} 
                image={item.image} 
                price={item.price}
                onAddPress={() => handleAddToCart(item)}
              />
              )}
            />
          </Section>
        )}

        <Section title="Menu">
          {menuCategories.map((category) => {
            const filtredMenuItems = menuItems.filter(item => 
              item.category.toLowerCase() === category.toLowerCase()
            )
            return(
              <ThemedView key={category} style={[styles.categoryBlock, {borderColor}]}>
                <ThemedText type="defaultSemiBold" style={{textTransform: "capitalize"}}>{category}</ThemedText>
                <HorizontalList 
                  data={filtredMenuItems}
                  keyExtractor={(item) => item.id}
                  renderItem={({item}) => (
                    <MenuCard
                      name={item.name} 
                      image={item.image} 
                      price={item.price}
                      onAddPress={() => handleAddToCart(item)}
                    />
                  )}
                />
              </ThemedView>
            )
          })}
        </Section>
      </ThemedScrollView>
      <CartButton />
    </ThemedView>
  );
}

function renderWorkerOrders() {
  return (
    <ThemedScrollView contentContainerStyle={styles.screenContent}>
      <ThemedText type="title">Worker Orders</ThemedText>

      <Section title="Mobile Orders">
        <ThemedText>Incoming mobile orders will appear here</ThemedText>
      </Section>

      <Section title="In-Person Orders">
        <ThemedText>Walk-up orders will appear here</ThemedText>
      </Section>
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({
  screenContent:{
    padding: 24,
    gap: 24,
  },
  categoryBlock: {
    borderTopWidth: 2,
    paddingVertical: 12,
    gap: 12,
  }
})