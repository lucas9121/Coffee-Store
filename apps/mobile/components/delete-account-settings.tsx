import { useState } from "react";
import { Modal, StyleSheet } from "react-native";
import { ThemedView } from "./ui/themed-view";
import { ThemedText } from "./ui/themed-text";
import { ThemedTextInput } from "./ui/themed-text-input";
import { deleteUser } from "@/services/user-api";
import { ThemedButton } from "./ui/themed-button";
import { spacing } from "@/constants/tokens";

type DeleteAccountSettingsProps = {
  accessToken: string | null;
  borderColor: string;
  errorColor: string;
  onDeleted: () => Promise<void>;
};

export function DeleteAccountSettings({
  accessToken,
  borderColor,
  errorColor,
  onDeleted,
}: DeleteAccountSettingsProps) {
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDeleteAccount() {
    if (!deletePassword.trim()) {
      setDeleteError("Please enter your current password.");
      return;
    }

    try {
      setDeleteError("");
      setIsDeleting(true);

      await deleteUser({password: deletePassword}, accessToken)

      setShowDeleteConfirmModal(false);
      setDeletePassword("");

      await onDeleted(); // logout + redirect handled by parent
    } catch (error) {
      console.error(error);
      setDeleteError("Unable to delete account.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      {/* Trigger Button */}
      <ThemedButton
        variant="danger"
        size="sm"
        onPress={() => setShowDeleteConfirmModal(true)}
      >
        Delete Account
      </ThemedButton>

      {/* Modal */}
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
              This action cannot be undone.
            </ThemedText>

            <ThemedTextInput
              placeholder="Current password"
              value={deletePassword}
              onChangeText={setDeletePassword}
              secureTextEntry
            />

            {deleteError ? (
              <ThemedText style={{color: errorColor}}>
                {deleteError}
              </ThemedText>
            ) : null}

            <ThemedView style={styles.buttonRow}>
              <ThemedButton
                variant="secondary"
                onPress={() => {
                  setShowDeleteConfirmModal(false);
                  setDeleteError("");
                  setDeletePassword("");
                }}
              >
                Cancel
              </ThemedButton>

              <ThemedButton
                variant="danger"
                onPress={handleDeleteAccount}
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </ThemedButton>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.lg
  },
  yesButton: {
    backgroundColor: "green", //temp color
  },
  noButton: {
    backgroundColor: "red", // temp color
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
    gap: spacing.lg,
  },
})