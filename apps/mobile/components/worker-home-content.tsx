import { useState, useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";

import { ThemedView } from "@/components/ui/themed-view";
import { ThemedText } from "@/components/ui/themed-text";
import { Section } from "@/components/section";

import { useAuth } from "@/context/AuthContext";
import { getStoreStatus, setStoreOverride } from "@/services/store-settings";

export default function WorkerHomeScreen() {
  const { accountType, accessToken } = useAuth();
  const [isStoreOpen, setIsStoreOpen] = useState<boolean>(false);
  const [isLoadingStore, setIsLoadingStore] = useState(false);
  const [storeError, setStoreError] = useState("");

  async function loadStoreStatus(): Promise<void> {
    try {
      setIsLoadingStore(true);
      setStoreError("");
      const data = await getStoreStatus();
      setIsStoreOpen(data.isOpen);
    } catch (error) {
      console.error(error);
      setStoreError("Unable to load store status.");
    } finally {
      setIsLoadingStore(false);
    }
  }

  async function handleSetStore(status: boolean): Promise<void> {
    try {
      setStoreError("");

      // temporary manual override for 8 hours
      const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();

      await setStoreOverride(
        {status, expiresAt},
        accessToken
      );
      await loadStoreStatus();
    } catch (error) {
      console.error(error);
      setStoreError("Unable to update store status.");
    }
  }

  useEffect(() => {
    if (accountType === "worker") {
      loadStoreStatus();
    }
  }, [accountType]);

  return (
    <ThemedView style={styles.screen}>
      <ThemedText type="title">Worker Home</ThemedText>

      <Section title="Store Status">
        {isLoadingStore ? (
          <ThemedText>Loading store status...</ThemedText>
        ) : (
          <ThemedText>{isStoreOpen ? "Open" : "Closed"}</ThemedText>
        )}

        {storeError ? (
          <ThemedText style={styles.errorText}>{storeError}</ThemedText>
        ) : null}

        <ThemedView style={styles.buttonRow}>
          <Pressable
            style={styles.actionButton}
            onPress={() => handleSetStore(true)}
          >
            <ThemedText>Open Store</ThemedText>
          </Pressable>

          <Pressable
            style={styles.actionButton}
            onPress={() => handleSetStore(false)}
          >
            <ThemedText>Close Store</ThemedText>
          </Pressable>
        </ThemedView>
      </Section>

      <Section title="In-Person Orders">
        <ThemedText>In-person order creation will go here next.</ThemedText>
      </Section>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 24,
    gap: 24,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
  errorText: {
    color: "#ff6b6b",
  },
});