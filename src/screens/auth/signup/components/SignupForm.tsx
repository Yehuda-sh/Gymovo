// src/screens/auth/signup/components/SignupForm.tsx - צבעים מ-WelcomeScreen

import React from "react";
import { Animated, StyleSheet, View } from "react-native";
import Input from "../../../../components/common/Input";
import { SignupFormProps } from "../types";

// צבעים פשוטים וקלינים
const welcomeColors = {
  primary: "#FF6B35",
  // הסרת כל הרקעים - רק קווי מסגרת
  inputBorder: "rgba(255, 255, 255, 0.3)",
  inputBorderActive: "#FF6B35",
  inputBorderError: "#FF5252",
};

const SignupForm: React.FC<SignupFormProps> = ({
  email,
  password,
  age,
  error,
  onEmailChange,
  onPasswordChange,
  onAgeChange,
  formSlide,
}) => {
  return (
    <Animated.View
      style={[styles.formSection, { transform: [{ translateY: formSlide }] }]}
    >
      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Input
          label="כתובת מייל"
          value={email}
          onChangeText={onEmailChange}
          keyboardType="email-address"
          autoCapitalize="none"
          iconName="mail-outline"
          placeholder="example@gmail.com"
          error={error && error.includes("מייל") ? error : undefined}
          style={[
            styles.inputField,
            email.length > 0 && styles.inputFieldActive,
            error && error.includes("מייל") && styles.inputFieldError,
          ]}
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <Input
          label="סיסמה (6 תווים לפחות)"
          value={password}
          onChangeText={onPasswordChange}
          secureTextEntry
          iconName="lock-closed-outline"
          placeholder="סיסמה חזקה"
          error={error && error.includes("סיסמה") ? error : undefined}
          style={[
            styles.inputField,
            password.length > 0 && styles.inputFieldActive,
            error && error.includes("סיסמה") && styles.inputFieldError,
          ]}
        />
      </View>

      {/* Age Input */}
      <View style={styles.inputContainer}>
        <Input
          label="גיל"
          value={age}
          onChangeText={onAgeChange}
          keyboardType="numeric"
          iconName="body-outline"
          placeholder="25"
          maxLength={2}
          error={error && error.includes("גיל") ? error : undefined}
          style={[
            styles.inputField,
            age.length > 0 && styles.inputFieldActive,
            error && error.includes("גיל") && styles.inputFieldError,
          ]}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  formSection: {
    width: "100%",
    paddingVertical: 8,
  },
  inputContainer: {
    marginBottom: 18, // הקטנה מ-20
  },
  inputField: {
    backgroundColor: "transparent", // שקוף לגמרי
    borderColor: welcomeColors.inputBorder,
    borderWidth: 2,
    borderRadius: 14, // עגול יותר
    color: "#ffffff",
    fontSize: 16,
    paddingHorizontal: 18, // יותר padding
    paddingVertical: 16,
    minHeight: 56, // קצת יותר נמוך
  },
  inputFieldActive: {
    borderColor: welcomeColors.inputBorderActive,
    backgroundColor: "transparent", // נשאר שקוף
    shadowColor: welcomeColors.inputBorderActive,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  inputFieldError: {
    borderColor: welcomeColors.inputBorderError,
    backgroundColor: "transparent", // נשאר שקוף
    shadowColor: welcomeColors.inputBorderError,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
});

export default SignupForm;
