import { useState } from "react";
import { StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";

import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import { ThemedScrollView } from "@/components/ui/themed-scroll-view";
import { ThemedTextInput } from "@/components/ui/themed-text-input";
import { ThemedButton } from "@/components/ui/themed-button";
import { spacing } from "@/constants/tokens";
import { useThemeColor } from "@/hooks/use-theme-color";
import { getForgotPasswordQuestions, resetForgotPassword } from "@/services/auth-api";

type SecurityQuestion = {
  question: string;
};

type Step = "email" | "questions" | "reset" | "success";

export default function PasswordRecovery() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [securityQuestions, setSecurityQuestions] = useState<SecurityQuestion[]>([]);
  const [answers, setAnswers] = useState(["", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const errorColor = useThemeColor({}, "danger");
  const borderColor = useThemeColor({}, "border");
  const shadowColor = useThemeColor({}, "text");
  const cardColor = useThemeColor({}, "card");

  async function handleFindQuestions() {
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);

      const data = await getForgotPasswordQuestions({
        email: email.trim().toLowerCase(),
      });

      setSecurityQuestions(data.securityQuestions);
      setStep("questions");
    } catch (error) {
      console.error(error);
      setError("Unable to find account.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleVerifyAnswers() {
    if (!answers[0].trim() || !answers[1].trim()) {
      setError("Please answer both security questions.");
      return;
    }

    setError("");
    setStep("reset");
  }

  async function handleResetPassword() {
    if (!newPassword.trim()) {
      setError("Please enter a new password.");
      return;
    }

    if (newPassword.length < 5) {
      setError("Password must be at least 5 characters.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);

      await resetForgotPassword({
        email: email.trim().toLowerCase(),
        answers: answers.map((answer) => answer.trim()),
        newPassword,
      });

      setStep("success");
    } catch (error) {
      console.error(error);
      setError("Unable to reset password. Please check your answers.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ThemedScrollView padding="xl" keyboardShouldPersistTaps="handled" contentContainerStyle={{justifyContent: "center"}}>
        <ThemedView
          padding="xl"
          gap="md"
          radius="lg"
          style={[styles.card, styles.cardShadow, { borderColor, shadowColor, backgroundColor: cardColor }]}
        >
          <ThemedText type="title">Forgot Password</ThemedText>

          {step === "email" && (
            <>
              <ThemedText>Enter your email.</ThemedText>

              <ThemedTextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <ThemedButton
                variant="primary"
                onPress={handleFindQuestions}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Checking..." : "Continue"}
              </ThemedButton>
            </>
          )}

          {step === "questions" && (
            <>
              <ThemedText>Answer your security questions.</ThemedText>

              {securityQuestions.map((item, index) => (
                <ThemedView key={index} gap="sm" style={{backgroundColor: cardColor}}>
                  <ThemedText type="defaultSemiBold">{item.question}</ThemedText>

                  <ThemedTextInput
                    placeholder="Answer"
                    value={answers[index]}
                    onChangeText={(text) => {
                      setAnswers((prev) => {
                        const next = [...prev];
                        next[index] = text;
                        return next;
                      });
                    }}
                    autoCapitalize="none"
                  />
                </ThemedView>
              ))}

              <ThemedButton variant="primary" onPress={handleVerifyAnswers}>
                Continue
              </ThemedButton>
            </>
          )}

          {step === "reset" && (
            <>
              <ThemedText>Enter your new password.</ThemedText>

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

              <ThemedButton
                variant="primary"
                onPress={handleResetPassword}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </ThemedButton>
            </>
          )}

          {step === "success" && (
            <>
              <ThemedText>Your password has been reset successfully.</ThemedText>

              <ThemedButton variant="primary" onPress={() => router.back()}>
                Back to Login
              </ThemedButton>
            </>
          )}

          {error ? (
            <ThemedText style={{ color: errorColor }}>{error}</ThemedText>
          ) : null}

          {step !== "success" && (
            <ThemedButton variant="link" onPress={() => router.back()}>
              Cancel
            </ThemedButton>
          )}
        </ThemedView>
      </ThemedScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderWidth: 1,
  },
  cardShadow: {
    shadowOffset: { width: spacing.xs, height: spacing.xs },
    shadowOpacity: 0.20,
    shadowRadius: spacing.sm,
    elevation: spacing.xs,
  },
});