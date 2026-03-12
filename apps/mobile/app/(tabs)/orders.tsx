import { ThemedScrollView } from "@/components/ui/themed-scroll-view";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import { Section } from "@/components/section";
import { HorizontalList } from "@/components/horizontal-list";
import { useAuth } from "@/context/AuthContext";
import { StyleSheet } from "react-native";
import { MenuCard } from "@/components/menu-card";
import { useThemeColor } from "@/hooks/use-theme-color";

const favoriteItems = [
  { id: "1", name: "Latte", image: require("@/assets/images/church-kiosk-temp-logo.png")},
  { id: "2", name: "Mocha", image: require("@/assets/images/church-kiosk-temp-logo.png")},
  { id: "3", name: "Cappuccino", image: require("@/assets/images/church-kiosk-temp-logo.png")},
];

const recentItems = [
  { id: "1", name: "Iced Coffee", image: require("@/assets/images/church-kiosk-temp-logo.png")},
  { id: "2", name: "Blueberry Muffin", image: require("@/assets/images/church-kiosk-temp-logo.png")},
  { id: "3", name: "Orange Juice", image: require("@/assets/images/church-kiosk-temp-logo.png")},
]

const menuItems = [
  {
    id: "coffee-cappuccino",
    name: "Cappuccino",
    category: "coffee",
    price: 4.5,
    image: require("@/assets/images/church-kiosk-temp-logo.png"),
  },
  {
    id: "coffee-latte",
    name: "Latte",
    category: "coffee",
    price: 4.5,
    image: require("@/assets/images/church-kiosk-temp-logo.png"),
  },
  {
    id: "coffee-espresso",
    name: "Espresso",
    category: "coffee",
    price: 3,
    image: require("@/assets/images/church-kiosk-temp-logo.png"),
  },
  {
    id: "coffee-iced",
    name: "Iced Coffe",
    category: "coffee",
    price: 3,
    image: require("@/assets/images/church-kiosk-temp-logo.png"),
  },

  {
    id: "juice-orange",
    name: "Orange Juice",
    category: "juice",
    price: 3.5,
    image: require("@/assets/images/church-kiosk-temp-logo.png"),
  },

  {
    id: "food-pao-de-queijo",
    name: "Pão de Queijo",
    category: "food",
    price: 3,
    image: require("@/assets/images/church-kiosk-temp-logo.png"),
  },
  {
    id: "food-misto-quente",
    name: "Misto Quente",
    category: "food",
    price: 4,
    image: require("@/assets/images/church-kiosk-temp-logo.png"),
  },

  {
    id: "dessert-brownie",
    name: "Brownie",
    category: "desserts",
    price: 3,
    image: require("@/assets/images/church-kiosk-temp-logo.png"),
  },
  {
    id: "dessert-lemon-cake",
    name: "Lemon Cake",
    category: "desserts",
    price: 3,
    image: require("@/assets/images/church-kiosk-temp-logo.png"),
  },
  {
    id: "dessert-carrot-cake",
    name: "Carrot Cake",
    price: 3,
    category: "desserts",
    image: require("@/assets/images/church-kiosk-temp-logo.png"),
  },
];

export default function OrdersScreen() {
  const { accountType } = useAuth();
  const borderColor = useThemeColor({}, "border")

  if (accountType === "worker") {
    return renderWorkerOrders();
  }

  return renderCustomerOrders(borderColor);
}

function renderCustomerOrders(borderColor: string) {
  const menuCategories: string[] = [... new Set(menuItems.map((item) => item.category))]
  return (
    <ThemedScrollView contentContainerStyle={styles.screenContent}>
      <ThemedText type="title">Order Menu</ThemedText>

      <Section title="Favorites">
        <HorizontalList
          data={favoriteItems}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (
            <MenuCard name={item.name} image={item.image} />
          )}
        />
      </Section>

      <Section title="Recents">
        <HorizontalList
          data={recentItems}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (
            <MenuCard name={item.name} image={item.image} />
          )}
        />
      </Section>

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
                  />
                )}
              />
            </ThemedView>
          )
        })}
      </Section>
    </ThemedScrollView>
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