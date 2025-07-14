// src/screens/auth/SignupScreen.tsx

import React, { useState } from "react";
import {
  View,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useUserStore } from "../../stores/userStore";
import { RootStackParamList } from "../../types/navigation";
import { Toast } from "../../components/common/Toast";

import {
  HeaderSection,
  SignupForm,
  ActionButtons,
  ProgressBar,
} from "./signup";
import { useSignupAnimations } from "./signup/components/useSignupAnimations";
import SignupErrorModal from "./signup/components/SignupErrorModal";

// Type safety for navigation
type SignupScreenProps = NativeStackScreenProps<RootStackParamList, "Signup">;

const colors = {
  background: "#1a1a2e",
  surface: "#16213e",
  gradientDark: "#0f3460",
};

const SignupScreen = ({ navigation }: SignupScreenProps) => {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("25");
  const [currentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState<string | null>(null);
  const totalSteps = 3;

  // Store reference - השתמש בפונקציה register החדשה
  const register = useUserStore((state) => state.register);

  // Animations
  const animations = useSignupAnimations();

  // Handle signup - עדכון לעבוד עם ה-store החדש
  const handleSignup = async () => {
    setLoading(true);
    setErrorModal(null);

    try {
      // קריאה לפונקציית register החדשה
      const result = await register(
        email.toLowerCase().trim(),
        password,
        name.trim(),
        parseInt(age) || 25
      );

      if (result.success) {
        Toast.success("ברוך הבא!", "נרשמת בהצלחה");

        // ניווט לשאלון
        navigation.navigate("Quiz", {
          signupData: {
            email: email.toLowerCase().trim(),
            password,
            age: parseInt(age) || 25,
            name: name.trim(),
          },
        });
      } else {
        setErrorModal(result.error || "שגיאה בהרשמה");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      setErrorModal(error.message || "שגיאה לא צפויה");
    } finally {
      setLoading(false);
    }
  };

  // Navigate to login
  const handleLoginPress = () => {
    navigation.navigate("Login");
  };

  // Navigate back
  const handleBack = () => {
    navigation.goBack();
  };

  // Close error modal
  const handleCloseErrorModal = () => {
    setErrorModal(null);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background Gradient */}
      <LinearGradient
        colors={[colors.background, colors.surface, colors.gradientDark]}
        style={StyleSheet.absoluteFillObject}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={[styles.content, { paddingTop: insets.top }]}>
          {/* Progress Bar */}
          <ProgressBar
            currentStep={currentStep}
            totalSteps={totalSteps}
            progressAnim={animations.progressAnim}
          />

          {/* Header */}
          <HeaderSection
            fadeAnim={animations.fadeAnim}
            slideAnim={animations.slideAnim}
            headerScale={animations.headerScale}
          />

          {/* Form */}
          <SignupForm
            email={email}
            password={password}
            age={age}
            error={errorModal}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onAgeChange={setAge}
            formSlide={animations.formSlide}
          />

          {/* Action Buttons */}
          <ActionButtons
            onNext={handleSignup}
            onBack={handleBack}
            isLoading={loading}
          />
        </View>
      </KeyboardAvoidingView>

      {/* Error Modal */}
      <SignupErrorModal
        visible={!!errorModal}
        error={errorModal || ""}
        onDismiss={handleCloseErrorModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
});

export default SignupScreen;
