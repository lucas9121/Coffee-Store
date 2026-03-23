import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

import { ThemedView } from "./ui/themed-view";
import { ThemedText } from "./ui/themed-text";
import { ThemedScrollView } from "./ui/themed-scroll-view";

import { Section } from "./section";
import { HorizontalList } from "./horizontal-list";
import { MenuCard } from "./menu-card";
import { CartButton } from "./cart-button";
import { getMenuItems } from "@/services/menu-api";

import { favoriteItems, recentItems } from "@/constants/mock-menu-data";

type MenuListItem = {
  id: string;
  name: string;
  price: number;
  image: string | number;
};

type HandleAddToCart = (item: MenuListItem) => void;

type MenuItem = {
  id: string;
  name: string;
  price: number;
  image: string | number;
  category: string;
  inStock: boolean;
};

type CustomerOrdersContentProps = {
  accountType: string;
  borderColor: string;
  handleAddToCart: HandleAddToCart;
  cartCount: number;
};




export function CustomerOrdersContent({
  accountType,
  borderColor,
  handleAddToCart,
  cartCount,
} : CustomerOrdersContentProps
) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  
  async function loadMenuItems(): Promise<void>{
    try {
      const data = await getMenuItems();
      setMenuItems(
        data.map((item: any) => ({
          id: item._id,
          name: item.name,
          price: item.price,
          image: require("@/assets/images/church-kiosk-temp-logo.png"),
          category: item.category,
          inStock: item.inStock,
        }))
      );
    } catch (error) {
      console.error(error);
    };
  };

  useEffect(() => {
    loadMenuItems();
  },[]);

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