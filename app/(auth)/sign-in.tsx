import { useSignIn } from "@clerk/expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { type Href, Link, useRouter } from "expo-router";
import React from "react";
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

export default function Page() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");

  const handleSubmit = async () => {
    const { error } = await signIn.password({
      emailAddress,
      password,
    });
    if (error) {
      // console.error(JSON.stringify(error, null, 2));
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            // Handle pending session tasks
            // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
            console.log(session?.currentTask);
            return;
          }

          const url = decorateUrl("/");
          if (url.startsWith("http")) {
            window.location.href = url;
          } else {
            router.push(url as Href);
          }
        },
      });
    } else if (signIn.status === "needs_second_factor") {
      // See https://clerk.com/docs/guides/development/custom-flows/authentication/multi-factor-authentication
    } else if (signIn.status === "needs_client_trust") {
      // For other second factor strategies,
      // see https://clerk.com/docs/guides/development/custom-flows/authentication/client-trust
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code",
      );

      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
      }
    } else {
      // Check why the sign-in is not complete
      console.error("Sign-in attempt not complete:", signIn);
    }
  };

  const handleVerify = async () => {
    await signIn.mfa.verifyEmailCode({ code });

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            // Handle pending session tasks
            // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
            console.log(session?.currentTask);
            return;
          }

          const url = decorateUrl("/");
          if (url.startsWith("http")) {
            window.location.href = url;
          } else {
            router.push(url as Href);
          }
        },
      });
    } else {
      // Check why the sign-in is not complete
      console.error("Sign-in attempt not complete:", signIn);
    }
  };

  {
    return signIn.status === "needs_client_trust" ? (
      <SafeAreaView className="flex-1 bg-white" style={{ padding: 28 }}>
        <View className="flex-row  items-center mb-8">
          <TouchableOpacity onPress={() => router.push("/")}>
            <View className="rounded-full flex-row items-center shadow-sm bg-primary px-4 py-2 ">
              <Ionicons name="arrow-back-circle" size={24} color="#fff" />
              <Text className="text-lg font-bold ml-1 text-white ">Back</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View className="justify-center items-center mb-6 ">
          <View className="items-center mb-2">
            <Text className="text-3xl font-bold text-primary">
              Verify your account
            </Text>
          </View>
          <Image
            source={require("@/assets/images/logo.png")}
            style={{ width: "100%", height: 18, marginBottom: 8 }}
            resizeMode="contain"
          />
        </View>

        <TextInput
          style={styles.input}
          value={code}
          placeholder="Enter your verification code"
          placeholderTextColor="#666666"
          onChangeText={(code) => setCode(code)}
          keyboardType="numeric"
        />
        {errors.fields.code && (
          <Text className="text-xs text-accent mt-1">
            {errors.fields.code.message}
          </Text>
        )}
        <TouchableOpacity
          className={`bg-primary mt-8 w-full py-3 rounded-full items-center shadow-lg ${fetchStatus === "fetching" ? "opacity-50" : "opacity-100"}`}
          onPress={handleVerify}
          disabled={fetchStatus === "fetching"}
        >
          {fetchStatus === "fetching" ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Verify</Text>
          )}
        </TouchableOpacity>
        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => signIn.mfa.sendEmailCode()}
        >
          <Text style={styles.secondaryButtonText}>I need a new code</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => signIn.reset()}
        >
          <Text style={styles.secondaryButtonText}>Start over</Text>
        </Pressable>
      </SafeAreaView>
    ) : (
      <SafeAreaView className="flex-1 bg-white" style={{ padding: 28 }}>
        {/* Header */}
        <View className="flex-row  items-center mb-8">
          <TouchableOpacity onPress={() => router.push("/")}>
            <View className="rounded-full flex-row items-center shadow-sm bg-primary px-4 py-2 ">
              <Ionicons name="arrow-back-circle" size={24} color="#fff" />
              <Text className="text-lg font-bold ml-1 text-white ">Back</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        >
          <View className="justify-center items-center mb-8 ">
            <View className="items-center mb-2">
              <Text className="text-3xl font-bold text-primary">
                Welcome Back
              </Text>
              <Text className="text-secondary mb-2 ">Sign in to continue</Text>
            </View>
            <Image
              source={require("@/assets/images/logo.png")}
              style={{ width: "100%", height: 18, marginBottom: 8 }}
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
            onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
            keyboardType="email-address"
          />
          {errors.fields.identifier && (
            <Text className="text-xs text-accent mt-1">
              {errors.fields.identifier.message}
            </Text>
          )}
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            placeholder="Enter password"
            placeholderTextColor="#666666"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
          {errors.fields.password && (
            <Text className="text-xs text-accent mt-1">
              {errors.fields.password.message}
            </Text>
          )}
          <TouchableOpacity
            className={`bg-primary mt-8 w-full py-3 rounded-full items-center shadow-lg ${fetchStatus === "fetching" || !emailAddress || !password ? "opacity-50" : "opacity-100"}`}
            disabled={!emailAddress || !password || fetchStatus === "fetching"}
            onPress={handleSubmit}
          >
            {fetchStatus === "fetching" ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-lg">Sign In</Text>
            )}
          </TouchableOpacity>
          {/* For your debugging purposes. You can just console.log errors, but we put them in the UI for convenience */}
          {/* {errors && (
            <Text style={styles.debug}>{JSON.stringify(errors, null, 2)}</Text>
          )} */}

          <View style={styles.linkContainer}>
            <Text>Don&apos;t have an account? </Text>

            <Link href="/sign-up">
              <Text>Sign up</Text>
            </Link>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
  },
  title: {
    marginBottom: 8,
  },
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
  button: {
    backgroundColor: "Black",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  secondaryButtonText: {
    color: "#0a7ea4",
    fontWeight: "600",
  },
  linkContainer: {
    flexDirection: "row",
    gap: 4,
    marginTop: 12,
    alignItems: "center",
  },
  error: {
    color: "#d32f2f",
    fontSize: 12,
    marginTop: -8,
  },
  debug: {
    fontSize: 10,
    opacity: 0.5,
    marginTop: 8,
  },
});

// import { COLORS } from "@/constants";
// import { useSignIn } from "@clerk/clerk-expo";
// import type { EmailCodeFactor } from "@clerk/types";
// import { Ionicons } from "@expo/vector-icons";
// import { Link, useRouter } from "expo-router";
// import * as React from "react";
// import {
//     ActivityIndicator,
//     Pressable,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// export default function Page() {
//   const { signIn, setActive, isLoaded } = useSignIn();
//   const router = useRouter();

//   const [emailAddress, setEmailAddress] = React.useState("");
//   const [password, setPassword] = React.useState("");
//   const [code, setCode] = React.useState("");
//   const [showEmailCode, setShowEmailCode] = React.useState(false);
//   const [loading, setLoading] = React.useState(false);

//   const onSignInPress = async () => {
//     if (!isLoaded) return;
//     if (!emailAddress || !password) return;

//     setLoading(true);

//     try {
//       const signInAttempt = await signIn.create({
//         identifier: emailAddress,
//         password,
//       });

//       if (signInAttempt.status === "complete") {
//         await setActive({
//           session: signInAttempt.createdSessionId,
//         });
//         router.replace("/");
//       } else if (signInAttempt.status === "needs_second_factor") {
//         const emailCodeFactor = signInAttempt.supportedSecondFactors?.find(
//           (factor): factor is EmailCodeFactor =>
//             factor.strategy === "email_code",
//         );

//         if (emailCodeFactor) {
//           await signIn.prepareSecondFactor({
//             strategy: "email_code",
//             emailAddressId: emailCodeFactor.emailAddressId,
//           });
//           setShowEmailCode(true);
//         }
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onVerifyPress = async () => {
//     if (!isLoaded || !code) return;

//     setLoading(true);
//     try {
//       const attempt = await signIn.attemptSecondFactor({
//         strategy: "email_code",
//         code,
//       });

//       if (attempt.status === "complete") {
//         await setActive({
//           session: attempt.createdSessionId,
//         });
//         router.replace("/");
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <SafeAreaView
//       className="flex-1 bg-white justify-center"
//       style={{ padding: 28 }}
//     >
//       {!showEmailCode ? (
//         <>
//           <TouchableOpacity
//             onPress={() => router.push("/")}
//             className="absolute top-12 z-10"
//           >
//             <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
//           </TouchableOpacity>

//           {/* Header */}
//           <View className="items-center mb-8">
//             <Text className="text-3xl font-bold text-primary mb-2">
//               Welcome Back
//             </Text>
//             <Text className="text-secondary">Sign in to continue</Text>
//           </View>

//           {/* Email */}
//           <View className="mb-4">
//             <Text className="text-primary font-medium mb-2">Email</Text>
//             <TextInput
//               className="w-full bg-surface p-4 rounded-xl text-primary"
//               placeholder="user@example.com"
//               placeholderTextColor="#999"
//               autoCapitalize="none"
//               keyboardType="email-address"
//               value={emailAddress}
//               onChangeText={setEmailAddress}
//             />
//           </View>

//           {/* Password */}
//           <View className="mb-6">
//             <Text className="text-primary font-medium mb-2">Password</Text>
//             <TextInput
//               className="w-full bg-surface p-4 rounded-xl text-primary"
//               placeholder="********"
//               placeholderTextColor="#999"
//               secureTextEntry
//               value={password}
//               onChangeText={setPassword}
//             />
//           </View>

//           {/* Submit */}
//           <Pressable
//             className={`w-full py-4 rounded-full items-center mb-10 ${loading || !emailAddress || !password ? "bg-gray-300" : "bg-primary"}`}
//             onPress={onSignInPress}
//             disabled={loading || !emailAddress || !password}
//           >
//             {loading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <Text className="text-white font-bold text-lg">Sign In</Text>
//             )}
//           </Pressable>

//           {/* Footer */}
//           <View className="flex-row justify-center">
//             <Text className="text-secondary">Don&apos;t have an account? </Text>
//             <Link href="/sign-up">
//               <Text className="text-primary font-bold">Sign up</Text>
//             </Link>
//           </View>
//         </>
//       ) : (
//         <>
//           {/* Verification */}
//           <View className="items-center mb-8">
//             <Text className="text-3xl font-bold text-primary mb-2">
//               Verify Email
//             </Text>
//             <Text className="text-secondary text-center">
//               Enter the code sent to your email
//             </Text>
//           </View>

//           <View className="mb-6">
//             <TextInput
//               className="w-full bg-surface p-4 rounded-xl text-primary text-center tracking-widest"
//               placeholder="123456"
//               placeholderTextColor="#999"
//               keyboardType="number-pad"
//               value={code}
//               onChangeText={setCode}
//             />
//           </View>

//           <Pressable
//             className="w-full bg-primary py-4 rounded-full items-center"
//             onPress={onVerifyPress}
//             disabled={loading}
//           >
//             {loading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <Text className="text-white font-bold text-lg">Verify</Text>
//             )}
//           </Pressable>
//         </>
//       )}
//     </SafeAreaView>
//   );
// }
