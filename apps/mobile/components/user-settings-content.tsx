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
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("")
  const [deleteError, setDeleteError] = useState("")
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

  async function handleDeleteAccount() {
    if(!deletePassword.trim()){
      setDeleteError("Please enter your current Password.");
      return;
    };
    try {
      // call backend later
      console.log("Delete account confirmed");
      setShowDeleteConfirmModal(false);
      await logout();
      router.replace("/");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserInfo()
  }, [])

    return(
      <ThemedScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <ThemedText type="title" >Account Settings </ThemedText>
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

        <ThemedView style={[styles.column, {gap: 0}]}>
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
                />
                <ThemedView style={[styles.buttonRow, {borderColor}]}>
                  {/* Password Change */}
                  <PasswordChangeSettings
                    accessToken={accessToken}
                    borderColor={borderColor}
                  />

                  {/* Delete Account */}
                  <Button 
                    style={styles.noButton} 
                    color={borderColor}
                    onPress={() => setShowDeleteConfirmModal(true)}
                  >
                    Delete Account
                  </Button>
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
        </ThemedView>

        {/* Delete Account Modal */}
        <Modal
          visible={showDeleteConfirmModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDeleteConfirmModal(false)}
        >
          <ThemedView style={styles.modalOverlay}>
            <ThemedView style={[styles.modalContent, { borderColor }]}>
              <ThemedText type="subtitle">Delete Account?</ThemedText>

              <ThemedText>
                Are you sure you want to delete your account. This action cannot be undone.
              </ThemedText>

              <ThemedTextInput
                placeholder="Current password"
                value={deletePassword}
                onChangeText={setDeletePassword}
                secureTextEntry
              />

              {deleteError ? (
                <ThemedText style={styles.errorText}>{deleteError}</ThemedText>
              ) : null}

              <ThemedView style={styles.passwordRow}>
                <Button
                  style={styles.noButton}
                  color={borderColor}
                  onPress={() => {setShowDeleteConfirmModal(false), setDeleteError("")}}
                >
                  Cancel
                </Button>

                <Button
                  style={styles.noButton}
                  color={borderColor}
                  onPress={async () => {
                    await handleDeleteAccount();
                  }}
                >
                  Yes, Delete
                </Button>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </Modal>
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
  column: {
    flexDirection: "column",
    flex: 1,
    gap: 24,
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
    color: "red",
  },
  noButton: {
    backgroundColor: "red", // temp color
    color: "white"
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
  keyboardAvoiding: {
    width: "100%",
  },
})