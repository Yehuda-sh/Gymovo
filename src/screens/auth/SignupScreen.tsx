// src/screens/auth/SignupScreen.tsx - עיצוב משופר על בסיס WelcomeScreen

import React, { useState } from "react";
import {
  View,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  HeaderSection,
  SignupForm,
  ActionButtons,
  ErrorDisplay,
  SecurityNote,
  LoginPrompt,
  ProgressBar,
  SignupScreenProps,
  useSignupAnimations,
  validateSignupForm,
} from "./signup";

const { height } = Dimensions.get("window");

/**
 * מסך הרשמה משופר עם עיצוב זהה ל-WelcomeScreen
 * כולל רקע גרדיאנט, אנימציות מתקדמות ו-UX מלוטש
 */
const SignupScreen = ({ navigation }: SignupScreenProps) => {
  const insets = useSafeAreaInsets();

  // State management
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Custom hooks for animations
  const animations = useSignupAnimations();

  // Handlers
  const handleProceedToQuiz = async () => {
    setError(null);
    setIsLoading(true);

    // Validation
    const validation = validateSignupForm(email, password, age);
    if (!validation.isValid) {
      setError(validation.error || "שגיאה בוולידציה");
      setIsLoading(false);
      // Shake animation
      animations.playShakeAnimation();
      return;
    }

    // Simulate API call
    setTimeout(() => {
      animations.playSuccessAnimation(() => {
        navigation.navigate("Quiz", {
          signupData: { email, password, age: parseInt(age, 10) },
        });
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  const handleDismissError = () => {
    setError(null);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      {/* Background Gradient - זהה ל-WelcomeScreen */}
      <LinearGradient
        colors={["#1a1a2e", "#16213e", "#0f3460"]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Glow Effect */}
      <Animated.View
        style={[
          styles.glowOverlay,
          {
            opacity: animations.fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.05, 0.15],
            }),
          },
        ]}
      >
        <LinearGradient
          colors={["#667eea", "#764ba2"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>

      {/* Progress Bar */}
      <ProgressBar
        progressAnim={animations.progressAnim}
        currentStep={1}
        totalSteps={3}
      />

      {/* Main Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.content,
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
            <SignupForm
              email={email}
              password={password}
              age={age}
              error={error}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onAgeChange={setAge}
              formSlide={animations.formSlide}
            />

            {/* Error Display */}
            <ErrorDisplay error={error} onDismiss={handleDismissError} />

            {/* Security Note */}
            <SecurityNote visible={true} />

            {/* Spacer */}
            <View style={styles.spacer} />

            {/* Actions Section */}
            <ActionButtons
              onNext={handleProceedToQuiz}
              onBack={handleBack}
              isLoading={isLoading}
            />

            {/* Login Prompt */}
            <LoginPrompt onLoginPress={handleLogin} />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  glowOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingTop: 120, // מקום לprogress bar
  },
  content: {
    flex: 1,
    justifyContent: "center",
    minHeight: height * 0.8,
  },
  spacer: {
    minHeight: 20,
  },
});

export default SignupScreen;
