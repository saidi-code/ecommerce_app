import { COLORS } from "@/constants";
import { HeaderProps } from "@/constants/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useCart } from "../context/CartContext";
export default function Header({
  title,
  showBack,
  showSearch,
  showCart,
  showLogo,
  showMenu,
}: HeaderProps) {
  const router = useRouter();
  const { itemCount } = useCart();
  return (
    <View className=" flex flex-row  items-center justify-between px-2 py-5 bg-white shadow">
      {/* left side */}
      <View className="flex flex-row  items-start justify-start flex-1 ">
        {showBack && (
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        )}
        {/* {showMenu && (
          <TouchableOpacity
            onPress={() => console.log("menu opened")}
            className="mr-3"
          >
            <Ionicons name="menu-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        )} */}
        {showLogo ? (
          <View className="flex-1">
            <Image
              source={require("../assets/images/logo.png")}
              style={{ width: 100, height: 24 }}
              resizeMode="cover"
            />
          </View>
        ) : (
          title && (
            <Text className="text-xl font-bold text-primary text-center flex-1 mr-8">
              {title}
            </Text>
          )
        )}
        {!title && !showSearch && <View className="flex-1" />}
      </View>

      {/* right side */}
      <View className="flex-row items-center gap-3 ">
        {showSearch && (
          <TouchableOpacity
            onPress={() => router.push("/search")}
            className="mr-3"
          >
            <Ionicons name="search-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        )}
        {showCart && (
          <TouchableOpacity
            onPress={() => router.push("/cart")}
            className="mr-3"
          >
            <View className="relative">
              <Ionicons name="bag-outline" size={24} color={COLORS.primary} />
              <View className="absolute -top-2 -right-2 bg-accent rounded-full w-5 h-5 items-center justify-center z-10">
                <Text className="text-white text-[10px]  font-bold">
                  {itemCount}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
