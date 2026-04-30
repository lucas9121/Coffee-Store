import { useState } from "react";
import { Modal, StyleSheet } from "react-native";
import { Button } from "@react-navigation/elements";
import { ThemedView } from "./ui/themed-view";
import { ThemedText } from "./ui/themed-text";
import { ThemedTextInput } from "./ui/themed-text-input";
import { deleteUser } from "@/services/user-api";

type DeleteAccountSettingsProps = {
  accessToken: string | null;
  borderColor: string;
  textColor: string;
  onDeleted: () => Promise<void>;
};

export function DeleteAccountSettings({
  accessToken,
  borderColor,
  textColor,
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
      <Button
        style={styles.noButton}
        color={textColor}
        onPress={() => setShowDeleteConfirmModal(true)}
      >
        Delete Account
      </Button>

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
              <ThemedText style={styles.errorText}>
                {deleteError}
              </ThemedText>
            ) : null}

            <ThemedView style={styles.buttonRow}>
              <Button
                style={styles.noButton}
                color={textColor}
                onPress={() => {
                  setShowDeleteConfirmModal(false);
                  setDeleteError("");
                  setDeletePassword("");
                }}
              >
                Cancel
              </Button>

              <Button
                style={styles.noButton}
                color={textColor}
                onPress={handleDeleteAccount}
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </Button>
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
    gap: 24
  },
  yesButton: {
    backgroundColor: "green", //temp color
  },
  noButton: {
    backgroundColor: "red", // temp color
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
})