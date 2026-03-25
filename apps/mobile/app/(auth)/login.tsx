import { useState } from "react";
import { StyleSheet, Pressable } from "react-native";
import { Button } from "@react-navigation/elements";
import { useLocalSearchParams, useRouter } from "expo-router";

import { ThemedView } from "@/components/ui/themed-view";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedTextInput } from "@/components/ui/themed-text-input";
import { useAuth } from "@/context/AuthContext";
import { loginUser } from "@/services/auth-api";


export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState("");

  const params = useLocalSearchParams<{ fromCheckout?: string }>();
  const fromCheckout = params.fromCheckout === "true";


  async function handleSubmit(): Promise<void> {
    setLoginError("");
    setIsSubmitting(true);

    try {
      const data = await loginUser({ email, password });

      const accessToken = data.token;
      const refreshToken = data.refreshToken ?? null;
      const accountType = data.user.account;

      await login(accessToken, refreshToken, accountType);

      if (fromCheckout) {
        router.replace("/cart");
      } else {
        router.replace("/");
      }
    } catch (error) {
      setLoginError("Login failed. Please check your email and password.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  async function handleUserLogin() {
    await login("mock-access-token-user", "mock-refresh-token-user", "user");
    router.replace("/");
  };

  async function handleWorkerLogin() {
    await login("mock-access-token-worker", "mock-refresh-token-worker", "worker");
    router.replace("/");
  };

  return(
    <ThemedView style={styles.view} >
      <ThemedText type="title" >Login Screen</ThemedText>
      <ThemedTextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <ThemedTextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        rightAccessory={
          <Pressable
            onPressIn={() => setShowPassword(true)}
            onPressOut={() => setShowPassword(false)}
            style={styles.eyeButton}
          >
            <ThemedText>👁️</ThemedText>
          </Pressable>
        }
      />

      <Button onPress={handleSubmit}>
        {isSubmitting ? "Logging in..." : "Log in"}
      </Button>

      {loginError ? <ThemedText style={styles.errorText}>{loginError}</ThemedText> : null}

      {fromCheckout && (
        <Button onPress={() => router.push("/guest-checkout")}>
          Continue as Guest
        </Button>
      )}

      <ThemedText type="subtitle">Dev shortcuts</ThemedText>
      <Button onPress={handleUserLogin}>Log In as User</Button>
      <Button onPress={handleWorkerLogin}>Log In as Worker</Button>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  view: {
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center",
    padding: 24,
    gap: 12,
  },
  eyeButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  errorText:{
    color: "red",
  }
});