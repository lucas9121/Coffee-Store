import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/context/AuthContext";
import { useThemeMode } from "@/context/ThemeContext";
import { Button } from "@react-navigation/elements";
import { useRouter } from "expo-router";



export default function SettingsScreen() {
  const { themeMode, setThemeMode } = useThemeMode();
  const {accountType, logout} = useAuth();
  const router = useRouter();

  if(accountType === "guest"){
    return(
      <ThemedView style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
        <ThemedText type="title" >Settings Screen</ThemedText>
        <ThemedText>accountType: {accountType}</ThemedText>
        <Button onPress={() => router.push("/login")}>Log In</Button>
      </ThemedView>
    );
  };

  return(
    <ThemedView style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
      <ThemedText type="title" >Settings Screen</ThemedText>
      <ThemedText>accountType: {accountType}</ThemedText>
      <ThemedText>themeMode: {themeMode}</ThemedText>
      <ThemedText onPress={() => setThemeMode("system")}>Theme: System</ThemedText>
      <ThemedText onPress={() => setThemeMode("light")}>Theme: Light</ThemedText>
      <ThemedText onPress={() => setThemeMode("dark")}>Theme: Dark</ThemedText>
      <Button onPress={async () => {
          await logout(); 
          router.replace("/")
        }}
      >Log Out</Button>
    </ThemedView>
  );
}