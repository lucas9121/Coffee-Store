import { useState } from "react";
import { StyleSheet } from "react-native";
import { Button } from "@react-navigation/elements";
import { useRouter } from "expo-router";

import {ThemedView} from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedTextInput } from "@/components/themed-text-input";
import { useAuth } from "@/context/AuthContext";


export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  async function handleSubmit(): Promise<void> {
    console.log("Login form submitted: ", {email, password})
  }

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
        secureTextEntry
      />

      <Button onPress={handleSubmit}>Log in</Button>

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
})