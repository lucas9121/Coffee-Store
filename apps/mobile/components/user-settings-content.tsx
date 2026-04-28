import { useState, useEffect } from "react";
import { StyleSheet, Modal } from "react-native";
import { Button } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import { ThemedView } from "./ui/themed-view";
import { ThemedText } from "./ui/themed-text";
import { ThemedTextInput } from "./ui/themed-text-input";
import { ThemedScrollView } from "./ui/themed-scroll-view";
import { useAuth } from "@/context/AuthContext";
import { useThemeMode } from "@/context/ThemeContext";
import { getCurrentUser } from "@/services/user-api";
import { PasswordChangeSettings } from "./password-change-settings";
import { SecurityQuestionSettings } from "./security-question-settings";
import { AccountInfoSettings } from "./account-info-settings";
import { useThemeColor } from "@/hooks/use-theme-color";
import { DeleteAccountSettings } from "./delete-account-settings";

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
  const [accountInfoResetKey, setAccountInfoResetKey] = useState(0);
  const [showSecurityOptions, setShowSecurityOptions] = useState(false);
  const textColor = useThemeColor({}, "text")

  async function getUserInfo(){
    try {
      const userInfo = await getCurrentUser(accessToken);
      setUser(userInfo.user)
    } catch (error) {
      console.error(error)
    }
  };

  function changeTheme(){
    const choices = ["system", "light", "dark"] as const
    const idx = choices.findIndex((str) => str === themeMode);
    const newIndex = (idx + 1) % choices.length
    let newTheme = choices[newIndex]
    setThemeMode(newTheme)
  };

  useEffect(() => {
    getUserInfo()
  }, [])

    return(
      <ThemedScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Account Info */}
        <AccountInfoSettings
          user={user}
          setUser={setUser}
          accessToken={accessToken}
          textColor={textColor}
          accountType={accountType}
          themeMode={themeMode}
          changeTheme={changeTheme}
          onStartEdit={() => setShowSecurityOptions(false)}
          resetKey={accountInfoResetKey}
        />

        {/* Account Security buttons */}
        <ThemedView style={styles.securityContainer}>
          <ThemedView style={showSecurityOptions ? [styles.row, {paddingBottom: 8}]: styles.row}>
            <Button
              onPress={() => {
                setShowSecurityOptions((prev) => !prev)
                setAccountInfoResetKey((prev) => prev + 1);
              }}
            >
              {showSecurityOptions ? "Hide Account Security" : "Account Security"}
            </Button>
          </ThemedView>
          {showSecurityOptions && (
            <ThemedView style={[styles.securitySection, {borderColor}]}>
              {/* Security Question Change */}
              <SecurityQuestionSettings
                user={user}
                refreshUser={getUserInfo}
                accessToken={accessToken}
                borderColor={borderColor}
                textColor={textColor}
              />
              <ThemedView style={[styles.buttonRow, {borderColor}]}>
                {/* Password Change */}
                <PasswordChangeSettings
                  accessToken={accessToken}
                  borderColor={borderColor}
                  textColor={textColor}
                />

                {/* Delete Account */}
                <DeleteAccountSettings
                  accessToken={accessToken}
                  borderColor={borderColor}
                  textColor={textColor}
                  onDeleted={async () => {
                    await logout();
                    router.replace("/");
                  }}
                />
              </ThemedView>

            </ThemedView>
          )}
        </ThemedView>

        {/* Log Out button */}
        <ThemedView style={styles.row}>
          <Button onPress={async () => {
              await logout(); 
              router.replace("/")
            }}
          >Log Out</Button>
        </ThemedView>
      </ThemedScrollView>
    );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 24,
  },
  securityContainer: {
    paddingVertical: 24, 
  },
  securitySection: {
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
  passwordRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    paddingBottom: 16,
  },
  yesButton: {
    backgroundColor: "green", //temp color
  },
  noButton: {
    backgroundColor: "red", // temp color
  },
  errorText: {
    color: "#ff6b6b",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
    padding: 24,
  },
  modalContent: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
})