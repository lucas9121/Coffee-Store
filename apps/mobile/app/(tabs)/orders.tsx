import {View, Text} from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function OrdersScreen() {
  const {accountType} = useAuth();

  return(
    <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
      <Text>{accountType === "worker" ? "Worker Orders" : "Order Menu"}</Text>
      <Text>accountType: {accountType}</Text>
    </View>
  )
}