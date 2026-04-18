import { dummyProducts } from "@/assets/assets";
import { COLORS } from "@/constants";
import { Product } from "@/constants/types";
import { useCart } from "@/context/CartContext";
import { useWishList } from "@/context/WishListContext";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const width = Dimensions.get("window").width;
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, cartItems, itemCount } = useCart();
  const { toggleWishlist, isInWishlist } = useWishList();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const fetchProduct = async () => {
    setProduct(dummyProducts.find((p) => p._id === id) as any);
    setLoading(false);
  };
  useEffect(() => {
    fetchProduct();
  }, []);
  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }
  if (!product) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <View className="justify-center items-center">
          <Ionicons name="alert-circle" size={48} color={COLORS.primary} />
          <Text className="text-lg text-primary">Product not found</Text>
        </View>
      </SafeAreaView>
    );
  }
  const isLiked = isInWishlist(product._id);
  const handleAddToCart = () => {
    if (!selectedSize) {
      Toast.show({
        type: "info",
        text1: "No size selected",
        text2: "Please select a size",
      });
      return;
    }
    addToCart(product, selectedSize || "");
  };
  return (
    <SafeAreaView className="flex-1 bg-white ">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Image Carousel */}
        <View className="relative h-[450px]  bg-gray-100 mb-6">
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={(e) => {
              const index = Math.round(
                e.nativeEvent.contentOffset.x /
                  e.nativeEvent.layoutMeasurement.width,
              );
              setActiveImageIndex(index);
            }}
          >
            {product.images?.map((img: string, index: number) => (
              <View key={index} className="w-full h-full">
                <Image
                  source={{ uri: img }}
                  style={{ width: width, height: 450 }}
                  resizeMode="cover"
                />
              </View>
            ))}
          </ScrollView>
          {/* Header actions */}
          <View className="absolute top-12 left-4 right-4 flex-row justify-between items-center z-10">
            <TouchableOpacity
              className="p-2 rounded-full bg-white/80 shadow"
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              className="p-2 rounded-full bg-white/80 shadow"
              onPress={() => toggleWishlist(product)}
            >
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                size={24}
                color={isLiked ? COLORS.accent : COLORS.primary}
              />
            </TouchableOpacity>
          </View>
          {/* Pagination Dots */}
          <View className="absolute bottom-4 left-0 right-0 flex-row justify-center gap-2">
            {product.images.map((_: string, index: number) => (
              <View
                key={index}
                className={`w-2 h-2 rounded-full mx-1 ${index === activeImageIndex ? "bg-primary w-6" : "bg-gray-300"}`}
              />
            ))}
          </View>
        </View>
        {/* Product Info */}
        <View className="px-5">
          {/* Product Title and Rating */}
          <View className="flex-row justify-between items-start mb-2">
            <Text className="text-2xl font-bold text-primary flex-1 mr-4 ">
              {product.name}
            </Text>
            <View className="flex-row items-start justify-between mb-2">
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text className="text-sm font-bold text-secondary ml-1">
                {product.ratings.average.toFixed(1)}
              </Text>
              <Text className="text-xs text-secondary ml-1">
                ({product.ratings.count})
              </Text>
            </View>
          </View>
          {/* Price  */}

          <Text className="text-2xl font-bold text-primary mb-6">
            ${product.price.toFixed(2)}
          </Text>
          {/* Size */}
          {product.sizes && product.sizes.length > 0 && (
            <>
              <Text className="text-base font-bold text-primary">Sizes</Text>
              <View className="flex-row gap-3 mb-6 flex-wrap">
                {product.sizes.map((size) => (
                  <TouchableOpacity
                    key={size}
                    className={`px-4 py-2 border rounded-full ${selectedSize === size ? "border-primary bg-primary" : "bg-white border-gray-100"} `}
                    onPress={() => setSelectedSize(size)}
                  >
                    <Text
                      className={`text-sm font-medium ${selectedSize === size ? "text-white" : "text-primary"}`}
                    >
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
          {/* Description */}
          <Text className="text-base font-bold text-primary  mb-2">
            Description
          </Text>
          <Text className="text-secondary leading-6 mb-6">
            {product.description || "No description available."}
          </Text>
        </View>
      </ScrollView>
      {/* Footer */}
      <View className="absolute bottom-8 right-0 left-0 flex-row  p-4 bg-white border-t boder-gray-100">
        <TouchableOpacity
          onPress={handleAddToCart}
          className="w-4/5 bg-primary py-4 rounded-full items-center shadow-lg flex-row justify-center"
        >
          <Ionicons name="bag-outline" size={20} color="white" />
          <Text className="font-bold text-white text-base ml-2">
            Add to Cart
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/cart")}
          className="w-1/5 py-3 flex-row justify-center relative"
        >
          <Ionicons name="cart-outline" size={24} />
          <View className="absolute top-2 right-4 size-4 z-10 bg-black rounded-full justify-center items-center">
            <Text className="text-white text-[9px]">{itemCount}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
