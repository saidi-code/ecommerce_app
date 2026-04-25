import { ProductCardProps } from "@/constants/types";
import { useWishList } from "@/context/WishListContext";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../constants";
export default function ProductCard({ product }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishList();
  const isLiked = isInWishlist(product._id);
  return (
    <Link href={`/product/${product._id}`} asChild>
      <TouchableOpacity className="w-[48%] bg-white rounded-lg overflow-hidden mb-4">
        <View className="relative h-56 w-full bg-gray-100">
          <Image
            source={{ uri: product?.images[0] ?? "" }}
            className="w-full h-full"
            resizeMode="cover"
          />
          {/* Favorite Icon */}
          <TouchableOpacity
            className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white shadow-sm"
            onPress={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
          >
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={20}
              color={isLiked ? COLORS.accent : COLORS.primary}
            />
          </TouchableOpacity>
          {/* is Featured  */}
          {product.isFeatured && (
            <View className="absolute top-2 left-2 z-10 px-2 py-1 bg-black rounded">
              <Text className="text-white text-xs font-bold">Featured</Text>
            </View>
          )}
        </View>
        {/* Product Info  */}
        <View className="p-3">
          <View className="flex-row items-center">
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text className="text-xs text-secondary ml-1">
              {product?.ratings?.average.toFixed(1)}
            </Text>
          </View>
          <Text
            className="text-sm font-medium text-primary  mb-1 "
            numberOfLines={1}
          >
            {product?.name}
          </Text>
          <View>
            <Text className=" font-bold text-primary text-base">
              ${product?.price.toFixed(2)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
}
