import { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { Button } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import { ThemedView } from "./ui/themed-view";
import { ThemedText } from "./ui/themed-text";
import { ThemedTextInput } from "./ui/themed-text-input";
import { useAuth } from "@/context/AuthContext";
import { useThemeMode } from "@/context/ThemeContext";
import { getCurrentUser } from "@/services/user-api";
import { updateUserProfile } from "@/services/user-api";

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

  useEffect(() => {
    getUserInfo()
  }, [])

    return(
      <ThemedView style={{flex: 1, justifyContent: "center", gap: 10, padding: 10}}>
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

            {/* Password and error message */}
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
                  setEdit(false)
                  setEdit(false);
                }}>
                    Cancel
                </Button>
            </ThemedView>
          )}

          {/* Account Security buttons */}
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

          {/* Log Out button */}
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
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    gap: 10,
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  yesButton: {
    backgroundColor: "green", //temp color
    color: "red",
  },
  noButton: {
    backgroundColor: "red" // temp color
  },
  securitySection: {
    gap: 10,
    paddingBottom: 10,
  },
  errorText: {
    color: "#ff6b6b",
  },
})