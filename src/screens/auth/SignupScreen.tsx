// src/screens/auth/SignupScreen.tsx - גרסה מבוססת רכיבים

import React, { useState } from "react";
import { Animated, ImageBackground, StatusBar, View } from "react-native";
import {
  ActionButtons,
  ErrorDisplay,
  HeaderSection,
  LoginPrompt,
  ProgressBar,
  SecurityNote,
  SignupForm,
  SignupScreenProps,
  useSignupAnimations,
  validateSignupForm,
} from "./signup";
import { signupStyles } from "./signup/styles";

const SignupScreen = ({ navigation }: SignupScreenProps) => {
  // State management
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Custom hooks
  const animations = useSignupAnimations();

  const handleProceedToQuiz = () => {
    setError(null);

    // Validation
    const validation = validateSignupForm(email, password, age);
    if (!validation.isValid) {
      setError(validation.error || "שגיאה בוולידציה");
      // Shake animation
      animations.playShakeAnimation();
      return;
    }

    // Success animation
    animations.playSuccessAnimation(() => {
      navigation.navigate("Quiz", {
        signupData: { email, password, age: parseInt(age, 10) },
      });
    });
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
    <View style={signupStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Background */}
      <ImageBackground
        source={require("../../../assets/images/backgrounds/welcome-bg.png")}
        style={signupStyles.backgroundImage}
        resizeMode="cover"
      >
        <View style={signupStyles.overlay} />

        {/* Progress Bar */}
        <ProgressBar
          progressAnim={animations.progressAnim}
          currentStep={1}
          totalSteps={3}
        />

        {/* Content */}
        <Animated.View
          style={[
            signupStyles.content,
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
          <View style={signupStyles.spacer} />

          {/* Actions Section */}
          <ActionButtons onNext={handleProceedToQuiz} onBack={handleBack} />

          {/* Login link */}
          <LoginPrompt onLoginPress={handleLogin} />
        </Animated.View>
      </ImageBackground>
    </View>
  );
};

export default SignupScreen;
