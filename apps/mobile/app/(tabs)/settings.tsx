import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/context/AuthContext";

export default function SettingsScreen() {
  const {accountType, setAccountType} = useAuth();

  return(
    <ThemedView style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
      <ThemedText>Settings Screen</ThemedText>
      <ThemedText>accountType: {accountType}</ThemedText>
      <ThemedText onPress={() => setAccountType("guest")} >Set Guest</ThemedText>
      <ThemedText onPress={() => setAccountType("user")} >Set User</ThemedText>
      <ThemedText onPress={() => setAccountType("worker")} >Set Worker</ThemedText>
    </ThemedView>
  )
}