// src/screens/auth/SignupScreen.tsx - שומר על המבנה המודולרי + צבעים מ-WelcomeScreen

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

// השמירה על הimports המודולריים שלך!
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

// צבעים מ-WelcomeScreen
const welcomeColors = {
  background: "#1a1a2e",
  surface: "#16213e",
  primary: "#FF6B35",
  secondary: "#F7931E",
};

/**
 * מסך הרשמה - שומר על המבנה המודולרי + צבעים חדשים
 */
const SignupScreen = ({ navigation }: SignupScreenProps) => {
  const insets = useSafeAreaInsets();

  // State management (זהה לקוד שלך)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Custom hooks (זהה לקוד שלך)
  const animations = useSignupAnimations();

  // Handlers (זהים לקוד שלך)
  const handleProceedToQuiz = async () => {
    setError(null);
    setIsLoading(true);

    const validation = validateSignupForm(email, password, age);
    if (!validation.isValid) {
      setError(validation.error || "שגיאה בוולידציה");
      setIsLoading(false);
      animations.playShakeAnimation();
      return;
    }

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
      <StatusBar
        barStyle="light-content"
        backgroundColor={welcomeColors.background}
      />

      {/* Background Gradient - משופר עם צבעי WelcomeScreen */}
      <LinearGradient
        colors={[welcomeColors.background, welcomeColors.surface, "#0f3460"]}
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

      {/* Progress Bar - הרכיב שלך */}
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
            {/* Header Section - הרכיב שלך */}
            <View style={styles.headerWrapper}>
              <HeaderSection
                fadeAnim={animations.fadeAnim}
                slideAnim={animations.slideAnim}
                headerScale={animations.headerScale}
              />
            </View>

            {/* Form Section - הרכיב שלך */}
            <View style={styles.formWrapper}>
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
            </View>

            {/* Error Display - הרכיב שלך */}
            <ErrorDisplay error={error} onDismiss={handleDismissError} />

            {/* Security Note - הרכיב שלך */}
            <SecurityNote visible={true} />

            {/* Spacer */}
            <View style={styles.spacer} />

            {/* Actions Section - הרכיב שלך */}
            <View style={styles.actionsWrapper}>
              <ActionButtons
                onNext={handleProceedToQuiz}
                onBack={handleBack}
                isLoading={isLoading}
              />
            </View>

            {/* Login Prompt - הרכיב שלך */}
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
    backgroundColor: welcomeColors.background,
  },
  glowOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    minHeight: height * 0.9,
  },
  headerWrapper: {
    marginBottom: 32,
    marginTop: 20,
  },
  formWrapper: {
    marginBottom: 24,
  },
  actionsWrapper: {
    marginTop: 8,
  },
  spacer: {
    minHeight: 16,
  },
});

export default SignupScreen;
