import { useState, useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";

import { useThemeColor } from "@/hooks/use-theme-color";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedScrollView } from "@/components/ui/themed-scroll-view";
import { ThemedButton } from "./ui/themed-button";
import { Section } from "@/components/section";
import { Card } from "./card";

import { getOrderById } from "@/services/orders-api";
import { getStoreStatus } from "@/services/store-settings";
import { getStoreHours } from "@/services/store-settings";
import { spacing } from "@/constants/tokens";


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

type Schedule = {
  open: string;
  close: string;
  enabled: boolean;
}

type StoreHours = {
  sunday: Schedule,
  monday: Schedule,
  tuesday: Schedule,
  wednesday: Schedule,
  thursday: Schedule,
  friday: Schedule,
  saturday:Schedule,
}

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
  const [isOpen, setIsOpen] = useState(false);
  const [nextOpenMessage, setNextOpenMessage] = useState("");
  const isFirstOrderLoadRef = useRef(true);
  const lastOrderSignatureRef = useRef("");
  const router = useRouter();
  const errorColor = useThemeColor({}, "danger")
  const successColor = useThemeColor({}, "success")

  async function loadStoreStatus() {
    try {
      const store = await getStoreStatus();
      setIsOpen(store.isOpen);
    } catch (error) {
      console.error(error);
    }
  };

  function formatTime(time: string): string {
    const [hourStr, minute] = time.split(":");
    let hour = Number(hourStr);

    const ampm = hour >= 12 ? "PM" : "AM";

    hour = hour % 12;
    if (hour === 0) hour = 12;

    return `${hour}:${minute} ${ampm}`;
  };

  function getNextOpenMessage(schedule: StoreHours): string {
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ] as const;

    const todayIndex = new Date().getDay();

    for (let i = 0; i < 7; i++) {
      const dayIndex = (todayIndex + i) % 7;
      const dayName = days[dayIndex];
      const daySchedule = schedule[dayName];

      if (daySchedule.enabled) {
        const displayDay = i === 0 ? "today" : dayName.charAt(0).toUpperCase() + dayName.slice(1);

        return `We look forward to serving you again ${displayDay} at ${formatTime(daySchedule.open)}.`;
      }
    }

    return "We look forward to serving you again soon.";
  };

  async function getStoreSchedule() {
    try {
      const data = await getStoreHours();
      setNextOpenMessage(getNextOpenMessage(data.weeklySchedule));
    } catch (error) {
      console.error(error);
    }
  }

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
        setIsOpen(store.isOpen);
        if(store.isOpen && latestOrderId) {
          await fetchLatest(showLoading);
        }
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

  useEffect(() => {
    loadStoreStatus();
    getStoreSchedule();
  }, []);

  return (
    <ThemedScrollView padding="xl" gap="xl">

      <Section title="Store Status">
        <Card>
          {isOpen ? (
            <>
              <ThemedText type="defaultSemiBold" style={{color: successColor}}>OPEN</ThemedText>
              <ThemedText>Ordering is available now</ThemedText>
            </>
          ) : (
            <>
              <ThemedText type="defaultSemiBold" style={{color: errorColor}}>CLOSED</ThemedText>
              <ThemedText>{nextOpenMessage || "We look forward to serving you again soon."}</ThemedText>
            </>
          )}
        </Card>
      </Section>

      <Section title="Latest Order">
        <Card>
          {isLoading ? (
            <ThemedText>Loading latest order...</ThemedText>
          ) : latestOrder ? 
          (
            <>
              <ThemedText style={{ marginTop: 8 }}>
                Status: {latestOrder.status}
              </ThemedText>

              {latestOrder.orderItems.map((orderItem, index) => (
                <ThemedText key={index}>
                  {orderItem.item.name} x{orderItem.quantity}
                </ThemedText>
              ))}

              <ThemedText>Total: ${latestOrder.totalPrice.toFixed(2)}</ThemedText>
            </>
          ) : hasError ? 
          (
            <ThemedText style={{color: errorColor}}> Unable to load latest order. Please try again.</ThemedText>
          ) : 
          (
            <ThemedText>No recent order yet</ThemedText>
          )}
        </Card>
      </Section>

      <Section title="Quick Actions">
        <Card>
          <View style={styles.quickActions}>
            <ThemedButton
              variant="primary"
              style={{flex: 1}}
              onPress={() => router.push("/orders")}
            >
              Order Now
            </ThemedButton>

            <ThemedButton
              variant="primary"
              style={{flex: 1}}
              onPress={() => router.push("/settings")}
            >
              Settings
            </ThemedButton>
          </View>
        </Card>
      </Section>

      <Section title="Announcements">
        <Card>
          <ThemedText>Welcome to the Catedral Café</ThemedText>
          <ThemedText>Coffee and snacks are available before and after service times.</ThemedText>
        </Card>
      </Section>
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({
  quickActions: {
    flexDirection: "row",
    gap: spacing.md,
  },
});