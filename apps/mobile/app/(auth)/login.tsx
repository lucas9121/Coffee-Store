import {ThemedView} from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";


export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  async function handleUserLogin() {
    await login("mock-accesss-teoken-user", "mock-refresh-token-user", "user");
    router.replace("/(tabs)");
  };

  async function handleWorkerLogin() {
    await login("mock-accesss-teoken-user", "mock-refresh-token-user", "worker");
    router.replace("/(tabs)");
  };

  return(
    <ThemedView style={{flex: 1, alignItems: "center", justifyContent: "center"}} >
      <ThemedText>Login Screen</ThemedText>
      <Button onPress={handleUserLogin}>Log In as User</Button>
      <Button onPress={handleWorkerLogin}>Log In as Worker</Button>
    </ThemedView>
  )
}