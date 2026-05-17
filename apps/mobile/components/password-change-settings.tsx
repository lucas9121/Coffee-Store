import { useState } from "react";
import { Modal, StyleSheet } from "react-native";
import { ThemedView } from "./ui/themed-view";
import { ThemedText } from "./ui/themed-text";
import { ThemedTextInput } from "./ui/themed-text-input";
import { updateUserPassword } from "@/services/user-api";
import { ThemedButton } from "./ui/themed-button";
import { spacing } from "@/constants/tokens";

type PasswordChangeSettingsProp = {
  accessToken: string | null,
  borderColor: string,
  errorColor: string;
}

export function PasswordChangeSettings({accessToken, borderColor, errorColor}: PasswordChangeSettingsProp){
  const [currentPasswordForChange, setCurrentPasswordForChange] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

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
      setShowPasswordModal(false);

    } catch (error) {
      console.error(error);
      setPasswordError("Unable to update password.");

    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <>
      <ThemedView style={styles.row}>
        <ThemedButton
          variant="primary"
          size="sm"
          onPress={() => {
            setPasswordError("");
            setShowPasswordModal(true)
          }}
        >
          Change Password
        </ThemedButton>
      </ThemedView>

      <Modal
        visible={showPasswordModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <ThemedView style={styles.modalOverlay}>
          <ThemedView style={[styles.modalContent, { borderColor }]}>
            <ThemedText type="subtitle">Change Password</ThemedText>

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
              <ThemedText style={{color: errorColor}}>{passwordError}</ThemedText>
            ) : null}

            <ThemedView style={styles.passwordRow}>
              <ThemedButton
                variant="danger"
                size="sm"
                onPress={() => {
                  setShowPasswordModal(false);
                  setCurrentPasswordForChange("");
                  setNewPassword("");
                  setConfirmNewPassword("");
                  setPasswordError("");
                }}
              >
                Cancel
              </ThemedButton>

              <ThemedButton
                variant="primary"
                size="sm"
                onPress={() => {
                  if (validatePasswordChange()) {
                    handleChangePassword();
                  }
                }}
              >
                {isUpdatingPassword ? "Updating..." : "Confirm"}
              </ThemedButton>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </Modal>
    </>
  )
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.lg,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
    padding: spacing.lg,
  },
  modalContent: {
    width: "100%",
    borderWidth: 1,
    borderRadius: spacing.md,
    padding: spacing.md,
    gap: spacing.md,
  },
  passwordRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.lg,
  },
})