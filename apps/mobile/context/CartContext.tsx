import React, { useState, useMemo, useContext, createContext } from "react";


type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string | number;
  quantity: number;
}

type CartContextValue = {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const CartContext = createContext<CartContextValue | null>(null); 

export function CartProvider({children}: {children: React.ReactNode}){
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const value = useMemo(() => ({cartItems, setCartItems}), [cartItems]);
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext);
  if(!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}