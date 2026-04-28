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
import { getCurrentUser, updateUserProfile } from "@/services/user-api";
import { PasswordChangeSettings } from "./password-change-settings";
import { SecurityQuestionSettings } from "./security-question-settings";

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
  const [editedEmail, setEditedEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showSecurityOptions, setShowSecurityOptions] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("")
  const [deleteError, setDeleteError] = useState("")



  async function getUserInfo(){
    try {
      const userInfo = await getCurrentUser(accessToken);
      setUser(userInfo.user)
      setEditedName(userInfo.user.name)
      setEditedEmail(userInfo.user.email)
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

  async function handleConfirmProfile() {
    if (!editedName.trim() || !editedEmail.trim()) {
      setProfileError("Name and email are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editedEmail.trim())) {
      setProfileError("Please enter a valid email address.");
      return;
    }

    if (!currentPassword.trim()) {
      setProfileError("Please enter your current password.");
      return;
    }

    try {
      setProfileError("");
      setIsSaving(true);

      const data = await updateUserProfile(
        {
          name: editedName.trim(),
          email: editedEmail.trim(),
          password: currentPassword,
        },
        accessToken
      );

      setUser(data.user);
      setEditedName(data.user.name);
      setEditedEmail(data.user.email);
      setCurrentPassword("");
      setEdit(false);
    } catch (error) {
      console.error(error);
      setProfileError("Unable to update profile.");
    } finally {
      setIsSaving(false);
    }
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
        <ThemedView style={styles.row}>
          <ThemedView style={edit ? [styles.column, {gap: 35}]: styles.column}>
            <ThemedText type="defaultSemiBold">Name</ThemedText>
            <ThemedText type="defaultSemiBold" style={edit && {paddingTop: 10}}>Email</ThemedText>
            <ThemedText type="defaultSemiBold">Account</ThemedText>
            <ThemedText type="defaultSemiBold">Theme</ThemedText>
          </ThemedView>
          <ThemedView style={styles.column}>
            {edit ? (
              <>
                <ThemedTextInput 
                  value={editedName} 
                  onChangeText={setEditedName} 
                  placeholder="Name"
                />
                <ThemedTextInput 
                  value={editedEmail} 
                  onChangeText={setEditedEmail} 
                  placeholder="Email" 
                  autoCapitalize="none" 
                  keyboardType="email-address" 
                />
                { 
                  accountType === "user" ? (<ThemedText>Customer</ThemedText>) 
                  : (<ThemedText>{accountType}</ThemedText>)
                }
              </>
            ) : (
              <>
                <ThemedText>{user?.name}</ThemedText>
                <ThemedText>{user?.email}</ThemedText>
                {
                  accountType === "user" ? (<ThemedText>Customer</ThemedText>) 
                  : (<ThemedText>{accountType}</ThemedText>)
                }
              </>
            )}

            {/* Password Check and Error Message */}
            <ThemedView style={styles.row}>
              <Button onPress={() => changeTheme()}>
                {themeMode}
              </Button>
            </ThemedView>
          </ThemedView>
        </ThemedView>
        {edit && (
          <ThemedTextInput
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Current password"
            secureTextEntry
          />
        )}
        {profileError ? (
          <ThemedText style={styles.errorText}>{profileError}</ThemedText>
        ) : null}

        {/* Profile Edit buttons */}
        <ThemedView style={[styles.column, {gap: 0}]}>
          {!edit ? (
            <ThemedView style={styles.row}>
              <Button 
                onPress={() => {
                  setShowSecurityOptions(false);
                  setEdit(true);
                }}>Edit Profile</Button>
            </ThemedView> ) : (
            <ThemedView style={[styles.buttonRow, {borderBottomWidth: 1, borderColor}]}>
              <Button 
                style={styles.yesButton} 
                color={borderColor}
                onPress={handleConfirmProfile}
              >
                  {isSaving ? "Saving..." : "Confirm"}
              </Button>
              <Button 
                style={styles.noButton}  
                color={borderColor} 
                onPress={() => {
                  setEditedName(user?.name ?? "");
                  setEditedEmail(user?.email ?? "");
                  setCurrentPassword("");
                  setProfileError("");
                  setEdit(false);
                  setEdit(false);
                }}>
                    Cancel
                </Button>
            </ThemedView>
          )}

          {/* Account Security buttons */}
          <ThemedView style={styles.securityContainer}>
            <ThemedView style={showSecurityOptions ? [styles.row, {paddingBottom: 8}]: styles.row}>
              <Button
                onPress={() => {
                  setShowSecurityOptions((prev) => !prev)
                  setEdit(false);
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