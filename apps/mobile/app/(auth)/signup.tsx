import { useState } from "react";
import { StyleSheet, Pressable } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Button } from "@react-navigation/elements";
import { useRouter } from "expo-router";

import { ThemedView } from "@/components/ui/themed-view";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedTextInput } from "@/components/ui/themed-text-input";

import { signupUser } from "@/services/auth-api";
import { useAuth } from "@/context/AuthContext";

export default function SignUpScreen(){
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [question1, setQuestion1] = useState<string>("");
  const [answer1, setAnswer1] = useState<string>("");
  const [question2, setQuestion2] = useState<string>("");
  const [answer2, setAnswer2] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [signUpError, setSignUpError] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { login } = useAuth();

  const questions = [
    "What is your mother's maiden name?",
    "What is the name of your first pet?",
    "What was your first car?",
    "What elementary school did you attend?",
    "What is the name of the town where you were born?",
    "Where did you meet your spouse?"
  ];

  async function handleSubmit() {
    setSignUpError("");
    if (question1 === question2) {
      setSignUpError("Please select two different security questions.");
      return;
    }
    if(!name) return setSignUpError("Please fill in name field.");
    if(!email) return setSignUpError("Please fill in email field.");
    if(!password) return setSignUpError("Please fill in password field.");
    if(!answer1.length || !answer2) return setSignUpError("Please fill in answer field.");
    
    setIsSubmitting(true);

    try {
      const data = await signupUser({
        name,
        email,
        password,
        securityQuestions: [
          { question: question1, answer: answer1 }, 
          { question: question2, answer: answer2 }
        ]
      });
      const newAccessToken = data.token;
      const accountType = data.user.accountType
      await login(newAccessToken, null, accountType);
      router.replace("/")
    } catch (error) {
      setSignUpError("Sign up failed. Please make sure all fields are filled correctly.");
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  };

    return(
      <ThemedView style={styles.view} >
        <ThemedText type="title">Signup Screen</ThemedText>
        <ThemedTextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
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
              <ThemedText>👁️</ThemedText>
            </Pressable>
          }
        />
        <Picker
          selectedValue={question1}
          onValueChange={(itemValue) => setQuestion1(itemValue)}
          >
            <Picker.Item label="Select a question..." value="" />
            {questions.map((q) => (
              <Picker.Item key={q} label={q} value={q} />
            ))}
          </Picker>
        <ThemedTextInput
          placeholder="Answer"
          value={answer1}
          onChangeText={setAnswer1}
          autoCapitalize="none"
        />
        <Picker
          selectedValue={question2}
          onValueChange={(itemValue) => setQuestion2(itemValue)}
          >
            <Picker.Item label="Select a question..." value="" />
            {questions.map((q) => (
              <Picker.Item key={q} label={q} value={q} />
            ))}
          </Picker>
        <ThemedTextInput
          placeholder="Answer"
          value={answer2}
          onChangeText={setAnswer2}
          autoCapitalize="none"
        />
  
        <Button onPress={handleSubmit}>
          {isSubmitting ? "Signing up..." : "Sign up"}
        </Button>
  
        {signUpError ? <ThemedText style={styles.errorText}>{signUpError}</ThemedText> : null}
  
      </ThemedView>
    )
}

const styles = StyleSheet.create({
  view: {
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center",
    padding: 24,
    gap: 12,
  },
  eyeButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  errorText:{
    color: "red",
  }
});