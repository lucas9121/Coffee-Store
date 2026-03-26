import { useState } from "react";
import { 
  StyleSheet, 
  Pressable, 
  Modal, 
  TouchableWithoutFeedback, 
  Keyboard, 
  KeyboardAvoidingView, 
  Platform } from "react-native";
import { Button } from "@react-navigation/elements";
import { useRouter } from "expo-router";

import { ThemedView } from "@/components/ui/themed-view";
import { ThemedScrollView } from "@/components/ui/themed-scroll-view";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedTextInput } from "@/components/ui/themed-text-input";
import { signupUser } from "@/services/auth-api";
import { useAuth } from "@/context/AuthContext";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function SignUpScreen(){
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [question1, setQuestion1] = useState<string>("");
  const [answer1, setAnswer1] = useState<string>("");
  const [question2, setQuestion2] = useState<string>("");
  const [answer2, setAnswer2] = useState<string>("");
  const [questionModalVisible, setQuestionModalVisible] = useState(false);
  const [activeQuestionField, setActiveQuestionField] = useState<1 | 2 | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [signUpError, setSignUpError] = useState("");
  const { login } = useAuth();
  const borderColor = useThemeColor({}, "border");
  const backgroundColor = useThemeColor({}, "background")

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
    if(!name) return setSignUpError("Please complete all fields before continuing.");
    if(!email) return setSignUpError("Please make sure all fields are filled correctly.");
    if(!password) return setSignUpError("Please complete all fields before continuing.");
    if(!answer1.length || !answer2) return setSignUpError("Please complete all fields before continuing.");
    if (question1 === question2) return setSignUpError("Please select two different security questions.");
    
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

  function openQuestionPicker(field: 1 | 2) {
  setActiveQuestionField(field);
  setQuestionModalVisible(true);
  }

  function handleSelectQuestion(question: string) {
    if (activeQuestionField === 1) {
      setQuestion1(question);
    } else if (activeQuestionField === 2) {
      setQuestion2(question);
    }

    setQuestionModalVisible(false);
    setActiveQuestionField(null);
  }

    return(
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView 
          style={{flex: 1}}
          behavior={Platform.OS === "ios" ? "padding": undefined}
        >
          <ThemedScrollView contentContainerStyle={styles.view} keyboardShouldPersistTaps="handled">
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
            <ThemedText> Security Question 1</ThemedText>
            <Pressable
              onPress={() => openQuestionPicker(1)}
              style={[
                styles.questionField,
                {
                  borderColor,
                  backgroundColor,
                },
              ]}
              >
                <ThemedText>
                  {question1 || "Select a question..."}
                </ThemedText>
              </Pressable>
            <ThemedTextInput
              placeholder="Answer"
              value={answer1}
              onChangeText={setAnswer1}
              autoCapitalize="none"
            />
            <ThemedText> Security Question 2</ThemedText>
            <Pressable
              onPress={() => openQuestionPicker(2)}
              style={[
                styles.questionField,
                {
                  borderColor,
                  backgroundColor,
                },
              ]}
              >
                <ThemedText>
                  {question2 || "Select a question..."}
                </ThemedText>
              </Pressable>
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

            <Modal
              visible={questionModalVisible}
              transparent
              animationType="slide"
              onRequestClose={() => {
                setQuestionModalVisible(false);
                setActiveQuestionField(null);
              }}
            >
              <ThemedView style={styles.modalOverlay}>
                <ThemedView style={styles.modalContent}>
                  <ThemedText type="subtitle">Select a security question</ThemedText>

                  {questions.map((q) => (
                    <Pressable
                      key={q}
                      onPress={() => handleSelectQuestion(q)}
                      style={styles.questionOption}
                    >
                      <ThemedText>{q}</ThemedText>
                    </Pressable>
                  ))}

                  <Pressable
                    onPress={() => {
                      setQuestionModalVisible(false);
                      setActiveQuestionField(null);
                    }}
                    style={styles.cancelButton}
                  >
                    <ThemedText>Cancel</ThemedText>
                  </Pressable>
                </ThemedView>
              </ThemedView>
            </Modal>
          </ThemedScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

    )
}

const styles = StyleSheet.create({
  view: {
    flexGrow: 1,
    padding: 24,
    gap: 12,
    justifyContent: "center"
  },

  eyeButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  errorText:{
    color: "red",
  },

  questionField: {
  width: "100%",
  paddingHorizontal: 12,
  paddingVertical: 14,
  borderWidth: 1,
  borderRadius: 8,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  modalContent: {
    padding: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    gap: 12,
  },

  questionOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },

  cancelButton: {
    marginTop: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
});