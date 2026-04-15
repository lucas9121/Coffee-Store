import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { Button } from "@react-navigation/elements";
import { ThemedView } from "./ui/themed-view";
import { ThemedText } from "./ui/themed-text";
import { useAuth } from "@/context/AuthContext";
import { useThemeMode } from "@/context/ThemeContext";
import { getCurrentUser } from "@/services/user-api";

type UserSettingsContentProps = {
  accessToken: string | null;
  borderColor: string;
}

type SecurityQuestions = {
  question: string;
  answer: string;
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

  async function getUserInfo(){
    try {
      const userInfo = await getCurrentUser(accessToken);
      setUser(userInfo.user)

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
      <ThemedView style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
        <ThemedText type="title" >Account Settings </ThemedText>
        <ThemedText>
          Name {user?.name}
          <Button>✏</Button>
        </ThemedText>
        <ThemedText>Email {user?.email}</ThemedText>
        {!!edit && (
          <>
            <ThemedText>
              user.securityQuestions[{0}]
              <Button>✏</Button>
            </ThemedText>
            <ThemedText>
              user.securityQuestions[{1}]
              <Button>✏</Button>
            </ThemedText>
            <Button>Change Password</Button>
          </>
        )}
        <ThemedText>Signed in as {accountType}</ThemedText>
        <ThemedText> 
          Theme: <Button onPress={() => changeTheme()}>{themeMode}</Button>
        </ThemedText>
        <Button onPress={() => setEdit(true)}>Edit Profile</Button>
        {!!edit && ( 
          <>
            <Button>Confirm</Button>
            <Button onPress={() => setEdit(false)}>Cancel</Button>
          </>
          )}
        <Button onPress={async () => {
            await logout(); 
            router.replace("/")
          }}
        >Log Out</Button>
      </ThemedView>
    );
}