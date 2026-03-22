import { useState } from "react";
import { StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";

import { ThemedView } from "@/components/ui/themed-view";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedTextInput } from "@/components/ui/themed-text-input";

export default function GuestCheckoutScreen() {
  const router = useRouter();
  const [guestName, setGuestName] = useState("");

  function handleContinue() {
    // Do nothing if the guest didn't type a name
    if (!guestName.trim()) return;

    // Send the name back to the cart modal
    router.replace({
      pathname: "/cart",
      params: { guestName: guestName.trim() },
    });
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Guest Checkout</ThemedText>
      <ThemedText>Enter your name for the order</ThemedText>

      <ThemedTextInput
        placeholder="Your name"
        value={guestName}
        onChangeText={setGuestName}
      />

      <Pressable style={styles.button} onPress={handleContinue}>
        <ThemedText>Continue</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    gap: 12,
  },
  button: {
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
});