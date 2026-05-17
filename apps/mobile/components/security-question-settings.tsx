import { useState } from "react";
import { Modal, StyleSheet, Pressable, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { ThemedView } from "./ui/themed-view";
import { ThemedText } from "./ui/themed-text";
import { ThemedTextInput } from "./ui/themed-text-input";
import { updateUserSecurityQuestion } from "@/services/user-api";
import { ThemedButton } from "./ui/themed-button";
import { spacing } from "@/constants/tokens";

type SecurityQuestions = {
  question: string;
};

type User = {
  _id: string;
  name: string;
  email: string;
  securityQuestions: SecurityQuestions[];
};

type SecurityQuestionSettingsProps = {
  user: User | null;
  refreshUser: () => Promise<void>;
  accessToken: string | null;
  borderColor: string;
  errorColor: string;
};

export function SecurityQuestionSettings({
  user, 
  refreshUser, 
  accessToken, 
  borderColor,
  errorColor
}: SecurityQuestionSettingsProps) {
  const [activeSecurityIndex, setActiveSecurityIndex] = useState<0 | 1 | null>(null);
  const [newSecurityQuestion, setNewSecurityQuestion] = useState("");
  const [newSecurityAnswer, setNewSecurityAnswer] = useState("");
  const [securityPassword, setSecurityPassword] = useState("");
  const [securityError, setSecurityError] = useState("");
  const [isUpdatingSecurity, setIsUpdatingSecurity] = useState(false);

  if(!user) return null;

  const securityQuestionChoices = [
    "What is your mother's maiden name?",
    "What is the name of your first pet?",
    "What was your first car?",
    "What elementary school did you attend?",
    "What is the name of the town where you were born?",
    "Where did you meet your spouse?",
  ];

  function openSecurityQuestionModal(index: 0 | 1) {
    setActiveSecurityIndex(index);
    setNewSecurityQuestion(user?.securityQuestions[index]?.question ?? "");
    setNewSecurityAnswer("");
    setSecurityPassword("");
    setSecurityError("");
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
      await refreshUser();
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
    <>
      <ThemedView style={[styles.securityColumn, {borderColor}]}> 
        <ThemedText>Security Questions</ThemedText>
        {user?.securityQuestions.map((qt, idx) => (
          <ThemedView key={idx} style={styles.securityRow}>
            {/* <ThemedText type="defaultSemiBold">Question {idx + 1}:</ThemedText>  */}
            <ThemedText>{idx + 1}) {qt.question}</ThemedText>
            <ThemedButton
              variant="primary"
              size="sm"
              onPress={() => openSecurityQuestionModal(idx as 0 | 1)}
            >
              Edit
            </ThemedButton>
          </ThemedView>
        ))}
      </ThemedView>

      {/* Security Question Change Modal */}
      <Modal
        visible={activeSecurityIndex !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setActiveSecurityIndex(null)}
      >
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
              <ThemedText style={{color: errorColor}}>{securityError}</ThemedText>
            ) : null}

            <ThemedView style={styles.securityButtonRow}>
              <ThemedButton
                variant="danger"
                size="sm"
                onPress={() => {
                  setActiveSecurityIndex(null);
                  setNewSecurityQuestion("");
                  setNewSecurityAnswer("");
                  setSecurityPassword("");
                  setSecurityError("");
                }}
              >
                Cancel
              </ThemedButton>

              <ThemedButton
                variant="primary"
                size="sm"
                onPress={() => {
                  if (activeSecurityIndex !== null) {
                    handleChangeSecurityQuestions(activeSecurityIndex);
                  }
                }}
              >
                {isUpdatingSecurity ? "Updating..." : "Confirm"}
              </ThemedButton>
            </ThemedView>
          </ThemedView>
          </KeyboardAvoidingView>
        </ThemedView>
      </Modal>
    </>
  )
};

const styles = StyleSheet.create({
  securityColumn: {
    flexDirection: "column",
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
  securityRow: {
    flexDirection: "row",
    alignItems: "center", 
    justifyContent: "flex-start",
    gap: spacing.lg
  },
    modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
    padding: spacing.xl,
  },
  modalContent: {
    width: "100%",
    borderWidth: 1,
    borderRadius: spacing.lg,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  keyboardAvoiding: {
    width: "100%",
  },
  questionChoiceList: {
    maxHeight: 220,
  },
  questionOption: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  securityButtonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.lg,
  },
})