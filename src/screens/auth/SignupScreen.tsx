// src/screens/auth/SignupScreen.tsx - מחליף לגמרי את הקובץ הישן

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
import { NativeStackScreenProps } from "@react-navigation/native-stack";

// Local imports
import HeaderSection from "./signup/components/HeaderSection";
import SignupForm from "./signup/components/SignupForm";
import ActionButtons from "./signup/components/ActionButtons";
import ErrorDisplay from "./signup/components/ErrorDisplay";
import SecurityNote from "./signup/components/SecurityNote";
import LoginPrompt from "./signup/components/LoginPrompt";
import ProgressBar from "./signup/components/ProgressBar";
import { useSignupAnimations } from "./signup/components/useSignupAnimations";
import { validateSignupForm } from "./signup/components/ValidationUtils";
import { RootStackParamList } from "../../types/navigation";

const { height } = Dimensions.get("window");

type SignupScreenProps = NativeStackScreenProps<RootStackParamList, "Signup">;

/**
 * מסך הרשמה מלא ועובד - מחליף את הישן לגמרי
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

      {/* Floating Particles Background */}
      <View style={styles.particlesContainer}>
        {[...Array(12)].map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.backgroundParticle,
              {
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: animations.fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.2],
                }),
                transform: [
                  {
                    translateY: animations.fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, -20],
                    }),
                  },
                ],
              },
            ]}
          />
        ))}
      </View>

      {/* Progress Bar - בחלק העליון */}
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
            {/* Header Section - החלק החסר! */}
            <View style={styles.headerWrapper}>
              <HeaderSection
                fadeAnim={animations.fadeAnim}
                slideAnim={animations.slideAnim}
                headerScale={animations.headerScale}
              />
            </View>

            {/* Form Section */}
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

            {/* Error Display */}
            <ErrorDisplay error={error} onDismiss={handleDismissError} />

            {/* Security Note */}
            <SecurityNote visible={true} />

            {/* Spacer */}
            <View style={styles.spacer} />

            {/* Actions Section */}
            <View style={styles.actionsWrapper}>
              <ActionButtons
                onNext={handleProceedToQuiz}
                onBack={handleBack}
                isLoading={isLoading}
              />
            </View>

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
  particlesContainer: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: "none",
  },
  backgroundParticle: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(102, 126, 234, 0.4)",
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
