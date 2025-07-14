// src/screens/auth/LoginScreen.tsx - מסך התחברות קומפקטי ללא גלילה

import React, { useState, useCallback, useEffect } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  View,
  Dimensions,
  StyleSheet,
  Keyboard,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Toast } from "../../components/common/Toast";
import { UserState, useUserStore } from "../../stores/userStore";
import { RootStackParamList } from "../../types/navigation";
import {
  ActionButtons,
  ErrorDisplay,
  ForgotPasswordLink,
  HeaderSection,
  LoginForm,
  SignupPrompt,
  useLoginAnimations,
  validateLoginForm,
} from "./login";
// ייבוא רכיב BackgroundGradient ממסך Welcome
import { BackgroundGradient } from "./welcome/components";

const { height } = Dimensions.get("window");

// Type safety
type LoginScreenProps = NativeStackScreenProps<RootStackParamList, "Login">;

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const login = useUserStore((state: UserState) => state.login);

  // State management
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Custom hooks for animations
  const animations = useLoginAnimations();

  // Keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Handle login
  const handleLogin = useCallback(async () => {
    // Dismiss keyboard
    Keyboard.dismiss();
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
  }, [email, password, login]);

  // Handle forgot password
  const handleForgotPassword = useCallback(() => {
    Toast.info("תכונה זו תהיה זמינה בקרוב");
    // TODO: Navigate to forgot password screen when implemented
    // navigation.navigate("ForgotPassword");
  }, []);

  // Handle navigation to signup
  const handleSignup = useCallback(() => {
    navigation.navigate("Signup");
  }, [navigation]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Toggle password visibility
  const handleTogglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  // Dismiss error
  const handleDismissError = useCallback(() => {
    setError(null);
  }, []);

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
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: animations.fadeAnim,
            },
            // Adjust padding when keyboard is visible
            keyboardVisible && styles.contentWithKeyboard,
          ]}
        >
          {/* Header Section - לוגו וכותרת */}
          <View
            style={[
              styles.headerWrapper,
              keyboardVisible && styles.headerWrapperCompact,
            ]}
          >
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
          {!keyboardVisible && (
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
          )}
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
  contentWithKeyboard: {
    paddingBottom: 10,
  },
  headerWrapper: {
    flex: 1,
    maxHeight: height * 0.25, // 25% מגובה המסך
    justifyContent: "center",
  },
  headerWrapperCompact: {
    maxHeight: height * 0.15, // קטן יותר כשהמקלדת פתוחה
  },
  formWrapper: {
    flex: 2,
    justifyContent: "center",
    maxHeight: height * 0.4, // 40% מגובה המסך
  },
  bottomWrapper: {
    flex: 1,
    justifyContent: "flex-end",
    maxHeight: height * 0.25, // 25% מגובה המסך
  },
});

export default LoginScreen;
