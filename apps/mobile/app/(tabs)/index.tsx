import { useState, useEffect } from "react";
import { StyleSheet } from "react-native";

import { ThemedView } from "@/components/ui/themed-view";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedScrollView } from "@/components/ui/themed-scroll-view";
import { Section } from "@/components/section";
import WorkerHomeScreen from "@/components/worker-home-content";

import {useAuth} from "../../context/AuthContext";
import { useOrder } from "@/context/OrderContext";
import { getOrderById } from "@/services/orders-api";

type LatestOrder = {
  _id: string;
  customerName: string;
  status: string;
  totalPrice: number;
  orderItems: {
    item: {
      name: string;
    };
    quantity: number;
  }[];
};

export default function HomeScreen() {
  const {accountType, accessToken} = useAuth();
  const {latestOrderId} = useOrder();
  const [latestOrder, setLatestOrder] = useState<LatestOrder | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)

  async function loadLatestOrder(): Promise<void>{
    if(!latestOrderId || accountType === "worker"){
      setLatestOrder(null);
      return;
    }
    try {
      setIsLoading(true);
      const order = await getOrderById(latestOrderId);
      setLatestOrder(order);
      setHasError(false)
    } catch (error) {
      console.error(error);
      setLatestOrder(null);
      setHasError(true)
    } finally{
      setIsLoading(false)
    }
  };


  useEffect(() => {
    loadLatestOrder()
  }, [latestOrderId, accountType])

  if (accountType === "worker") {
    return(
      <WorkerHomeScreen 
      accountType={accountType}
      accessToken={accessToken}
      />
    )
  }

  return (
    <ThemedScrollView contentContainerStyle={styles.screenContent}>
      <ThemedText type="title">Home</ThemedText>
      <ThemedText type="subtitle">This will become: announcements / store status / quick actions</ThemedText>

      {isLoading ? (
        <ThemedText>Loading latest order...</ThemedText>
      ) : latestOrder ?(
        <Section title="Latest Order">
          <ThemedText style={{marginTop: 8}}>Status: {latestOrder.status}</ThemedText>
          {latestOrder.orderItems.map((orderItem, index) => (
            <ThemedText key={index}>
              {orderItem.item.name} x{orderItem.quantity}
            </ThemedText>
          ))}
          <ThemedText>Total: ${latestOrder.totalPrice.toFixed(2)}</ThemedText>
        </Section>
      ) : hasError ? (
        <Section title="Latest Order">
          <ThemedText style={styles.errorText}>Unable to load latest order. Please try again.</ThemedText>
        </Section>
      ) : (
        <Section title="Latest Order">
          <ThemedText>No recent order yet</ThemedText>
        </Section>
      )}
    </ThemedScrollView>
  );
};


const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 12,
  },
  screenContent: {
    padding: 24,
    gap: 24,
  },
  errorText: {
    color: "#ff6b6b",
  },
});