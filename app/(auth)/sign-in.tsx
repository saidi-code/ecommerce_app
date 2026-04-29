// @ts-ignore - Clerk types are not fully compatible with this version
import { useAuth, useSignIn } from "@clerk/expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, useRouter } from "expo-router";
import * as React from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type SignInResource = any;
type AuthResult = any;

export default function Page() {
  // @ts-ignore
  const { isLoaded, setActive, signOut } = useAuth() as AuthResult;
  // @ts-ignore
  const { signIn } = useSignIn() as { signIn: SignInResource | null };
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [showEmailCode, setShowEmailCode] = React.useState(false);

  const onSignInPress = async () => {
    if (!isLoaded || !signIn || !emailAddress || !password) return;

    setLoading(true);
    try {
      const signInAttempt: any = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else if (signInAttempt.status === "needs_second_factor") {
        const emailCodeFactor = signInAttempt.supportedSecondFactors?.find(
          (factor: any) => factor.strategy === "email_code",
        );
        if (emailCodeFactor) {
          await signIn.prepareSecondFactor({
            strategy: "email_code",
            emailAddressId: emailCodeFactor.emailAddressId,
          });
          setShowEmailCode(true);
        }
      }
    } catch (err) {
      console.error("Sign-in error:", JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded || !signIn || !code) return;

    setLoading(true);
    try {
      const attempt: any = await signIn.attemptSecondFactor({
        strategy: "email_code",
        code,
      });

      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });
        router.replace("/");
      }
    } catch (err) {
      console.error("Verify error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" style={{ padding: 28 }}>
      {!showEmailCode ? (
        <>
          {/* Header */}
          <View className="flex flex-row items-center justify-between border-b border-slate-200 pb-2 bg-white">
            <View className="flex flex-row items-center">
              <TouchableOpacity onPress={() => router.push("/")}>
                <View className="rounded-full flex-row items-center shadow-sm bg-primary px-4 py-2">
                  <Ionicons name="arrow-back-circle" size={24} color="#fff" />
                  <Text className="text-lg font-bold ml-1 text-white">
                    Back
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <Text className="text-xl font-bold text-primary text-center flex-1 mr-8">
              Sign in
            </Text>
          </View>

          {/* Content */}
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View className="justify-center items-center my-16">
              <Image
                source={require("@/assets/images/logo.png")}
                style={{ width: "100%", height: 42, marginBottom: 8 }}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.label}>Email address</Text>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Enter email"
              placeholderTextColor="#666666"
              onChangeText={setEmailAddress}
              keyboardType="email-address"
            />

            <Text style={styles.label}>Password</Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                backgroundColor: "#fff",
                marginBottom: 16,
                paddingHorizontal: 12,
                paddingVertical: 3,
              }}
              className="flex-row items-center justify-between relative"
            >
              <TextInput
                className="flex-1 text-primary text-[16px]"
                value={password}
                placeholder="Enter password"
                placeholderTextColor="#666666"
                secureTextEntry={!showPassword}
                onChangeText={setPassword}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#666666"
                  className="mr-3"
                />
              </Pressable>
            </View>

            <TouchableOpacity
              className={`bg-primary mt-6 w-full py-3 rounded-full items-center shadow-lg ${
                !emailAddress || !password ? "opacity-50" : "opacity-100"
              }`}
              onPress={onSignInPress}
              disabled={!emailAddress || !password}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold text-lg">Sign In</Text>
              )}
            </TouchableOpacity>

            <View className="flex-row justify-start mt-2">
              <Text className="text-sm font-medium text-secondary">
                Don&apos;t have an account?{" "}
              </Text>
              <Link href="/sign-up">
                <Text className="text-sm font-medium text-blue-400 underline">
                  Sign up
                </Text>
              </Link>
            </View>
          </ScrollView>
        </>
      ) : (
        <>
          {/* Verification */}
          <View className="items-center mb-8 mt-16">
            <Text className="text-3xl font-bold text-primary mb-2">
              Verify Email
            </Text>
            <Text className="text-secondary text-center">
              Enter the code sent to your email
            </Text>
          </View>

          <TextInput
            style={styles.input}
            className="text-center tracking-widest"
            placeholder="123456"
            placeholderTextColor="#999"
            keyboardType="number-pad"
            value={code}
            onChangeText={setCode}
          />

          <TouchableOpacity
            className={`bg-primary mt-6 w-full py-3 rounded-full items-center shadow-lg ${
              loading ? "opacity-50" : "opacity-100"
            }`}
            onPress={onVerifyPress}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-lg">Verify</Text>
            )}
          </TouchableOpacity>

          <Pressable
            className="mt-4 items-center"
            onPress={() => setShowEmailCode(false)}
          >
            <Text className="text-primary">Back to sign in</Text>
          </Pressable>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  label: {
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 16,
  },
});
