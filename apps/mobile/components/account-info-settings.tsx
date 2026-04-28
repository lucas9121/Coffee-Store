import { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { Button } from "@react-navigation/elements";
import { ThemedView } from "./ui/themed-view";
import { ThemedText } from "./ui/themed-text";
import { ThemedTextInput } from "./ui/themed-text-input";
import { updateUserProfile } from "@/services/user-api";
import { useThemeColor } from "@/hooks/use-theme-color";

type SecurityQuestions = {
  question: string;
};

type User = {
  _id: string;
  name: string;
  email: string;
  securityQuestions: SecurityQuestions[];
};

type ThemeMode = "system" | "light" | "dark";

type AccountInfoSettingsProps = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  accessToken: string | null;
  borderColor: string;
  accountType: string;
  themeMode: ThemeMode;
  changeTheme: () => void;
  onStartEdit: () => void;
  resetKey: number;
};

export function AccountInfoSettings({
  user,
  setUser,
  accessToken,
  borderColor,
  accountType,
  themeMode,
  changeTheme,
  onStartEdit,
  resetKey,
}: AccountInfoSettingsProps){
  const [edit, setEdit] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [profileError, setProfileError] = useState("");
  const textColor = useThemeColor({}, "text")

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
    if (!user) return;

    setEditedName(user.name);
    setEditedEmail(user.email);
  }, [user]);

  useEffect(() => {
    setEdit(false);
    setEditedName(user?.name ?? "");
    setEditedEmail(user?.email ?? "");
    setCurrentPassword("");
    setProfileError("");
  }, [resetKey]);

  return(
    <>
      <ThemedText type="title">Account Settings</ThemedText>

      {/* Name */}
      <ThemedView style={styles.infoRow}>
        <ThemedText type="defaultSemiBold" style={styles.infoLabel}>
          Name
        </ThemedText>

        <ThemedView style={styles.infoValue}>
          {edit ? (
            <ThemedTextInput
              value={editedName}
              onChangeText={setEditedName}
              placeholder="Name"
            />
          ) : (
            <ThemedText>{user?.name}</ThemedText>
          )}
        </ThemedView>
      </ThemedView>

      {/* Email */}
      <ThemedView style={styles.infoRow}>
        <ThemedText type="defaultSemiBold" style={styles.infoLabel}>
          Email
        </ThemedText>

        <ThemedView style={styles.infoValue}>
          {edit ? (
            <ThemedTextInput
              value={editedEmail}
              onChangeText={setEditedEmail}
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
            />
          ) : (
            <ThemedText>{user?.email}</ThemedText>
          )}
        </ThemedView>
      </ThemedView>

      {/* Account */}
      <ThemedView style={styles.infoRow}>
        <ThemedText type="defaultSemiBold" style={styles.infoLabel}>
          Account
        </ThemedText>

        <ThemedView style={styles.infoValue}>
          <ThemedText>
            {accountType === "user" ? "Customer" : accountType}
          </ThemedText>
        </ThemedView>
      </ThemedView>

      {/* Theme */}
      <ThemedView style={styles.infoRow}>
        <ThemedText type="defaultSemiBold" style={styles.infoLabel}>
          Theme
        </ThemedText>

        <ThemedView style={styles.infoValue}>
          <Button onPress={changeTheme}>{themeMode}</Button>
        </ThemedView>
      </ThemedView>

      {/* Password (only in edit mode) */}
      {edit && (
        <ThemedView style={styles.infoRow}>
          <ThemedText type="defaultSemiBold" style={styles.infoLabel}>
            Password
          </ThemedText>

          <ThemedView style={styles.infoValue}>
            <ThemedTextInput
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Current password"
              secureTextEntry
            />
          </ThemedView>
        </ThemedView>
      )}

      {/* Error */}
      {profileError ? (
        <ThemedText style={styles.errorText}>{profileError}</ThemedText>
      ) : null}

      {/* Buttons */}
      {!edit ? (
        <Button onPress={() => {
          onStartEdit();
          setEdit(true)
        }}>Edit Profile</Button>
      ) : (
        <ThemedView style={styles.buttonRow}>
          <Button 
            style={styles.yesButton} 
            color={textColor}
            onPress={handleConfirmProfile}
          >
            {isSaving ? "Saving..." : "Confirm"}
          </Button>

          <Button
            style={styles.noButton}
            color={textColor}
            onPress={() => {
              setEditedName(user?.name ?? "");
              setEditedEmail(user?.email ?? "");
              setCurrentPassword("");
              setProfileError("");
              setEdit(false);
            }}
          >
            Cancel
          </Button>
        </ThemedView>
      )}
    </>
  )
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoLabel: {
    width: "40%",
  },
  infoValue: {
    width: "60%",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginTop: 12,
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
});