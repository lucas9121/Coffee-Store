import { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { ThemedView } from "./ui/themed-view";
import { ThemedText } from "./ui/themed-text";
import { ThemedTextInput } from "./ui/themed-text-input";
import { updateUserProfile } from "@/services/user-api";
import { ThemedButton } from "./ui/themed-button";

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
  errorColor: string;
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
  accountType,
  themeMode,
  errorColor,
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
          Theme Color
        </ThemedText>

        <ThemedView style={styles.infoValue}>
          {edit ?
            <ThemedButton variant="ghost" size="sm" onPress={changeTheme}>{themeMode}</ThemedButton> :
            <ThemedText style={{textTransform: "capitalize"}}>{themeMode}</ThemedText>
          }
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
        <ThemedText style={{color: errorColor}}>{profileError}</ThemedText>
      ) : null}

      {/* Buttons */}
      {!edit ? (
        <ThemedButton
          variant="primary"
          size="md" 
          onPress={() => {
            onStartEdit();
            setEdit(true)
        }}>Edit Profile</ThemedButton>
      ) : (
        <ThemedView style={styles.buttonRow} marginTop="md" gap="lg">
          <ThemedButton 
            variant="primary"
            onPress={handleConfirmProfile}
          >
            {isSaving ? "Saving..." : "Confirm"}
          </ThemedButton>

          <ThemedButton
            variant="danger"
            onPress={() => {
              setEditedName(user?.name ?? "");
              setEditedEmail(user?.email ?? "");
              setCurrentPassword("");
              setProfileError("");
              setEdit(false);
            }}
          >
            Cancel
          </ThemedButton>
        </ThemedView>
      )}
    </>
  )
};

const styles = StyleSheet.create({
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
  },
});