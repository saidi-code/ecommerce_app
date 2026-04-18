import { useAuth, useSignUp } from "@clerk/expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { type Href, Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Page() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const handleSubmit = async () => {
    const { error } = await signUp.password({
      emailAddress,
      password,
      firstName,
      lastName,
    });
    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    if (!error) await signUp.verifications.sendEmailCode();
  };

  const handleVerify = async () => {
    await signUp.verifications.verifyEmailCode({
      code,
    });
    if (signUp.status === "complete") {
      await signUp.finalize({
        // Redirect the user to the home page after signing up
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
      // Check why the sign-up is not complete
      console.error("Sign-up attempt not complete:", signUp);
    }
  };

  if (signUp.status === "complete" || isSignedIn) {
    return null;
  }

  return signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0 ? (
    <SafeAreaView className="flex-1 bg-white" style={{ padding: 28 }}>
      <View className="flex-row  items-center mb-8">
        <TouchableOpacity onPress={() => router.push("/")}>
          <View className="rounded-full flex-row items-center shadow-sm bg-primary px-4 py-2 ">
            <Ionicons name="arrow-back-circle" size={24} color="#fff" />
            <Text className="text-lg font-bold ml-1 text-white ">Back</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View className="justify-center items-center mb-6  ">
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
        onPress={() => signUp.verifications.sendEmailCode()}
      >
        <Text style={styles.secondaryButtonText}>I need a new code</Text>
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
      <View className="justify-center items-center ">
        <View className="items-center mb-2">
          <Text className="text-3xl font-bold text-primary">
            Create Account
          </Text>
          <Text className="text-secondary mb-2 ">Sign up to get started</Text>
        </View>
        <Image
          source={require("@/assets/images/logo.png")}
          style={{ width: "100%", height: 18, marginBottom: 8 }}
          resizeMode="contain"
        />
      </View>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      >
        <View className="items-center mb-8">
          {/* <Text className="text-3xl font-bold text-primary mb-2">
            Create Account
          </Text> */}
          {/* <Text className="text-secondary mb-8">Sign up to get started</Text> */}
        </View>
        <View className="">
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            placeholder="John"
            placeholderTextColor="#666666"
            onChangeText={(firstName) => setFirstName(firstName)}
          />
          {errors.fields.firstName && (
            <Text className="text-xs text-accent mt-1">
              {errors.fields.firstName.message}
            </Text>
          )}
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            placeholder="Doe"
            placeholderTextColor="#666666"
            onChangeText={(lastName) => setLastName(lastName)}
          />
          {errors.fields.lastName && (
            <Text className="text-xs text-accent mt-1">
              {errors.fields.lastName.message}
            </Text>
          )}
          <Text style={styles.label}>Email address</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            value={emailAddress}
            placeholder="user@example.com"
            placeholderTextColor="#666666"
            onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
            keyboardType="email-address"
          />
          {errors.fields.emailAddress && (
            <Text className="text-xs text-accent mt-1">
              {errors.fields.emailAddress.message}
            </Text>
          )}
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            placeholder="********"
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
            onPress={handleSubmit}
            disabled={!emailAddress || !password || fetchStatus === "fetching"}
          >
            {fetchStatus === "fetching" ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign up</Text>
            )}
          </TouchableOpacity>
          {/* For your debugging purposes. You can just console.log errors, but we put them in the UI for convenience */}
          {/* {errors && (
        <Text style={styles.debug}>{JSON.stringify(errors, null, 2)}</Text>
      )} */}

          <View style={styles.linkContainer}>
            <Text>Already have an account? </Text>
            <Link href="/sign-in">
              <Text>Sign in</Text>
            </Link>
          </View>

          {/* Required for sign-up flows. Clerk's bot sign-up protection is enabled by default */}
          <View nativeID="clerk-captcha" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
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
    marginBottom: 4,
  },
  button: {
    backgroundColor: "#0a7ea4",
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
// import { useState } from "react";
// import { Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import Toast from 'react-native-toast-message';
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter, Link } from "expo-router";
// import { useSignUp } from "@clerk/clerk-expo";
// import { COLORS } from "@/constants";

// export default function SignUpScreen() {
//     const { isLoaded, signUp, setActive } = useSignUp();
//     const router = useRouter();

//     const [emailAddress, setEmailAddress] = useState("");
//     const [password, setPassword] = useState("");
//     const [firstName, setFirstName] = useState("");
//     const [lastName, setLastName] = useState("");
//     const [code, setCode] = useState("");
//     const [pendingVerification, setPendingVerification] = useState(false);
//     const [loading, setLoading] = useState(false);

//     const onSignUpPress = async () => {
//         if (!isLoaded) return;

//         if (!emailAddress || !password) {
//             Toast.show({
//                 type: 'error',
//                 text1: 'Missing Fields',
//                 text2: 'Please fill in all fields'
//             });
//             return;
//         }

//         setLoading(true);
//         try {
//             await signUp.create({
//                 emailAddress,
//                 password,
//                 firstName,
//                 lastName,
//             });

//             await signUp.prepareEmailAddressVerification({
//                 strategy: "email_code",
//             });

//             setPendingVerification(true);
//         } catch (err: any) {
//             Toast.show({
//                 type: 'error',
//                 text1: 'Failed to Sign Up',
//                 text2: err?.errors?.[0]?.message ?? "Something went wrong"
//             });
//         } finally {
//             setLoading(false);
//         }
//     };

//     const onVerifyPress = async () => {
//         if (!isLoaded) return;

//         if (!code) {
//             Toast.show({
//                 type: 'error',
//                 text1: 'Missing Fields',
//                 text2: 'Enter verification code'
//             });
//             return;
//         }

//         setLoading(true);
//         try {
//             const attempt = await signUp.attemptEmailAddressVerification({ code });

//             if (attempt.status === "complete") {
//                 await setActive({ session: attempt.createdSessionId });
//                 router.replace("/");
//             } else {
//                 Toast.show({
//                     type: 'error',
//                     text1: 'Verification incomplete'
//                 });
//             }
//         } catch (err: any) {
//             Toast.show({
//                 type: 'error',
//                 text1: 'Failed to Verify',
//                 text2: err?.errors?.[0]?.message ?? "Invalid code"
//             });
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <SafeAreaView className="flex-1 bg-white justify-center" style={{ padding: 28 }}>
//             {!pendingVerification ? (
//                 <>
//                     <TouchableOpacity onPress={() => router.push("/")} className="absolute top-12 z-10">
//                         <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
//                     </TouchableOpacity>

//                     {/* Header */}
//                     <View className="items-center mb-8">
//                         <Text className="text-3xl font-bold text-primary mb-2">Create Account</Text>
//                         <Text className="text-secondary">Sign up to get started</Text>
//                     </View>

//                     {/* First Name */}
//                     <View className="mb-4">
//                         <Text className="text-primary font-medium mb-2">First Name</Text>
//                         <TextInput className="w-full bg-surface p-4 rounded-xl text-primary" placeholder="John" placeholderTextColor="#999" value={firstName} onChangeText={setFirstName} />
//                     </View>

//                     {/* Last Name */}
//                     <View className="mb-6">
//                         <Text className="text-primary font-medium mb-2">Last Name</Text>
//                         <TextInput className="w-full bg-surface p-4 rounded-xl text-primary" placeholder="Doe" placeholderTextColor="#999" value={lastName} onChangeText={setLastName} />
//                     </View>

//                     {/* Email */}
//                     <View className="mb-4">
//                         <Text className="text-primary font-medium mb-2">Email</Text>
//                         <TextInput className="w-full bg-surface p-4 rounded-xl text-primary" placeholder="user@example.com" placeholderTextColor="#999" autoCapitalize="none" keyboardType="email-address" value={emailAddress} onChangeText={setEmailAddress} />
//                     </View>

//                     {/* Password */}
//                     <View className="mb-6">
//                         <Text className="text-primary font-medium mb-2">Password</Text>
//                         <TextInput className="w-full bg-surface p-4 rounded-xl text-primary" placeholder="********" placeholderTextColor="#999" secureTextEntry value={password} onChangeText={setPassword} />
//                     </View>

//                     {/* Submit */}
//                     <TouchableOpacity className="w-full bg-primary py-4 rounded-full items-center mb-10" onPress={onSignUpPress} disabled={loading}>
//                         {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-lg">Continue</Text>}
//                     </TouchableOpacity>

//                     {/* Footer */}
//                     <View className="flex-row justify-center">
//                         <Text className="text-secondary">Already have an account? </Text>
//                         <Link href="/sign-in">
//                             <Text className="text-primary font-bold">Login</Text>
//                         </Link>
//                     </View>
//                 </>
//             ) : (
//                 <>
//                     <TouchableOpacity onPress={() => router.back()} className="absolute top-12 z-10">
//                         <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
//                     </TouchableOpacity>

//                     {/* Verification */}
//                     <View className="items-center mb-8">
//                         <Text className="text-3xl font-bold text-primary mb-2">Verify Email</Text>
//                         <Text className="text-secondary text-center">Enter the code sent to your email</Text>
//                     </View>

//                     <View className="mb-6">
//                         <TextInput className="w-full bg-surface p-4 rounded-xl text-primary text-center tracking-widest" placeholder="123456" placeholderTextColor="#999" keyboardType="number-pad" value={code} onChangeText={setCode} />
//                     </View>

//                     <TouchableOpacity className="w-full bg-primary py-4 rounded-full items-center" onPress={onVerifyPress} disabled={loading}>
//                         {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-lg">Verify</Text>}
//                     </TouchableOpacity>
//                 </>
//             )}
//         </SafeAreaView>
//     );
// }
