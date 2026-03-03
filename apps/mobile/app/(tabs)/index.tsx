import {View, Text} from "react-native";
import {useAuth} from "../../context/AuthContext";

export default function HomeScreen() {
  const {accountType} = useAuth();

  return(
    <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
      <Text>Home Screen</Text>
      <Text>accountType: {accountType}</Text>
    </View>
  )
}