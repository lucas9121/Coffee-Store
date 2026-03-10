import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/context/AuthContext";
import { useThemeMode } from "@/context/ThemeContext";
import { Button } from "@react-navigation/elements";
import { useRouter } from "expo-router";



export default function SettingsScreen() {
  const { themeMode, setThemeMode } = useThemeMode();
  const {accountType, setAccountType} = useAuth();
  const router = useRouter();

  return(
    <ThemedView style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
      <ThemedText>Settings Screen</ThemedText>
      <Button onPress={() => router.push("./(auth)/login")}>Log In</Button>
      <ThemedText>accountType: {accountType}</ThemedText>
      <ThemedText onPress={() => setAccountType("guest")} >Set Guest</ThemedText>
      <ThemedText onPress={() => setAccountType("user")} >Set User</ThemedText>
      <ThemedText onPress={() => setAccountType("worker")} >Set Worker</ThemedText>
      
      <ThemedText>themeMode: {themeMode}</ThemedText>
      <ThemedText onPress={() => setThemeMode("system")}>Theme: System</ThemedText>
      <ThemedText onPress={() => setThemeMode("light")}>Theme: Light</ThemedText>
      <ThemedText onPress={() => setThemeMode("dark")}>Theme: Dark</ThemedText>
    </ThemedView>
  )
}