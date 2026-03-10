import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/context/AuthContext";

export default function OrdersScreen() {
  const {accountType} = useAuth();

  return(
    <ThemedView style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
      <ThemedText type="title">{accountType === "worker" ? "Worker Orders" : "Order Menu"}</ThemedText>
      <ThemedText>accountType: {accountType}</ThemedText>
    </ThemedView>
  )
}