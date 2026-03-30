import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import { Button } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";

export default function PasswordRecovery() {
  const router = useRouter();
  return(
    <ThemedView style={styles.view}>
      <ThemedText type="title">Forgot Password</ThemedText>
      <ThemedText>Password recovery will be added later.</ThemedText>
      <Button onPress={() => router.replace("/login")}>Login</Button>
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