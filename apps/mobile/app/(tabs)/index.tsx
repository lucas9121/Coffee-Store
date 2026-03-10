import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import {useAuth} from "../../context/AuthContext";

export default function HomeScreen() {
  const {accountType} = useAuth();

  const title = accountType === "worker" ? 
    "Worker Home " 
    : "Home (Default)";

  const subtitle = accountType === "worker" ?
    "This will become: In-Person Order screen + Open/Close store toggle"
    : "This will become: announcements / store status / quick actions";

  return(
    <ThemedView style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
      <ThemedText type="title">{title}</ThemedText>
      <ThemedText type="subtitle">{subtitle}</ThemedText>
      <ThemedText>accountType: {accountType}</ThemedText>
    </ThemedView>
  )
}