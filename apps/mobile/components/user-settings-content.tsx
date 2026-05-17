import { useState, useEffect } from "react";
import { StyleSheet} from "react-native";
import { Button } from "@react-navigation/elements";
import { useRouter } from "expo-router";

import { ThemedView } from "./ui/themed-view";
import { ThemedScrollView } from "./ui/themed-scroll-view";
import { ThemedButton } from "./ui/themed-button";
import { spacing } from "@/constants/tokens";

import { useAuth } from "@/context/AuthContext";
import { useThemeMode } from "@/context/ThemeContext";
import { getCurrentUser } from "@/services/user-api";
import { useThemeColor } from "@/hooks/use-theme-color";

import { PasswordChangeSettings } from "./password-change-settings";
import { SecurityQuestionSettings } from "./security-question-settings";
import { AccountInfoSettings } from "./account-info-settings";
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
  const textColor = useThemeColor({}, "text");

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
  }, []);

    return(
      <ThemedScrollView padding="lg" gap="lg" keyboardShouldPersistTaps="handled">
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
        <ThemedView paddingVertical="xl">
          <ThemedView style={styles.row} paddingVertical={showSecurityOptions ?"sm" : undefined }>
            <ThemedButton
              variant="secondary"
              onPress={() => {
                setShowSecurityOptions((prev) => !prev)
                setAccountInfoResetKey((prev) => prev + 1);
              }}
            >
              {showSecurityOptions ? "Hide Account Security" : "Account Security"}
            </ThemedButton>
          </ThemedView>
          {showSecurityOptions && (
            <ThemedView style={[styles.securitySectionContainer, {borderColor}]}>
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
          <ThemedButton 
            variant="secondary"
            onPress={async () => {
                await logout(); 
                router.replace("/")
            }}
          >Log Out</ThemedButton>
        </ThemedView>
      </ThemedScrollView>
    );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.xl,
  },
  securitySectionContainer: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.lg,
    paddingBottom: spacing.lg,
  },
})