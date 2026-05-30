import { useState } from "react";
import {
  StyleSheet,
  Pressable,
  Image,
  KeyboardAvoidingView, 
  Platform } from "react-native";
import { useRouter } from "expo-router";

import { ThemedScrollView } from "@/components/ui/themed-scroll-view";
import { ThemedView } from "@/components/ui/themed-view";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedTextInput } from "@/components/ui/themed-text-input";
import { ThemedButton } from "@/components/ui/themed-button";
import { spacing, radius } from "@/constants/tokens";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuth } from "@/context/AuthContext";
import { loginUser } from "@/services/auth-api";
import { Ionicons } from "@expo/vector-icons";

type LoginFormProps = {
  title?: string;
  fromCheckout?: boolean;
  sessionExpired?: boolean;
  showGuestCheckout?: boolean;
  showSignupButton?: boolean;
};


export default function LoginForm({title, fromCheckout, sessionExpired, showGuestCheckout, showSignupButton}: LoginFormProps) {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState("");
  const errorColor = useThemeColor({}, "danger");
  const borderColor = useThemeColor({}, "border");
  const shadowColor = useThemeColor({}, "text");
  const textColor = useThemeColor({}, "text")


  async function handleSubmit(): Promise<void> {
    setLoginError("");
    setIsSubmitting(true);

    try {
      const data = await loginUser({ email, password });

      const accessToken = data.token;
      const refreshToken = data.refreshToken ?? null;
      const accountType = data.user.account;

      if (accountType === "admin") {
        setLoginError("Login failed. Please check your credentials.");
        return;
      }

      await login(accessToken, refreshToken, accountType);

      if (fromCheckout) {
        router.replace("/cart");
      } else {
        router.replace("/");
      }
    } catch (error) {
      setLoginError("Login failed. Please check your email and password.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  async function handleUserLogin() {
    await login("mock-access-token-user", "mock-refresh-token-user", "user");
    router.replace("/");
  };

  async function handleWorkerLogin() {
    await login("mock-access-token-worker", "mock-refresh-token-worker", "worker");
    router.replace("/");
  };

  return (
    <KeyboardAvoidingView 
      style={{flex: 1}}
      behavior={Platform.OS === "ios" ? "padding": undefined}
    >
      <ThemedScrollView contentContainerStyle={styles.screen}>
        <ThemedView
          padding="xl"
          gap="lg"
          radius="lg"
          style={[styles.card, styles.cardShadow, { borderColor, shadowColor }]}
        >
          <Image
            source={require("@/assets/images/logo.jpg")}
            style={styles.logo}
          />

          <ThemedText type="title">
            {title ?? "Welcome Back"}
          </ThemedText>

          <ThemedTextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <ThemedTextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            rightAccessory={
              <Pressable
                onPressIn={() => setShowPassword(true)}
                onPressOut={() => setShowPassword(false)}
                style={styles.eyeButton}
              >
                <Ionicons
                  name={showPassword ? "eye" : "eye-off"}
                  size={spacing.lg}
                  color={textColor}
                />
              </Pressable>
            }
          />

          <ThemedButton
            variant="primary"
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Log in"}
          </ThemedButton>

          <ThemedButton
            variant="link"
            onPress={() => router.push("/forgot-password")}
          >
            Forgot Password
          </ThemedButton>

          {showSignupButton && !showGuestCheckout && (
            <ThemedButton
              variant="link"
              onPress={() => router.push("/signup")}
            >
              Create Account
            </ThemedButton>
          )}

          {sessionExpired && (
            <ThemedText style={{ color: errorColor }}>
              Session expired. Please log in again.
            </ThemedText>
          )}

          {loginError ? (
            <ThemedText style={{ color: errorColor }}>{loginError}</ThemedText>
          ) : null}

          {showGuestCheckout && (
            <ThemedButton
              variant="link"
              onPress={() => router.push("/guest-checkout")}
            >
              Continue as Guest
            </ThemedButton>
          )}
        </ThemedView>
      </ThemedScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
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
  logo: {
    width: 120,
    height: 120,
    borderRadius: radius.pill,
    alignSelf: "center",
    resizeMode: "cover",
  },
  eyeButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
});
