import { Button } from "@react-navigation/elements";
import { ThemedView } from "./ui/themed-view";
import { ThemedText } from "./ui/themed-text";
import { useRouter } from "expo-router";


export function GuestSettingsContent(){
  const router = useRouter();
    return(
      <ThemedView style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
        {/* <ThemedText type="title" >Settings Screen</ThemedText> */}
        <Button onPress={() => router.push("/login")}>Log In</Button>
        <Button onPress={() => router.push("/signup")}>Sign up</Button>
      </ThemedView>
    );
}