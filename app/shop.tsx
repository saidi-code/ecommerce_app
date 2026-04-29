import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { COLORS } from "@/constants";
import { Product } from "@/constants/types";
import { Ionicons } from "@expo/vector-icons";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
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
  const [statusModalVisible, setStatusModalVisible] = React.useState(false);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([
    "All",
  ]);
  const [selectedSizes, setSelectedSizes] = React.useState<string[]>(["All"]);
  const [priceRange, setPriceRange] = React.useState<[number, number]>([
    10, 1000,
  ]);
  const [searchQuery, setSearchQuery] = React.useState("");

  const isCategorySelected = (category: string) => {
    return selectedCategories.includes(category);
  };
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
  };
  const CATEGORIES = ["All", "Men", "Women", "Kids", "Shoes", "Bags", "Other"];
  const SIZES = ["All", "S", "M", "L", "XXL", "XXXL"];
  const loadMore = () => {
    if (!loading && !loadingMore && hasMore && !fetchInFlight.current) {
      fetchProducts(page + 1);
    }
  };
  const handleFilterApply = async () => {
    // Implement filter logic here based on selectedCategories, selectedSizes, and priceRange
    try {
      const filters: any = {};
      if (!selectedCategories.includes("All")) {
        filters.categories = selectedCategories;
      }
      if (!selectedSizes.includes("All")) {
        filters.sizes = selectedSizes;
      }
      filters.minPrice = priceRange[0];
      filters.maxPrice = priceRange[1];
      // You can make an API call here to fetch filtered products based on the selected filters
      const { data } = await axios.get("/products", { params: filters });
      setProducts(data.data);
      setPage(1);
      setHasMore(data.pagination?.page < data.pagination?.pages);
      setStatusModalVisible(false);
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };
  const handleResetFilters = async () => {
    setSelectedCategories(["All"]);
    setSelectedSizes(["All"]);
    setPriceRange([250, 750]);
    await fetchProducts(1);
  };
  const handleSearch = async (query: string) => {
    try {
      const { data } = await axios.get("/products", {
        params: { search: query },
      });
      setProducts(data.data);
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleSearch(searchQuery);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);
  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top", "bottom"]}>
      <Header title="Shop" showBack showCart />
      <View className="flex-row  items-center gap-2 mb-3 mx-4 my-2">
        {/* Search bar */}
        <View className="flex-1 flex-row items-center bg-white rounded-xl border border-gray-100">
          <Ionicons
            name="search"
            className="ml-4"
            size={20}
            color={COLORS.secondary}
          />
          <TextInput
            className="flex-1 ml-2 text-primary px-4 py-4"
            placeholder="Search products"
            returnKeyType="search"
            placeholderTextColor={COLORS.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        {/* Filter Icon*/}
        <TouchableOpacity
          onPress={() => setStatusModalVisible(!statusModalVisible)}
          className="bg-primary w-11 h-11 items-center justify-center rounded-xl"
        >
          <Ionicons name="filter-sharp" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <View className="flex-1">
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
        </View>
      )}
      {/* STATUS MODAL */}
      <Modal
        visible={statusModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setStatusModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setStatusModalVisible(false)}>
          <View className="flex-1 justify-end bg-black/50">
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View className="bg-white rounded-t-2xl p-4 max-h-[60%]">
                <View className="flex-row justify-between items-center mb-4 pb-4 border-b border-gray-100">
                  <Text className="text-lg font-bold text-primary">
                    Filter Products
                  </Text>
                  <TouchableOpacity
                    onPress={() => setStatusModalVisible(false)}
                  >
                    <Ionicons name="close" size={24} color={COLORS.secondary} />
                  </TouchableOpacity>
                </View>
                <ScrollView className="" showsVerticalScrollIndicator={false}>
                  <View className="flex-1">
                    {/* Filter options */}
                    <View className="flex-row items-center mb-3">
                      <Ionicons
                        name="pricetags-outline"
                        size={20}
                        color={COLORS.secondary}
                      />
                      <Text className="text-secondary text-sm ml-2">
                        By Category
                      </Text>
                    </View>
                    {/* filter by Category */}
                    <View className="flex-wrap flex-row   items-center mb-3 ">
                      {CATEGORIES.map((cat, idx) => (
                        <TouchableOpacity
                          key={idx}
                          className={`px-3 py-1  ${isCategorySelected(cat) ? "bg-primary" : "bg-gray-300"} rounded-full mr-2 mb-2`}
                          onPress={() => {
                            if (cat === "All") {
                              setSelectedCategories(["All"]);
                            } else {
                              if (isCategorySelected(cat)) {
                                const newCategories = selectedCategories.filter(
                                  (c) => c !== cat,
                                );
                                setSelectedCategories(
                                  newCategories.length > 0
                                    ? newCategories
                                    : ["All"],
                                );
                              } else {
                                setSelectedCategories([
                                  ...selectedCategories.filter(
                                    (c) => c !== "All",
                                  ),
                                  cat,
                                ]);
                              }
                            }
                          }}
                        >
                          <View className="flex-row items-center">
                            {isCategorySelected(cat) ? (
                              <Ionicons
                                name="checkmark"
                                size={16}
                                color="#FFF"
                                className="mr-1"
                              />
                            ) : (
                              <Ionicons
                                name="ellipse-outline"
                                size={16}
                                color={COLORS.primary}
                                className="mr-1"
                              />
                            )}

                            <Text
                              className={`text-sm ${isCategorySelected(cat) ? "text-white" : "text-primary"}`}
                            >
                              {cat}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                    {/* Filter by Sizes  */}

                    <View className="flex-row items-center mb-3">
                      <Ionicons
                        name="resize-outline"
                        size={20}
                        color={COLORS.secondary}
                      />
                      <Text className="text-secondary text-sm ml-2">
                        By Size
                      </Text>
                    </View>
                    <View className="flex-wrap flex-row  flex-1 items-center mb-3">
                      {SIZES.map((size, idx) => (
                        <TouchableOpacity
                          key={idx}
                          className={`px-3 py-1  ${selectedSizes.includes(size) ? "bg-primary" : "bg-gray-300"} rounded-md mr-2 mb-2`}
                          onPress={() => {
                            if (size === "All") {
                              setSelectedSizes(["All"]);
                            } else {
                              if (selectedSizes.includes(size)) {
                                const newSizes = selectedSizes.filter(
                                  (s) => s !== size,
                                );
                                setSelectedSizes(
                                  newSizes.length > 0 ? newSizes : ["All"],
                                );
                              } else {
                                setSelectedSizes([
                                  ...selectedSizes.filter((s) => s !== "All"),
                                  size,
                                ]);
                              }
                            }
                          }}
                        >
                          <View className="flex-row items-center">
                            {selectedSizes.includes(size) ? (
                              <Ionicons
                                name="checkmark"
                                size={16}
                                color="#FFF"
                                className="mr-1"
                              />
                            ) : (
                              <Ionicons
                                name="ellipse-outline"
                                size={16}
                                color={COLORS.primary}
                                className="mr-1"
                              />
                            )}
                            <Text
                              className={`text-sm ${selectedSizes.includes(size) ? "text-white" : "text-primary"}`}
                            >
                              {size}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                    {/* Filter by Price Range */}
                    <View className="flex-row items-center mb-3">
                      <Ionicons
                        name="cash-outline"
                        size={20}
                        color={COLORS.secondary}
                      />
                      <Text className="text-secondary text-sm ml-2">
                        By Price
                      </Text>
                    </View>
                    <View className="flex-1 ml-4">
                      <MultiSlider
                        values={[priceRange[0], priceRange[1]]}
                        min={10}
                        max={1000}
                        step={10}
                        allowOverlap={false}
                        snapped
                        onValuesChange={(values: number[]) =>
                          setPriceRange([values[0], values[1]])
                        }
                        selectedStyle={{ backgroundColor: COLORS.accent }}
                        unselectedStyle={{ backgroundColor: COLORS.secondary }}
                        markerStyle={{
                          backgroundColor: COLORS.primary,
                          height: 24,
                          width: 24,
                          borderRadius: 12,
                        }}
                      />
                    </View>

                    <View className="flex-row justify-between items-center mb-6">
                      <Text className="text-secondary text-sm ml-2">
                        Price : ${priceRange[0]} - ${priceRange[1]}
                      </Text>
                    </View>

                    <View className="flex-row items-center justify-between mb-3">
                      <View className="flex-row items-center ">
                        <TouchableOpacity
                          onPress={handleFilterApply}
                          className={`flex-row items-center px-3 py-1 rounded-full   bg-primary`}
                        >
                          <Ionicons
                            name="checkmark-outline"
                            size={20}
                            color="#FFF"
                          />
                          <Text className="text-white text-sm ">Apply</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          className="flex-row items-center px-3 py-1 rounded-full ml-2 bg-gray-300 "
                          onPress={() => setStatusModalVisible(false)}
                        >
                          <Ionicons
                            name="close-outline"
                            size={20}
                            color={COLORS.secondary}
                          />
                          <Text className="text-secondary text-sm ">
                            Cancel
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <TouchableOpacity
                        onPress={handleResetFilters}
                        className="flex-row items-center "
                      >
                        <Ionicons
                          name="refresh-outline"
                          size={20}
                          color="#FF4C3B"
                        />
                        <Text className="text-accent text-sm ml-2">
                          Reset Filters
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}
