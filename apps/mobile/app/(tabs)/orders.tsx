import { ThemedScrollView } from "@/components/ui/themed-scroll-view";
import { ThemedText } from "@/components/ui/themed-text";
import { Section } from "@/components/section";
import { HorizontalList } from "@/components/horizontal-list";
import { useAuth } from "@/context/AuthContext";
import { StyleSheet } from "react-native";
import { MenuCard } from "@/components/menu-card";

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

export default function OrdersScreen() {
  const { accountType } = useAuth();

  if (accountType === "worker") {
    return renderWorkerOrders();
  }

  return renderCustomerOrders();
}

function renderCustomerOrders() {
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
        <ThemedText>Coffee</ThemedText>
        <ThemedText>Juice</ThemedText>
        <ThemedText>Food</ThemedText>
        <ThemedText>Desserts</ThemedText>
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
    gap: 24
  },
  card: {
    minWidth: 120,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8
  }
})