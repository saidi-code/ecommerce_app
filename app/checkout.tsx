import { dummyAddress } from "@/assets/assets";
import Header from "@/components/Header";
import { COLORS } from "@/constants";
import { Address } from "@/constants/types";
import { useCart } from "@/context/CartContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
export default function Checkout() {
  const { cartTotal } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<
    "cash_on_delivery" | "stripe"
  >("cash_on_delivery");
  const shipping = 2.0;
  const tax = 0;
  const total = cartTotal + shipping + tax;

  const fetchAddress = async () => {
    const addressList = dummyAddress;
    if (addressList.length > 0) {
      // Find default or first address
      const def = addressList.find((a: any) => a.isDefault) || addressList[0];
      setSelectedAddress(def as Address);
    }
    setPageLoading(false);
  };
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please select a shipping address.",
      });
      return;
    }
    if (paymentMethod === "stripe") {
      return Toast.show({
        type: "error",
        text1: "Info",
        text2: "Stripe payment is not avaible in your country.",
      });
    }
    //cash on delivery
    router.replace("/orders");
  };
  useEffect(() => {
    fetchAddress();
  }, []);
  if (pageLoading) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center bg-surface"
        edges={["top"]}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <Header title="Checkout" showBack />
      <ScrollView className="flex-1 px-4 mt-4">
        <Text className="text-lg font-bold text-primary mb-4">
          Shipping Adress
        </Text>

        {selectedAddress ? (
          <View className="bg-white p-4 rounded-xl mb-6 shadow-sm">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-base font-bold">
                {selectedAddress.type}
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/addresses")}
                className=""
              >
                <Text className="text-accent text-sm">Change</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-secondary leading-5 ">
              {selectedAddress.street}, {selectedAddress.city}, {"\n"}
              {selectedAddress.state}, {selectedAddress.zipCode}
              {"\n"}
              {selectedAddress.country}
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => router.push("/addresses")}
            className="bg-white p-6 mb-6 rounded-xl shadow-sm items-center justify-center border-dashed border-2 "
          >
            Add a shipping address to place your order
          </TouchableOpacity>
        )}
        {/* Payment section  */}
        <Text className=" text-lg font-bold text-primary mb-4">
          Payment Method
        </Text>
        {/* Cash on delivery option */}
        <TouchableOpacity
          onpress={() => setPaymentMethod("cash_on_delivery")}
          className={`bg-white p-4 shadow-sm rounded-xl mb-4 flex-row items-center border-2 ${paymentMethod === "cash_on_delivery" ? "border-primary" : "border-transparent"}`}
          onPress={() => setPaymentMethod("cash_on_delivery")}
        >
          <Ionicons
            name="cash-outline"
            size={24}
            color={COLORS.primary}
            className="mr-3"
          />
          <View className="ml-3 flex-1">
            <Text className="text-base font-bold text-primary">
              Cash on Delivery
            </Text>
            <Text className="text-secondary text-xs mt-1">
              Pay when you receive the order
            </Text>
          </View>
          {paymentMethod === "cash_on_delivery" && (
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={COLORS.primary}
            />
          )}
        </TouchableOpacity>
        {/* Stripe option (disabled) */}
        <TouchableOpacity
          onpress={() => setPaymentMethod("stripe")}
          className={`bg-white p-4 shadow-sm rounded-xl mb-4 flex-row items-center border-2 ${paymentMethod === "stripe" ? "border-primary" : "border-transparent"}`}
          onPress={() => setPaymentMethod("stripe")}
        >
          <Ionicons
            name="card-outline"
            size={24}
            color={COLORS.primary}
            className="mr-3"
          />
          <View className="ml-3 flex-1">
            <Text className="text-base font-bold text-primary">
              Pay with Card
            </Text>
            <Text className="text-secondary text-xs mt-1">
              Credit or Debit Card
            </Text>
          </View>
          {paymentMethod === "stripe" && (
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={COLORS.primary}
            />
          )}
        </TouchableOpacity>
      </ScrollView>
      {/* order summary */}
      <View className="bg-white p-4 shadow-lg border-t border-gray-100">
        <Text className=" text-lg font-bold text-primary mb-4">
          Order Summary
        </Text>
        {/* Subtotal */}
        <View className="flex-row  justify-between mb-2">
          <Text className="text-secondary">Subtotal</Text>
          <Text className="font-bold">${cartTotal.toFixed(2)}</Text>
        </View>
        {/* Shipping */}
        <View className="flex-row  justify-between mb-2">
          <Text className="text-secondary">Shipping</Text>
          <Text className="font-bold">${shipping.toFixed(2)}</Text>
        </View>
        {/* Tax */}
        <View className="flex-row  justify-between mb-4">
          <Text className="text-secondary">Tax</Text>
          <Text className="font-bold">${tax.toFixed(2)}</Text>
        </View>

        {/* Total */}
        <View className="flex-row  justify-between mb-6">
          <Text className="text-primary font-bold text-xl">Total</Text>
          <Text className="text-primary font-bold text-xl">
            ${total.toFixed(2)}
          </Text>
        </View>
        {/* Place Order Button */}
        <TouchableOpacity
          className={`p-4 rounded-xl items-center bg-primary ${loading ? "opacity-70" : "opacity-100"}`}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-white font-bold text-lg">Place Order</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
