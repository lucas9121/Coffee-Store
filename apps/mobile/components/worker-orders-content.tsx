import { useState, useEffect, useRef } from "react";
import { StyleSheet, ScrollView, Pressable } from "react-native";
import { ThemedScrollView } from "./ui/themed-scroll-view";
import { ThemedText } from "./ui/themed-text";
import { ThemedView } from "./ui/themed-view";
import { getAllOrders, updateOrderStatus, updateOrderPayment} from "@/services/orders-api";
import { getStoreStatus } from "@/services/store-settings";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { RequestError } from "@/services/api";

type OrderItem = {
  item: {
    _id: string;
    name: string;
    image?: string;
    price?: string;
    inStock?: boolean;
  };
  quantity: number;
  priceAtPurchase: number;
};

type Order = {
  _id: string;
  customerName: string;
  status: string;
  orderItems: OrderItem[];
  source: string,
  isPaid: boolean,
  totalPrice: number;
  createdAt: string;
};

type WorkerOrdersContentProps = {
  accountType: string;
  borderColor: string;
  token: string | null;
};

export function WorkerOrdersContent({
  borderColor,
  token
}: WorkerOrdersContentProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [paymentWarningOrderId, setPaymentWarningOrderId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"MOBILE" | "IN PERSON">("MOBILE");
  const skipNextPollRef = useRef(false);
  const isFirstOrdersLoadRef = useRef(true);
  const lastOrdersSignatureRef = useRef("");
  const router = useRouter();
  const { logout } = useAuth();

  async function handleUnauthorized(error: unknown) {
    if (error instanceof RequestError && error.status === 401) {
      await logout();
      router.replace("/login?sessionExpired=true");
      return true;
    }
    return false;
  };

  async function loadOrders(showLoading = false): Promise<void>{
    try {
      if(showLoading) setIsLoading(true);
      const data = await getAllOrders(token);
      const nextSignature = JSON.stringify(data);
      if(nextSignature !== lastOrdersSignatureRef.current){
        setOrders(data);
        lastOrdersSignatureRef.current = nextSignature
      }
      setHasError(false)
    } catch (error) {
      if (await handleUnauthorized(error)) return;
      console.error(error);
      setHasError(true);
    } finally {
      if(showLoading){
        setIsLoading(false);
        isFirstOrdersLoadRef.current = false;
      }
    }
  }

  async function pollWorkerOrders(showLoading = false) {
    try {
      const store = await getStoreStatus();
      if (!store.isOpen) return;
      await loadOrders(showLoading);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() =>{
    if(!token) return;
    pollWorkerOrders(isFirstOrdersLoadRef.current);

    // Poll with manual update skip
    const interval = setInterval(async () => {
      if(skipNextPollRef.current) {
        skipNextPollRef.current = false;
        return;
      }
      await pollWorkerOrders(false);
    }, 15000);

    return () => clearInterval(interval)
  }, [token])

  const filteredOrders = orders.filter((order) => order.source === activeTab);
  const placedOrders = filteredOrders.filter((order) => order.status === "PLACED");
  const inProgressOrders = filteredOrders.filter((order) => order.status === "IN PROGRESS");
  const readyOrders = filteredOrders.filter((order) => order.status === "READY");
  const mobileCount = orders.filter((order) => order.source === "MOBILE" && order.status !== "READY").length;
  const inPersonCount = orders.filter((order) => order.source === "IN PERSON" && order.status !== "READY").length;

  function getNextStatus(current: string): string | null {
    if (current === "PLACED") return "IN PROGRESS";
    if (current === "IN PROGRESS") return "READY";
    if (current === "READY") return "COMPLETED";
    return null;
  }

  async function handleUpdateStatus(orderId: string, currentStatus: string, isPaid: boolean) {
    const nextStatus = getNextStatus(currentStatus);
    if (!nextStatus) return;

    if(nextStatus === "COMPLETED" && !isPaid){
      setPaymentWarningOrderId(orderId);
      return;
    };

    try {
      await updateOrderStatus(orderId, nextStatus, token);
      skipNextPollRef.current = true;
      setPaymentWarningOrderId(null)
      await loadOrders(); 
    } catch (error) {
      if (await handleUnauthorized(error)) return;
      console.error(error);
    }
  }

  async function handleTogglePaid(orderId: string, currentPaid: boolean) {
    try {
      await updateOrderPayment(orderId, !currentPaid, token);
      if(paymentWarningOrderId === orderId && !currentPaid){
        setPaymentWarningOrderId(null);
      };
      skipNextPollRef.current = true;
      await loadOrders();
    } catch (error) {
      if (await handleUnauthorized(error)) return;
      console.error(error);
    }
  }

  function renderOrderList(orderList: Order[]) {
    if(orderList.length === 0) {
      return <ThemedText>No orders in this section</ThemedText>
    };

    return orderList.map((order) => {
      const nextStatus = getNextStatus(order.status);
      return(
        <ThemedView key={order._id} style={[styles.orderCard, {borderColor}]}>
          
          {/* Title */}
          <ThemedText type="defaultSemiBold" style={styles.orderTitle}>
            {order.customerName}
          </ThemedText>

          {/* Items */}
          <ThemedView style={styles.itemsGroup}>
            {order.orderItems.map((orderItem, index) => (
              <ThemedText key={`${order._id}-${index}`}>
                {orderItem.quantity} {orderItem.item.name}
              </ThemedText>
            ))}
          </ThemedView>

          {/* Meta */}
          <ThemedView style={styles.metaGroup}>
            <ThemedText>Total: ${order.totalPrice.toFixed(2)}</ThemedText>
            <ThemedView style={styles.paymentRow}>
              <ThemedText>Paid:</ThemedText>
              <Pressable
                style={[styles.paidButton, { borderColor }]}
                onPress={() => handleTogglePaid(order._id, order.isPaid)}
              >
                <ThemedText>{order.isPaid ? "Yes" : "No"}</ThemedText>
              </Pressable>
            </ThemedView>
            <ThemedText>Status: {order.status}</ThemedText>
            {paymentWarningOrderId === order._id && (
              <ThemedText style={styles.errorText}>Customer needs to pay</ThemedText>
            )}
          </ThemedView>

          {/* Action */}
          {nextStatus && (
            <ThemedText
              type="link"
              onPress={() => handleUpdateStatus(order._id, order.status, order.isPaid)}
            >
              → Move to {nextStatus}
            </ThemedText>
          )}

        </ThemedView>
      )
    })
  }

  return (
    <ThemedScrollView contentContainerStyle={styles.screenContent}>
      <ThemedText type="title">Worker Orders</ThemedText>

      {isLoading && <ThemedText>Loading orders...</ThemedText>}

      {hasError && (
        <ThemedText style={styles.errorText}>
          Unable to load orders right now.
        </ThemedText>
      )}    

      {!isLoading && !hasError && (
        <>
          <ThemedView style={styles.tabs}>
            <ThemedView style={styles.tabWrapper}>
              <ThemedText
                onPress={() => setActiveTab("MOBILE")}
                style={activeTab === "MOBILE" ? styles.activeTab : styles.tab}
                >
                Mobile
              </ThemedText>
              <ThemedView style={activeTab === "MOBILE" ? styles.activeTabBadge : styles.tabBadge}>
                <ThemedText style={styles.tabBadgeText}>{mobileCount}</ThemedText>
              </ThemedView>
            </ThemedView>

            <ThemedView style={styles.tabWrapper}>
              <ThemedText
                onPress={() => setActiveTab("IN PERSON")}
                style={activeTab === "IN PERSON" ? styles.activeTab : styles.tab}
                >
                In Person
              </ThemedText>
              <ThemedView style={activeTab === "IN PERSON" ? styles.activeTabBadge : styles.tabBadge}>
                <ThemedText style={styles.tabBadgeText}>{inPersonCount}</ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.board}
          >
            <ThemedView style={styles.column}>
              <ThemedText type="subtitle" style={styles.columnTitle}>Placed</ThemedText>
              {renderOrderList(placedOrders)}
            </ThemedView>

            <ThemedView style={styles.column}>
              <ThemedText type="subtitle" style={styles.columnTitle}>In Progress</ThemedText>
              {renderOrderList(inProgressOrders)}
            </ThemedView>

            <ThemedView style={styles.column}>
              <ThemedText type="subtitle" style={styles.columnTitle}>Ready</ThemedText>
              {renderOrderList(readyOrders)}
            </ThemedView>
          </ScrollView>
        </>
      )}
    </ThemedScrollView>
  );
};



const styles = StyleSheet.create({
  screenContent:{
    padding: 24,
    gap: 24,
  },
  errorText: {
    color: '#ff6b6b'
  },
  tabs: {
    flexDirection: "row",
    gap: 16,
  },
  activeTab: {
    fontWeight: "bold",
  },
  tab: {
    opacity: 0.5,
  },
  board: {
    gap: 16,
    paddingRight: 24,
  },
  column: {
    width: 260,
    gap: 12,
  },
  columnTitle: {
    textAlign: "center",
  },
  orderCard: {
    padding: 12,
    gap: 10,
    borderWidth: 1,
    borderRadius: 12,
  },
  orderTitle: {
    textAlign: "center",
  },
  itemsGroup: {
    gap: 2,
  },
  metaGroup: {
    gap: 2,
    paddingVertical: 8,
  },
  tabWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  activeTabBadge: {
    minWidth: 25,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    borderWidth: 1,
    backgroundColor: "green" // temp color
  },
  tabBadge: {
    minWidth: 25,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    borderWidth: 1,
  },
  tabBadgeText: {
    fontSize: 12,
  },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  paidButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
})