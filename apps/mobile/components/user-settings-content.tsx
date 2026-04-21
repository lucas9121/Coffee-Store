import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { Button } from "@react-navigation/elements";
import { ThemedView } from "./ui/themed-view";
import { ThemedText } from "./ui/themed-text";
import { ThemedTextInput } from "./ui/themed-text-input";
import { useAuth } from "@/context/AuthContext";
import { useThemeMode } from "@/context/ThemeContext";
import { getCurrentUser } from "@/services/user-api";
import { StyleSheet, Pressable } from "react-native";

type UserSettingsContentProps = {
  accessToken: string | null;
  borderColor: string;
}

type SecurityQuestions = {
  question: string;
}

type User = {
  _id: string;
  name: string;
  email: string;
  securityQuestions: SecurityQuestions[];
}

export function UserSettingsContent({accessToken, borderColor}: UserSettingsContentProps){
  const router = useRouter();
  const {logout, accountType} = useAuth();
  const { themeMode, setThemeMode } = useThemeMode();
  const [user, setUser] = useState<User | null>(null)
  const [edit, setEdit] = useState<boolean>(false)
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("")
  const [showSecurityOptions, setShowSecurityOptions] = useState(false);

  async function getUserInfo(){
    try {
      const userInfo = await getCurrentUser(accessToken);
      setUser(userInfo.user)
      setEditedName(userInfo.user.name)
      setEditedEmail(userInfo.user.email)
    } catch (error) {
      console.error(error)
    }
  }

  function changeTheme(){
    const choices = ["system", "light", "dark"] as const
    const idx = choices.findIndex((str) => str === themeMode);
    const newIndex = (idx + 1) % choices.length
    let newTheme = choices[newIndex]
    setThemeMode(newTheme)
  }

  useEffect(() => {
    getUserInfo()
  }, [])

    return(
      <ThemedView style={{flex: 1, justifyContent: "center", gap: 10, padding: 10}}>
        <ThemedText type="title" >Account Settings </ThemedText>
        {/* <Pressable style={styles.row}> */}
        <ThemedView style={styles.row}>
          <ThemedView style={styles.column}>
            <ThemedText type="defaultSemiBold">Name</ThemedText>
            <ThemedText>Email</ThemedText>
            <ThemedText>Account</ThemedText>
            <ThemedText>Theme</ThemedText>
          </ThemedView>
          <ThemedView style={styles.column}>
            {edit ? (
              <>
                <ThemedTextInput value={editedName} onChangeText={setEditedName} />
                <ThemedTextInput value={editedEmail} onChangeText={setEditedEmail} autoCapitalize="none" keyboardType="email-address" />
                { accountType === "user" ? (<ThemedText>Customer</ThemedText>) : (<ThemedText>{accountType}</ThemedText>)}
              </>
            ) : (
              <>
                <ThemedText>{user?.name}</ThemedText>
                <ThemedText>{user?.email}</ThemedText>
                { accountType === "user" ? (<ThemedText>Customer</ThemedText>) : (<ThemedText>{accountType}</ThemedText>)}
              </>
            )}
            <ThemedView style={styles.row}>
              <Button onPress={() => changeTheme()}>
                {themeMode}
              </Button>
            </ThemedView>
          </ThemedView>
        </ThemedView>
        <ThemedView style={styles.column}>
          {!edit ? (
            <ThemedView style={styles.row}>
              <Button 
                onPress={() => {
                  setShowSecurityOptions(false);
                  setEdit(true);
                }}>Edit Profile</Button>
            </ThemedView> ) : (
            <ThemedView style={[styles.buttonRow, {borderColor}]}>
              <Button style={styles.yesButton} color={borderColor}>Confirm</Button>
              <Button 
                style={styles.noButton}  
                color={borderColor} 
                onPress={() => {
                  setEditedName(user?.name ?? "");
                  setEditedEmail(user?.email ?? "");
                  setEdit(false);
                }}>Cancel</Button>
            </ThemedView>
          )}
          {/* <ThemedView style={styles.column}> */}
            <ThemedView style={styles.row}>
              <Button
                onPress={() => {
                  setShowSecurityOptions((prev) => !prev)
                  setEdit(false)
                }}
              >
                {showSecurityOptions ? "Hide Account Security" : "Account Security"}
              </Button>
            </ThemedView>
            {showSecurityOptions && (
              <ThemedView style={styles.securitySection}>
                <ThemedView style={styles.row}>
                  <Button>Change Password</Button>
                </ThemedView>
                <ThemedView style={styles.row}>
                  <Button>Update Security Questions</Button>
                </ThemedView>
                <ThemedView style={styles.row}>
                  <Button style={styles.noButton} color={borderColor}>Delete Account</Button>
                </ThemedView>
              </ThemedView>
            )}


          {/* </ThemedView> */}
          <ThemedView style={styles.row}>
            <Button onPress={async () => {
                await logout(); 
                router.replace("/")
              }}
            >Log Out</Button>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    );
}

const styles = StyleSheet.create({
  column: {
    flexDirection: "column",
    flex: 1,
    gap: 24,
    // justifyContent: "space-around",
    // borderWidth: 1,
    // borderColor: "green",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    // alignItems: "center",
    gap: 24,
    // borderBottomWidth: 1,
    // borderColor: "red",
  },
  textRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  themeButton: {
    paddingVertical: 6,
    backgroundColor: "blue", // temp color
    borderRadius: 50,
    alignItems:"center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  yesButton: {
    backgroundColor: "green", //temp coloe
    color: "red",
  },
  noButton: {
    backgroundColor: "red" // temp color
  },
  securitySection: {
    gap: 10,
    paddingBottom: 10,
  }
})