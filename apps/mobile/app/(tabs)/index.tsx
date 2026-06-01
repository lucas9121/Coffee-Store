import WorkerHomeScreen from "@/components/worker-home-content";
import CustomerHomeScreen from "@/components/customer-home-content";

import { useAuth } from "../../context/AuthContext";
import { useOrder } from "@/context/OrderContext";
import { AppHeader } from "@/components/app-header";


export default function HomeScreen() {
  const {accountType, accessToken} = useAuth();
  const {latestOrderId} = useOrder();

  if (accountType === "worker") {
    return(
      <>
        <AppHeader subtitle="Home" />
        <WorkerHomeScreen 
        accountType={accountType}
        accessToken={accessToken}
        />
      </>
    )
  }

  return (
    <>
      <AppHeader subtitle="Home" />
      <CustomerHomeScreen 
        accountType={accountType}
        latestOrderId={latestOrderId}
      />
    </>
  );
};
