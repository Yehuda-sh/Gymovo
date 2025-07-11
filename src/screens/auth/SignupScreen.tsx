// src/screens/auth/SignupScreen.tsx
import React, { useState } from "react";
import {
  View,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Animated,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  HeaderSection,
  SignupForm,
  ActionButtons,
  ProgressBar,
  useSignupAnimations,
} from "./signup";

const colors = {
  background: "#1a1a2e",
  surface: "#16213e",
  gradientDark: "#0f3460",
};

interface SignupScreenProps {
  navigation: any;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [currentStep] = useState(1);
  const totalSteps = 3;

  // אנימציות
  const animations = useSignupAnimations();

  const handleNext = () => {
    // לוגיקת המשך
    console.log("Next step");
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* רקע גרדיינט */}
      <LinearGradient
        colors={[colors.background, colors.surface, colors.gradientDark]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Header Fixed עם Progress */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <ProgressBar
          progressAnim={animations.fadeAnim}
          currentStep={currentStep}
          totalSteps={totalSteps}
        />
      </View>

      {/* Main Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <HeaderSection
            fadeAnim={animations.fadeAnim}
            slideAnim={animations.slideAnim}
            headerScale={animations.headerScale}
          />

          <SignupForm
            email={email}
            password={password}
            age={age}
            error={null}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onAgeChange={setAge}
            formSlide={animations.fadeAnim}
          />

          <ActionButtons
            onNext={handleNext}
            onBack={handleBack}
            isLoading={false}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 24,
    paddingBottom: 10,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    paddingTop: 100,
  },
});

export default SignupScreen;
