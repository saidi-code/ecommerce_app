import { Product } from "@/constants/types";
import { useAuth } from "@clerk/expo";
import { createContext, useContext, useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import axios from "../constants/api";
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
  itemCount: number;
  isLoading: boolean;
};
const CartContext = createContext<CartContextType | undefined>(undefined);
export function CartProvider({ children }: { children: React.ReactNode }) {
  const { getToken, isSignedIn } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const token = await getToken();
      const { data } = await axios.get("/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success || data.sucess) {
        const serverCart = data.data;
        const mappedCartItems: CartItem[] = serverCart.items.map(
          (item: any) => ({
            id: item._id,
            productId: item?.product._id,
            product: item?.product,
            quantity: item.quantity,
            size: item?.size,
            price: item?.price,
          }),
        );

        setCartItems(mappedCartItems);
        setCartTotal(serverCart.totalAmount);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
    // setIsLoading(true);
    // const serverCart = dummyCart;
    // const mappedCartItems: CartItem[] = serverCart.items.map((item: any) => ({
    //   id: item.product._id,
    //   productId: item.product._id,
    //   product: item.product,
    //   quantity: item.quantity,
    //   size: item?.size || "M",
    //   price: item.product.price,
    // }));
    // setCartItems(mappedCartItems);
    // setCartTotal(
    //   serverCart.totalAmount,
    //   //   mappedCartItems.reduce(
    //   //     (total, item) => total + item.product.price * item.quantity,
    //   //     0,
    //   //   ),
    // );
    // setIsLoading(false);
  };
  const addToCart = async (product: Product, size: string) => {
    if (!isSignedIn) {
      return Toast.show({
        type: "error",
        text1: "Not Signed In",
        text2: "Please sign in to add items to your cart",
      });
    }
    try {
      setIsLoading(true);
      const token = await getToken();
      const { data } = await axios.post(
        "/cart/add",
        {
          productId: product._id,
          quantity: 1,
          size,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (data.success || data.sucess) {
        Toast.show({
          type: "success",
          text1: "Added to Cart",
          text2: `${product.name} has been added to your cart`,
        });
        await fetchCart();
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Failed to Add to Cart",
        text2: `${product.name} could not be added to your cart`,
      });
    } finally {
      setIsLoading(false);
    }
  };
  const removeFromCart = async (productId: string, size: string) => {
    if (!isSignedIn) {
      return;
    }
    try {
      setIsLoading(true);
      const token = await getToken();
      const { data } = await axios.delete(
        `/cart/item/${productId}?size=${size}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (data.success || data.sucess) {
        Toast.show({
          type: "success",
          text1: "Removed from Cart",
          text2: `The item has been removed from your cart`,
        });
        await fetchCart();
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      Toast.show({
        type: "error",
        text1: "Failed to Remove from Cart",
        text2: `The item could not be removed from your cart`,
      });
    } finally {
      setIsLoading(false);
    }
  };
  const updateCartItemQuantity = async (
    productId: string,
    size: string,
    quantity: number,
  ) => {
    if (!isSignedIn) {
      return;
    }
    if (quantity < 1) {
      return;
    }
    try {
      setIsLoading(true);
      const token = await getToken();
      const { data } = await axios.put(
        `/cart/item/${productId}`,
        {
          quantity,
          size,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (data.success || data.sucess) {
        Toast.show({
          type: "success",
          text1: "Quantity Updated",
          text2: `The item quantity has been updated in your cart`,
        });
        await fetchCart();
      }
    } catch (error) {
      console.error("Error update product cart quantity:", error);
      Toast.show({
        type: "error",
        text1: "Failed to Update Quantity",
        text2: `The item could not be updated in your cart`,
      });
    } finally {
      setIsLoading(false);
    }
  };
  const clearCart = async () => {
    if (!isSignedIn) {
      return;
    }
    try {
      setIsLoading(true);
      const token = await getToken();
      const { data } = await axios.delete(
        `/cart`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (data.success || data.sucess) {
        Toast.show({
          type: "success",
          text1: "Cart Cleared",
          text2: `Your cart has been cleared`,
        });
        setCartItems([]);
        setCartTotal(0);
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      Toast.show({
        type: "error",
        text1: "Failed to Clear Cart",
        text2: `Your cart could not be cleared`,
      });
    } finally {
      setIsLoading(false);
    }
  };
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  useEffect(() => {
    if (isSignedIn) {
      fetchCart();
    } else {
      setCartItems([]);
      setCartTotal(0);
    }
  }, [isSignedIn]);
  return (
    <CartContext.Provider
      value={{
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        cartTotal,
        itemCount: itemCount,
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
