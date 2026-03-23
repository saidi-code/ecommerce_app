import { dummyCart } from "@/assets/assets";
import { Product } from "@/constants/types";
import { createContext, useContext, useEffect, useState } from "react";
export type CartItem = {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  size: string;
  price: number;
};
type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: Product, size: string) => Promise<void>;
  removeFromCart: (itemId: string, size: string) => Promise<void>;
  updateCartItemQuantity: (
    itemId: string,
    size: string,
    quantity: number,
  ) => Promise<void>;
  clearCart: () => Promise<void>;
  cartTotal: number;
  itemCont: number;
  isLoading: boolean;
};
const CartContext = createContext<CartContextType | undefined>(undefined);
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const fetchCart = async () => {
    setIsLoading(true);
    const serverCart = dummyCart;
    const mappedCartItems: CartItem[] = serverCart.items.map((item: any) => ({
      id: item.product._id,
      productId: item.product._id,
      product: item.product,
      quantity: item.quantity,
      size: item?.size || "M",
      price: item.product.price,
    }));
    setCartItems(mappedCartItems);
    setCartTotal(
      serverCart.totalAmount,
      //   mappedCartItems.reduce(
      //     (total, item) => total + item.product.price * item.quantity,
      //     0,
      //   ),
    );
    setIsLoading(false);
  };
  const addToCart = async (product: Product, size: string) => {};
  const removeFromCart = async (productId: string, size: string) => {};
  const updateCartItemQuantity = async (
    productId: string,
    size: string,
    quantity: number,
  ) => {};
  const clearCart = async () => {};
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  useEffect(() => {
    fetchCart();
  }, []);
  return (
    <CartContext.Provider
      value={{
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        cartTotal,
        itemCont: itemCount,
        isLoading,
        cartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
