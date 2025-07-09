// src/screens/auth/signup/components/SignupForm.tsx

import React from "react";
import { Animated, StyleSheet, View } from "react-native";
import Input from "../../../../components/common/Input";
import { SignupFormProps, signupColors } from "../types";

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
      <View style={styles.inputContainer}>
        <Input
          label="כתובת מייל"
          value={email}
          onChangeText={onEmailChange}
          keyboardType="email-address"
          autoCapitalize="none"
          iconName="mail-outline"
          style={styles.input}
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          placeholder="example@gmail.com"
          error={error && error.includes("מייל") ? error : undefined}
        />
      </View>

      <View style={styles.inputContainer}>
        <Input
          label="סיסמה (6 תווים לפחות)"
          value={password}
          onChangeText={onPasswordChange}
          secureTextEntry
          iconName="lock-closed-outline"
          style={styles.input}
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          placeholder="סיסמה חזקה"
          error={error && error.includes("סיסמה") ? error : undefined}
        />
      </View>

      <View style={styles.inputContainer}>
        <Input
          label="גיל"
          value={age}
          onChangeText={onAgeChange}
          keyboardType="numeric"
          iconName="body-outline"
          style={styles.input}
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          placeholder="25"
          maxLength={2}
          error={error && error.includes("גיל") ? error : undefined}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  formSection: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: signupColors.inputBackground,
    borderColor: signupColors.inputBorder,
    borderWidth: 1,
    borderRadius: 12,
    color: "#ffffff",
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
});

export default SignupForm;
