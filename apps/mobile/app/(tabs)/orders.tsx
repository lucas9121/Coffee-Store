import { useThemeColor } from "@/hooks/use-theme-color";

import { CustomerOrdersContent } from "@/components/customer-orders-content";
import { WorkerOrdersContent } from "@/components/worker-orders-content";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";


type MenuListItem = {
  id: string;
  name: string;
  price: number;
  image: string | number;
};

export default function OrdersScreen() {
  const { accountType, accessToken } = useAuth();
  const borderColor = useThemeColor({}, "border");
  const { cartItems, setCartItems } = useCart();

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  function handleAddToCart(item: MenuListItem) {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);

      if (existing) {
        return prev.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [...prev, { ...item, quantity: 1 }];
    });
  }

  if (accountType === "worker") {
    return(
      <WorkerOrdersContent 
      accountType={accountType}
      borderColor={borderColor}
      token={accessToken}
      />
    )
  }

  return (
  <CustomerOrdersContent
    accountType={accountType}
    token={accessToken}
    borderColor={borderColor}
    handleAddToCart={handleAddToCart}
    cartCount={cartCount}
  />
);
}





