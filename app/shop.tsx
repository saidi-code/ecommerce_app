import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { COLORS } from "@/constants";
import { Product } from "@/constants/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import axios from "../constants/api";
export default function Shop() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const fetchInFlight = React.useRef(false);
  const fetchProducts = async (pageNumber: number = 1) => {
    if (fetchInFlight.current) return;
    fetchInFlight.current = true;
    if (pageNumber === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    try {
      const queryParams: any = { page: pageNumber, limit: 10 };
      const { data } = await axios.get("/products", { params: queryParams });
      if (pageNumber === 1) {
        setProducts(data.data);
      } else {
        setProducts((prev) => [...prev, ...data.data]);
      }
      setHasMore(data.pagination.page < data.pagination.pages);
      setPage(pageNumber);
    } catch (error: any) {
      console.error("Error fetching products:", error);
    } finally {
      fetchInFlight.current = false;
      setLoading(false);
      setLoadingMore(false);
    }
    // if (fetchInFlight.current) return;
    // fetchInFlight.current = true;
    // if (pageNumber === 1) {
    //   setLoading(true);
    // } else {
    //   setLoadingMore(true);
    // }
    // try {
    //   const start = (pageNumber - 1) * 10;
    //   const end = start + 10;
    //   const paginatedData = dummyProducts.slice(start, end);
    //   if (pageNumber === 1) {
    //     setProducts(paginatedData);
    //   } else {
    //     setProducts((prev) => [...prev, ...paginatedData]);
    //   }
    //   setHasMore(end < dummyProducts.length);
    //   setPage(pageNumber);
    // } catch (error) {
    //   console.error("Error fetching products:", error);
    // } finally {
    //   fetchInFlight.current = false;
    //   setLoading(false);
    //   setLoadingMore(false);
    // }
  };
  const loadMore = () => {
    if (!loading && !loadingMore && hasMore && !fetchInFlight.current) {
      fetchProducts(page + 1);
    }
  };
  useEffect(() => {
    fetchProducts(1);
  }, []);
  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["bottom"]}>
      <Header title="Shop" showBack showCart />
      <View className="flex-row  items-center gap-2 mb-3 mx-4 my-6">
        {/* Search bar */}
        <View className="flex-1 flex-row items-center bg-white rounded-xl border border-gray-100">
          <Ionicons
            name="search"
            className="ml-4"
            size={20}
            color={COLORS.secondary}
          />
          <TextInput
            className="flex-1 ml-2 text-primary px-4 py-3"
            placeholder="Search products"
            returnKeyType="search"
            placeholderTextColor={COLORS.secondary}
          />
        </View>
        {/* Filter Icon*/}
        <TouchableOpacity className="bg-gray-800 w-11 h-11 items-center justify-center rounded-xl">
          <Ionicons name="options-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          numColumns={2}
          contentContainerStyle={{
            padding: 16,
          }}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => <ProductCard product={item} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <View className="flex-1 flex-row items-center justify-center mt-4">
                <Text className="text-secondary mr-2 text-sm">
                  Loading more products...
                </Text>
                <ActivityIndicator size="small" color={COLORS.primary} />
              </View>
            ) : (
              <View className="items-center justify-center mt-4">
                <Text className="text-secondary *:text-sm">
                  No more products to load{" "}
                </Text>
              </View>
            )
          }
          ListEmptyComponent={
            !loading && (
              <View className="flex-1 items-center justify-center">
                <Text className="text-secondary">No products found</Text>
              </View>
            )
          }
        />
      )}
    </SafeAreaView>
  );
}
