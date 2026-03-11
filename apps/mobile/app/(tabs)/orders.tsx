import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OrdersScreen() {
  const { accountType } = useAuth();

  if (accountType === "worker") {
    return renderWorkerOrders();
  }

  return renderCustomerOrders();
}

function renderCustomerOrders() {
  return (
    <ThemedView style={{ flex: 1, padding: 24, gap: 24 }}>
      <ThemedText type="title">Order Menu</ThemedText>

      <ThemedText type="subtitle">Favorites</ThemedText>
      <ThemedText>Favorite items will appear here</ThemedText>

      <ThemedText type="subtitle">Recents</ThemedText>
      <ThemedText>Recent items will appear here</ThemedText>

      <ThemedText type="subtitle">Menu</ThemedText>
      <ThemedText>Coffee</ThemedText>
      <ThemedText>Juice</ThemedText>
      <ThemedText>Food</ThemedText>
      <ThemedText>Desserts</ThemedText>
    </ThemedView>
  );
}

function renderWorkerOrders() {
  return (
    <ThemedView style={{ flex: 1, padding: 24, gap: 24 }}>
      <ThemedText type="title">Worker Orders</ThemedText>

      <ThemedText type="subtitle">Mobile Orders</ThemedText>
      <ThemedText>Incoming mobile orders will appear here</ThemedText>

      <ThemedText type="subtitle">In-Person Orders</ThemedText>
      <ThemedText>Walk-up orders will appear here</ThemedText>
    </ThemedView>
  );
}