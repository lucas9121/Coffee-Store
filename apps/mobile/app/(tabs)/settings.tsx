import {View, Text} from "react-native";
import { useAuth } from "@/context/AuthContext";

export default function SettingsScreen() {
  const {accountType, setAccountType} = useAuth();

  return(
    <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
      <Text>Settings Screen</Text>
      <Text>accountType: {accountType}</Text>
      <Text onPress={() => setAccountType("guest")} >Set Guest</Text>
      <Text onPress={() => setAccountType("user")} >Set User</Text>
      <Text onPress={() => setAccountType("worker")} >Set Worker</Text>
    </View>
  )
}