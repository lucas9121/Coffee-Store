import React, { useState, useMemo, useContext, createContext } from "react";

type OrderContextValue = {
    latestOrder: string | null;
    setLatestOrder: React.Dispatch<React.SetStateAction<string | null>>;
};

const OrderContext = createContext<OrderContextValue | null>(null);

export function OrderProvider({children}: {children: React.ReactNode}){
  const [latestOrder, setLatestOrder] = useState<string | null>(null);

  const value = useMemo(() => ({latestOrder, setLatestOrder}), [latestOrder]);

  return<OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder(){
  const ctx = useContext(OrderContext);
  if(!ctx) throw new Error("useOrder must be used inside OrderProvider");
  return ctx;
}