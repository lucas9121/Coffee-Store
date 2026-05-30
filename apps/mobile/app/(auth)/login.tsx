import LoginForm from "@/components/login-form";
import { useLocalSearchParams, useRouter } from "expo-router";


export default function LoginScreen() {
  const params = useLocalSearchParams<{
    fromCheckout?: string;
    sessionExpired?: string;
  }>();

  const fromCheckout = params.fromCheckout === "true";
  const sessionExpired = params.sessionExpired === "true";

  return (
    <LoginForm
      title={fromCheckout ? "Log in to Checkout" : "Welcome Back"}
      fromCheckout={fromCheckout}
      sessionExpired={sessionExpired}
      showGuestCheckout={fromCheckout}
      showSignupButton
    />
  );
}