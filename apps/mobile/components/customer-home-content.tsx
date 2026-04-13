import { useState, useEffect, useRef } from "react";
import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/ui/themed-text";
import { ThemedScrollView } from "@/components/ui/themed-scroll-view";
import { Section } from "@/components/section";

import { getOrderById } from "@/services/orders-api";
import { getStoreStatus } from "@/services/store-settings";

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

type CustomerHomeScreenProps = {
  accountType: string;
  latestOrderId: string | null;
};

export default function CustomerHomeScreen({
  accountType,
  latestOrderId,
}: CustomerHomeScreenProps) {
  const [latestOrder, setLatestOrder] = useState<LatestOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const isFirstOrderLoadRef = useRef(true);
  const lastOrderSignatureRef = useRef("");

  useEffect(() => {
    if (!latestOrderId || accountType === "worker") return;
    let isMounted = true;
    let interval: ReturnType<typeof setInterval> | null = null;
    isFirstOrderLoadRef.current = true;
    lastOrderSignatureRef.current = "";

    async function fetchLatest(showLoading = false) {
      try {
        if (!isMounted) return;
        if (showLoading) setIsLoading(true);
        const order = await getOrderById(latestOrderId!);
        const nextSignature = JSON.stringify(order);
        if (nextSignature !== lastOrderSignatureRef.current) {
          setLatestOrder(order);
          lastOrderSignatureRef.current = nextSignature;
        };
        setHasError(false);
        const isActiveStatus =
          order.status === "PLACED" ||
          order.status === "IN PROGRESS" ||
          order.status === "READY";
        if (!isActiveStatus && interval) {
          clearInterval(interval);
          interval = null;
        }
      } catch (error) {
        console.error(error);
        setHasError(true);
      } finally {
        if (showLoading) {
          setIsLoading(false);
          isFirstOrderLoadRef.current = false;
        };
      };
    };

    async function pollCustomerOrder(showLoading = false) {
      try {
        const store = await getStoreStatus();
        await fetchLatest(showLoading);
        if (!store.isOpen && interval) {
          clearInterval(interval);
          interval = null;
        }
      } catch (error) {
        console.error(error);
      };
    };

    pollCustomerOrder(isFirstOrderLoadRef.current);
    interval = setInterval(async () => {
      await pollCustomerOrder(false);
    }, 20000);
    return () => {
      isMounted = false;
      if (interval) clearInterval(interval);
    };
  }, [latestOrderId, accountType]);

  return (
    <ThemedScrollView contentContainerStyle={styles.screenContent}>
      <ThemedText type="title">Home</ThemedText>
      <ThemedText type="subtitle">
        This will become: announcements / store status / quick actions
      </ThemedText>

      {isLoading ? (
        <ThemedText>Loading latest order...</ThemedText>
      ) : latestOrder ? (
        <Section title="Latest Order">
          <ThemedText style={{ marginTop: 8 }}>
            Status: {latestOrder.status}
          </ThemedText>

          {latestOrder.orderItems.map((orderItem, index) => (
            <ThemedText key={index}>
              {orderItem.item.name} x{orderItem.quantity}
            </ThemedText>
          ))}

          <ThemedText>Total: ${latestOrder.totalPrice.toFixed(2)}</ThemedText>
        </Section>
      ) : hasError ? (
        <Section title="Latest Order">
          <ThemedText style={styles.errorText}>
            Unable to load latest order. Please try again.
          </ThemedText>
        </Section>
      ) : (
        <Section title="Latest Order">
          <ThemedText>No recent order yet</ThemedText>
        </Section>
      )}
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    padding: 24,
    gap: 24,
  },
  errorText: {
    color: "#ff6b6b",
  },
});