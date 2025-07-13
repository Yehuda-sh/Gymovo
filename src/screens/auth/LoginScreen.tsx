// src/screens/auth/LoginScreen.tsx - מסך התחברות קומפקטי ללא גלילה

import React, { useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  View,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Toast } from "../../components/common/Toast";
import { UserState, useUserStore } from "../../stores/userStore";
import {
  ActionButtons,
  ErrorDisplay,
  ForgotPasswordLink,
  HeaderSection,
  LoginForm,
  LoginScreenProps,
  SignupPrompt,
  useLoginAnimations,
  validateLoginForm,
} from "./login";
// import { loginStyles } from "./login/styles";
// ייבוא רכיב BackgroundGradient ממסך Welcome
import { BackgroundGradient } from "./welcome/components";

const { height } = Dimensions.get("window");

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const login = useUserStore((state: UserState) => state.login);

  // State management
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Custom hooks for animations
  const animations = useLoginAnimations();

  // Handle login
  const handleLogin = async () => {
    setError(null);

    // Validation
    const validation = validateLoginForm(email, password);
    if (!validation.isValid) {
      setError(validation.error || "שגיאה בוולידציה");
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(email.toLowerCase().trim(), password);

      if (result.success) {
        Toast.success("ברוך הבא! 🎯 התחברת בהצלחה");
        // הניווט יתבצע אוטומטית דרך RootLayout
      } else {
        setError(result.error || "שגיאה בהתחברות");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError("שגיאה בלתי צפויה. נסה שוב מאוחר יותר");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle forgot password
  const handleForgotPassword = () => {
    Toast.info("תכונה זו תהיה זמינה בקרוב");
  };

  // Handle navigation to signup
  const handleSignup = () => {
    navigation.navigate("Signup");
  };

  // Handle back navigation
  const handleBack = () => {
    navigation.goBack();
  };

  // Toggle password visibility
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  // Dismiss error
  const handleDismissError = () => {
    setError(null);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* רקע גרדיאנט */}
      <BackgroundGradient visible={true} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: animations.fadeAnim,
            },
          ]}
        >
          {/* Header Section - לוגו וכותרת */}
          <View style={styles.headerWrapper}>
            <HeaderSection
              fadeAnim={animations.fadeAnim}
              slideAnim={animations.slideAnim}
              headerScale={animations.headerScale}
            />
          </View>

          {/* Form Container */}
          <View style={styles.formWrapper}>
            {/* Form Section - טופס התחברות */}
            <LoginForm
              email={email}
              password={password}
              showPassword={showPassword}
              isLoading={isLoading}
              error={error}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onTogglePassword={handleTogglePassword}
              formSlide={animations.formSlide}
            />

            {/* Error Display - הצגת שגיאות */}
            {error && (
              <ErrorDisplay error={error} onDismiss={handleDismissError} />
            )}

            {/* Forgot Password Link */}
            <ForgotPasswordLink onPress={handleForgotPassword} />
          </View>

          {/* Bottom Section */}
          <View style={styles.bottomWrapper}>
            {/* Action Buttons - כפתורי פעולה */}
            <ActionButtons
              isLoading={isLoading}
              onLogin={handleLogin}
              onBack={handleBack}
            />

            {/* Sign up link - קישור להרשמה */}
            <SignupPrompt onSignupPress={handleSignup} />
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
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
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    paddingBottom: Platform.OS === "ios" ? 30 : 20,
  },
  headerWrapper: {
    flex: 1,
    maxHeight: height * 0.25, // 25% מגובה המסך
    justifyContent: "center" as const,
  },
  formWrapper: {
    flex: 2,
    justifyContent: "center" as const,
    maxHeight: height * 0.4, // 40% מגובה המסך
  },
  bottomWrapper: {
    flex: 1,
    justifyContent: "flex-end" as const,
    maxHeight: height * 0.25, // 25% מגובה המסך
  },
});

export default LoginScreen;
