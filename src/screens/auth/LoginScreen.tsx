// src/screens/auth/LoginScreen.tsx - גרסה מבוססת רכיבים

import React, { useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  View,
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
import { loginStyles } from "./login/styles";

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const login = useUserStore((state: UserState) => state.login);

  // State management
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Custom hooks
  const animations = useLoginAnimations();

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

  const handleForgotPassword = () => {
    // TODO: implement forgot password flow
    Toast.info("תכונה זו תהיה זמינה בקרוב");
  };

  const handleSignup = () => {
    navigation.navigate("Signup");
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleDismissError = () => {
    setError(null);
  };

  return (
    <View style={loginStyles.container}>
      <StatusBar barStyle="light-content" />

      <View style={loginStyles.backgroundContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={loginStyles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={loginStyles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Animated.View
              style={[
                loginStyles.content,
                {
                  opacity: animations.fadeAnim,
                  transform: [{ translateY: animations.keyboardOffset }],
                },
              ]}
            >
              {/* Header Section */}
              <HeaderSection
                fadeAnim={animations.fadeAnim}
                slideAnim={animations.slideAnim}
                headerScale={animations.headerScale}
              />

              {/* Form Section */}
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

              {/* Error Display */}
              <ErrorDisplay error={error} onDismiss={handleDismissError} />

              {/* Forgot Password */}
              <ForgotPasswordLink onPress={handleForgotPassword} />

              <View style={loginStyles.spacer} />

              {/* Actions Section */}
              <ActionButtons
                isLoading={isLoading}
                onLogin={handleLogin}
                onBack={handleBack}
              />

              {/* Sign up link */}
              <SignupPrompt onSignupPress={handleSignup} />
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export default LoginScreen;
