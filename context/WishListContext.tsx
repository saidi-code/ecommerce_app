// contexts/WishlistContext.tsx
import { Product } from "@/constants/types";
import { useAuth } from "@clerk/expo";
import { createContext, useContext, useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import axios from "../constants/api";

export type WishlistItem = {
  id: string;
  productId: string;
  product: Product;
};

type WishlistContextType = {
  wishlistItems: WishlistItem[];
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;
  isLoading: boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { getToken, isSignedIn } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWishlist = async () => {
    try {
      setIsLoading(true);
      const token = await getToken();
      const { data } = await axios.get("/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        const serverWishlist = data.data;
        const mappedWishlistItems: WishlistItem[] = serverWishlist.products.map(
          (item: any) => ({
            id: item._id,
            productId: item._id,
            product: item,
          }),
        );
        setWishlistItems(mappedWishlistItems);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToWishlist = async (product: Product) => {
    if (!isSignedIn) {
      return Toast.show({
        type: "error",
        text1: "Not Signed In",
        text2: "Please sign in to add items to your wishlist",
      });
    }

    try {
      setIsLoading(true);
      const token = await getToken();
      const { data } = await axios.post(
        "/wishlist",
        { productId: product },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (data.success) {
        Toast.show({
          type: "success",
          text1: "Added to Wishlist",
          text2: `${product.name} has been added to your wishlist`,
        });
        await fetchWishlist();
      } else {
      
        Toast.show({
          type: "error",
          text1: "Already in Wishlist",
          text2: `${product.name} is already in your wishlist`,
        });
      }
    } catch (error: any) {
      console.error("Error adding to wishlist:", error);
      Toast.show({
        type: "error",
        text1: "Failed to Add to Wishlist",
        text2: `${product.name} could not be added to your wishlist`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!isSignedIn) {
      return;
    }

    try {
      setIsLoading(true);
      const token = await getToken();
      const { data } = await axios.delete(`/wishlist/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        Toast.show({
          type: "success",
          text1: "Removed from Wishlist",
          text2: "The item has been removed from your wishlist",
        });
        await fetchWishlist();
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      Toast.show({
        type: "error",
        text1: "Failed to Remove from Wishlist",
        text2: "The item could not be removed from your wishlist",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.some((item) => item.productId === productId);
  };

  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    if (isSignedIn) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [isSignedIn]);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        wishlistCount,
        isLoading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
