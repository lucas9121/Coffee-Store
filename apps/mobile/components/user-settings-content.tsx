import { useState, useEffect } from "react";
import { StyleSheet, Modal, KeyboardAvoidingView, Platform, ScrollView, Pressable } from "react-native";
import { Button } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import { ThemedView } from "./ui/themed-view";
import { ThemedText } from "./ui/themed-text";
import { ThemedTextInput } from "./ui/themed-text-input";
import { ThemedScrollView } from "./ui/themed-scroll-view";
import { useAuth } from "@/context/AuthContext";
import { useThemeMode } from "@/context/ThemeContext";
import {
  getCurrentUser, 
  updateUserProfile, 
  updateUserPassword, 
  updateUserSecurityQuestion 
} from "@/services/user-api";

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
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPasswordForChange, setCurrentPasswordForChange] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPasswordConfirmModal, setShowPasswordConfirmModal] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [activeSecurityIndex, setActiveSecurityIndex] = useState<0 | 1 | null>(null);
  const [newSecurityQuestion, setNewSecurityQuestion] = useState("");
  const [newSecurityAnswer, setNewSecurityAnswer] = useState("");
  const [securityPassword, setSecurityPassword] = useState("");
  const [securityError, setSecurityError] = useState("");
  const [isUpdatingSecurity, setIsUpdatingSecurity] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("")
  const [deleteError, setDeleteError] = useState("")

  const securityQuestionChoices = [
    "What is your mother's maiden name?",
    "What is the name of your first pet?",
    "What was your first car?",
    "What elementary school did you attend?",
    "What is the name of the town where you were born?",
    "Where did you meet your spouse?",
  ];

  /////////////// Change Here ////////////////////
  function openSecurityQuestionModal(index: 0 | 1) {
    setActiveSecurityIndex(index);
    setNewSecurityQuestion(user?.securityQuestions[index]?.question ?? "");
    setNewSecurityAnswer("");
    setSecurityPassword("");
    setSecurityError("");
  }
  /////////////// End Change ////////////////////

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

  function validatePasswordChange() {
    if (!currentPasswordForChange.trim()) {
      setPasswordError("Please enter your current password.");
      return false;
    }

    if (!newPassword.trim()) {
      setPasswordError("Enter a new password.");
      return false;
    }

    if (newPassword.length < 5) {
      setPasswordError("Password must be at least 5 characters.");
      return false;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError("Passwords do not match.");
      return false;
    }

    setPasswordError("");
    return true;
  }

  async function handleChangePassword() {
    try {
      setPasswordError("");
      setIsUpdatingPassword(true);
      await updateUserPassword(
        {
          currentPassword: currentPasswordForChange,
          newPassword,
        },
        accessToken
      );
      setCurrentPasswordForChange("");
      setNewPassword("");
      setConfirmNewPassword("");
      setShowChangePassword(false);

    } catch (error) {
      console.error(error);
      setPasswordError("Unable to update password.");

    } finally {
      setIsUpdatingPassword(false);
    }
  };

  async function handleChangeSecurityQuestions(index: 0 | 1){
    if(!securityPassword.trim()){
      setSecurityError("Please enter your current Password.");
      return;
    };
    if (!newSecurityAnswer.trim()) {
      setSecurityError("Please enter an answer.");
      return;
    };
    if (!newSecurityQuestion.trim()) {
      setSecurityError("Please select a security question.");
      return;
    };

    try {
      setIsUpdatingSecurity(true);
      await updateUserSecurityQuestion(
        {
          password: securityPassword,
          index,
          newQuestion: newSecurityQuestion,
          newAnswer: newSecurityAnswer.trim()
        },
        accessToken
      );
      await getUserInfo();
      setNewSecurityQuestion("");
      setNewSecurityAnswer("");
      setSecurityError("");
      setActiveSecurityIndex(null);
    } catch (error) {
      console.error(error);
      setSecurityError("Unable to update security question.")
    } finally {
      setIsUpdatingSecurity(false);
      setSecurityPassword("");
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

  const otherSecurityQuestion =
    activeSecurityIndex === 0
      ? user?.securityQuestions[1]?.question
      : activeSecurityIndex === 1
        ? user?.securityQuestions[0]?.question
        : null;

  const availableSecurityQuestions = securityQuestionChoices.filter(
    (question) => question !== otherSecurityQuestion
  );

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
                  setShowChangePassword(false);
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
                  setShowChangePassword(false);
                }}
              >
                {showSecurityOptions ? "Hide Account Security" : "Account Security"}
              </Button>
            </ThemedView>
            {showSecurityOptions && (
              <ThemedView style={[styles.securitySection, {borderColor}]}>
                {/* Security Question Change */}
                <ThemedView style={[styles.securityColumn, {borderColor}]}> 
                  <ThemedText>Security Questions</ThemedText>
                  {user?.securityQuestions.map((qt, idx) => (
                    <ThemedView key={idx} style={styles.securityRow}>
                      {/* <ThemedText type="defaultSemiBold">Question {idx + 1}:</ThemedText>  */}
                      <ThemedText>{idx + 1}) {qt.question}</ThemedText>
                      <Button
                        onPressIn={() => openSecurityQuestionModal(idx as 0 | 1)}
                      >
                        Edit
                      </Button>
                    </ThemedView>
                  ))}
                </ThemedView>

                {/* Change Password Button and Delete Account Button */}
                <ThemedView style={[styles.buttonRow, {borderColor}]}>
                  {/* Password and Delete Buttons */}
                  <ThemedView style={styles.row}>
                    <Button
                      onPress={() => {
                        setShowChangePassword((prev) => !prev)
                      }}
                    >
                      {showChangePassword ? "Hide Change Password" : "Change Password"}
                    </Button>
                  </ThemedView>

                  <Button 
                    style={styles.noButton} 
                    color={borderColor}
                    onPress={() => setShowDeleteConfirmModal(true)}
                  >
                    Delete Account
                  </Button>
                </ThemedView>

                {/* Password Change */}
                {showChangePassword && (
                  <ThemedView style={styles.passwordColumn}>
                    <ThemedTextInput
                      placeholder="Current password"
                      value={currentPasswordForChange}
                      onChangeText={setCurrentPasswordForChange}
                      secureTextEntry
                    />

                    <ThemedTextInput
                      placeholder="New password"
                      value={newPassword}
                      onChangeText={setNewPassword}
                      secureTextEntry
                    />

                    <ThemedTextInput
                      placeholder="Confirm new password"
                      value={confirmNewPassword}
                      onChangeText={setConfirmNewPassword}
                      secureTextEntry
                    />

                    {passwordError ? (
                      <ThemedText style={styles.errorText}>{passwordError}</ThemedText>
                    ) : null}

                    <ThemedView style={styles.passwordRow}> 
                      <Button onPress={() => {
                        if(validatePasswordChange()){
                          setShowPasswordConfirmModal(true)
                        }
                        }}>
                        {isUpdatingPassword ? "Updating..." : "Confirm"}
                      </Button>
                      <Button 
                        style={styles.noButton} 
                        color={borderColor}
                        onPress={() => {
                          setShowChangePassword(false)
                          setCurrentPasswordForChange("")
                          setNewPassword("")
                          setConfirmNewPassword("")
                        }}>
                          Cancel
                        </Button>
                    </ThemedView>
                  </ThemedView>
                )}
                {/* Delete Account */}
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

        {/* Password Confirm Change Modal */}
        <Modal
          visible={showPasswordConfirmModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowPasswordConfirmModal(false)}
        >
          <ThemedView style={styles.modalOverlay}>
            <ThemedView style={[styles.modalContent, { borderColor }]}>
              <ThemedText type="subtitle">Change Password?</ThemedText>
              <ThemedText>
                Are you sure you want to update your password?
              </ThemedText>

              <ThemedView style={styles.passwordRow}>
                <Button
                  style={styles.yesButton}
                  color={borderColor}
                  onPress={async () => {
                    setShowPasswordConfirmModal(false);
                    await handleChangePassword();
                  }}
                >
                  Yes, Change
                </Button>

                <Button
                  style={styles.noButton}
                  color={borderColor}
                  onPress={() => setShowPasswordConfirmModal(false)}
                >
                  Cancel
                </Button>
                
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </Modal>

        {/* Security Question Change Modal */}
        <Modal
          visible={activeSecurityIndex !== null}
          transparent
          animationType="slide"
          onRequestClose={() => setActiveSecurityIndex(null)}
        >
          <ThemedView style={styles.modalOverlay}>
            <ThemedView style={styles.modalOverlay}>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoiding}
              >
              <ThemedView style={[styles.modalContent, { borderColor }]}>
                <ThemedText type="subtitle">
                  Update Security Question {activeSecurityIndex !== null ? activeSecurityIndex + 1 : ""}
                </ThemedText>

                <ThemedText type="defaultSemiBold">Question</ThemedText>

                <ScrollView style={styles.questionChoiceList} >
                  {availableSecurityQuestions.map((question) => (
                    <Pressable
                      key={question}
                      onPress={() => setNewSecurityQuestion(question)}
                      style={[styles.questionOption, {borderColor}]}
                    >
                      <ThemedText>
                        {newSecurityQuestion === question ? `✓ ${question}` : question}

                      </ThemedText>
                    </Pressable>
                  ))}
                </ScrollView>

                <ThemedTextInput
                  placeholder="New answer"
                  value={newSecurityAnswer}
                  onChangeText={setNewSecurityAnswer}
                  autoCapitalize="none"
                />

                <ThemedTextInput
                  placeholder="Current password"
                  value={securityPassword}
                  onChangeText={setSecurityPassword}
                  secureTextEntry
                />

                {securityError ? (
                  <ThemedText style={styles.errorText}>{securityError}</ThemedText>
                ) : null}

                <ThemedView style={styles.passwordRow}>
                  <Button
                    style={styles.noButton}
                    color={borderColor}
                    onPress={() => {
                      setActiveSecurityIndex(null);
                      setNewSecurityQuestion("");
                      setNewSecurityAnswer("");
                      setSecurityPassword("");
                      setSecurityError("");
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    style={styles.yesButton}
                    color={borderColor}
                    onPress={() => {
                      if (activeSecurityIndex !== null) {
                        handleChangeSecurityQuestions(activeSecurityIndex);
                      }
                    }}
                  >
                    {isUpdatingSecurity ? "Updating..." : "Confirm"}
                  </Button>
                </ThemedView>
              </ThemedView>
              </KeyboardAvoidingView>
            </ThemedView>
          </ThemedView>
        </Modal>

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
  securityColumn: {
    flexDirection: "column",
    gap: 8,
    paddingBottom: 16,
  },
  securityRow: {
    flexDirection: "row",
    alignItems: "center", 
    justifyContent: "flex-start",
    gap: 16
  },
  passwordColumn: {
    flexDirection: "column",
    gap: 16,
    paddingVertical: 16,
  },
  passwordRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
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
  questionChoiceList: {
    maxHeight: 220,
  },
  questionOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
})