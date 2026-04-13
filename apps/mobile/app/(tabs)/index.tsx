import WorkerHomeScreen from "@/components/worker-home-content";
import CustomerHomeScreen from "@/components/customer-home-content";

import { useAuth } from "../../context/AuthContext";
import { useOrder } from "@/context/OrderContext";


export default function HomeScreen() {
  const {accountType, accessToken} = useAuth();
  const {latestOrderId} = useOrder();

  if (accountType === "worker") {
    return(
      <WorkerHomeScreen 
      accountType={accountType}
      accessToken={accessToken}
      />
    )
  }

  return (
    <CustomerHomeScreen 
      accountType={accountType}
      latestOrderId={latestOrderId}
    />
  );
};
