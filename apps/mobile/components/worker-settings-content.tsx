import { Button } from "@react-navigation/elements";
import { ThemedView } from "./ui/themed-view";
import { ThemedText } from "./ui/themed-text";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useThemeMode } from "@/context/ThemeContext";

type WorkerSettingsContentProps = {
  accessToken: string | null;
  borderColor: string;
}

export function WorkerSettingsContent({accessToken, borderColor}: WorkerSettingsContentProps){
  const router = useRouter();
  const {logout, accountType} = useAuth();
  const { themeMode, setThemeMode } = useThemeMode();

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