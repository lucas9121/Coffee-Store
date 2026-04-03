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
import { getStoreStatus } from "@/services/store-settings";
import { getCurrentUser } from "@/services/user-api";

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
  token: string | null
};



export function CustomerOrdersContent({
  accountType,
  borderColor,
  handleAddToCart,
  cartCount,
  token
} : CustomerOrdersContentProps
) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isStoreOpen, setIsStoreOpen] = useState<boolean>(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [isUser, setIsUser] = useState<boolean>(false);

  const imageMap: Record<string, any> = {
    coffee: require("@/assets/images/coffee.png"),
    espresso: require("@/assets/images/espresso.png"),
    cappuccino: require("@/assets/images/cappuccino.png"),
    latte: require("@/assets/images/latte.jpg"),
    "iced coffee": require("@/assets/images/iced-coffee.png"),
    "orange juice": require("@/assets/images/orange-juice.png"),
    "pao de queijo": require("@/assets/images/pao-de-queijo.jpg"),
    "misto quente": require("@/assets/images/misto-quente.jpg"),
  };

  async function storeStatus() {
    try {
      const status = await getStoreStatus();
      setIsStoreOpen(status.isOpen);
    } catch (error) {
      console.error(error);
    };
  };
  
  async function loadMenuItems(): Promise<void>{
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
    };
  };

  async function getUserInfo(){
    try {
      if(accountType !== "user"){
        setIsUser(false);
        setRecentIds([]);
        setFavoriteIds([]);
        return;
      } 
      setIsUser(true);
      const userInfo = await getCurrentUser(token);
      setRecentIds(userInfo.user.recent.map((id: any) => id.toString()));
      setFavoriteIds(userInfo.user.favorites.map((id: any) => id.toString()));
    } catch (error) {
      console.error(error);
    };
  };

  useEffect(() => {
    loadMenuItems();
    storeStatus();
  },[]);

  useEffect(() => {
    if(menuItems.length > 0 ) getUserInfo()
  }, [menuItems, token, accountType])

  const menuCategories: string[] = [... new Set(menuItems.map((item) => item.category))];
  const userRecent = menuItems.filter(item => recentIds.includes(item.id));
  const userFavorites = menuItems.filter(item => favoriteIds.includes(item.id));

  return (
    <ThemedView style={{flex: 1}}>
      <ThemedScrollView contentContainerStyle={styles.screenContent}>
        <ThemedText type="title">Order Menu</ThemedText>
        {!isStoreOpen && <ThemedText type="subtitle">Store is currently closed</ThemedText>}
        {cartCount > 0 && (
          <ThemedText>Cart Items: {cartCount}</ThemedText>
        )}

        {accountType === "user" && userFavorites.length > 0 && (
          <Section title="Favorites">
            <HorizontalList
              data={userFavorites}
              keyExtractor={(item) => item.id}
              renderItem={({item}) => (
                <MenuCard 
                name={item.name} 
                image={item.image} 
                price={item.price}
                isOpen={isStoreOpen}
                isUser={isUser}
                onAddPress={() => handleAddToCart(item)}
              />
              )}
            />
          </Section>
        )}

        {accountType === "user" && userRecent.length > 0 && (
          <Section title="Recents">
            <HorizontalList
              data={userRecent}
              keyExtractor={(item) => item.id}
              renderItem={({item}) => (
                <MenuCard 
                name={item.name} 
                image={item.image} 
                price={item.price}
                isOpen={isStoreOpen}
                isUser={isUser}
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
                      isOpen={isStoreOpen}
                      isUser={isUser}
                      isFavorite={isUser && favoriteIds.includes(item.id)}
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