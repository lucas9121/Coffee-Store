import React, { useState, useMemo, useContext, createContext } from "react";

type OrderContextValue = {
    latestOrderId: string | null;
    setLatestOrderId: React.Dispatch<React.SetStateAction<string | null>>;
};

const OrderContext = createContext<OrderContextValue | null>(null);

export function OrderProvider({children}: {children: React.ReactNode}){
  const [latestOrderId, setLatestOrderId] = useState<string | null>(null);

  const value = useMemo(() => ({latestOrderId, setLatestOrderId}), [latestOrderId]);

  return<OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder(){
  const ctx = useContext(OrderContext);
  if(!ctx) throw new Error("useOrder must be used inside OrderProvider");
  return ctx;
}