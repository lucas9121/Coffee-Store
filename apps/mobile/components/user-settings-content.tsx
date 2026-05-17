import { useState, useEffect } from "react";
import { StyleSheet, Pressable } from "react-native";
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
import { ThemedText } from "./ui/themed-text";

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
  const errorColor = useThemeColor({}, "danger")

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
          errorColor={errorColor}
          accountType={accountType}
          themeMode={themeMode}
          changeTheme={changeTheme}
          onStartEdit={() => setShowSecurityOptions(false)}
          resetKey={accountInfoResetKey}
        />

        {/* Account Security buttons */}
        <ThemedView paddingVertical="md">
          <ThemedView style={styles.row}>
            <Pressable
              onPress={() => {
                setShowSecurityOptions((prev) => !prev)
                setAccountInfoResetKey((prev) => prev + 1);
              }}
            >
            <ThemedView style={[styles.securityToggle, {borderColor}]}>
              <ThemedText type="defaultSemiBold">Account Secuity </ThemedText>
              <ThemedText>{showSecurityOptions ? "▲" : "▼"}</ThemedText>
            </ThemedView>
            </Pressable>
          </ThemedView>
          {showSecurityOptions && (
            <ThemedView style={[styles.securitySectionContainer, {borderColor}]}>
              {/* Security Question Change */}
              <SecurityQuestionSettings
                user={user}
                refreshUser={getUserInfo}
                accessToken={accessToken}
                borderColor={borderColor}
                errorColor={errorColor}
              />
              <ThemedView style={[styles.buttonRow, {borderColor}]}>
                {/* Password Change */}
                <PasswordChangeSettings
                  accessToken={accessToken}
                  borderColor={borderColor}
                  errorColor={errorColor}
                />

                {/* Delete Account */}
                <DeleteAccountSettings
                  accessToken={accessToken}
                  borderColor={borderColor}
                  errorColor={errorColor}
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
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.lg,
    paddingBottom: spacing.lg,
  },
  securityToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    width: "100%",
  },
})