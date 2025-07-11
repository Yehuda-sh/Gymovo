// src/screens/auth/signup/components/SignupForm.tsx - פשוט ועובד

import React from "react";
import { Animated, StyleSheet, View } from "react-native";
import Input from "../../../../components/common/Input";
import { SignupFormProps } from "../types";

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
          style={styles.inputField}
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
          style={styles.inputField}
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
          style={styles.inputField}
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
    marginBottom: 20,
  },
  inputField: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderColor: "rgba(102, 126, 234, 0.4)",
    borderWidth: 1.5,
    borderRadius: 14,
    color: "#ffffff",
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 60,
  },
});

export default SignupForm;
