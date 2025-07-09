// src/screens/auth/login/components/LoginForm.tsx

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import Input from "../../../../components/common/Input";
import { colors } from "../../../../theme/colors";
import { LoginFormProps, loginColors } from "../types";

const LoginForm: React.FC<LoginFormProps> = ({
  email,
  password,
  showPassword,
  isLoading,
  error,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
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
          editable={!isLoading}
          iconName="mail-outline"
          style={styles.input}
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          error={error && error.includes("מייל") ? error : undefined}
        />
      </View>

      <View style={styles.inputContainer}>
        <Input
          label="סיסמה"
          value={password}
          onChangeText={onPasswordChange}
          secureTextEntry={!showPassword}
          editable={!isLoading}
          iconName="lock-closed-outline"
          style={styles.input}
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          error={error && error.includes("סיסמה") ? error : undefined}
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={onTogglePassword}
          disabled={isLoading}
        >
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={18}
            color={colors.primary}
          />
        </TouchableOpacity>
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
    position: "relative",
  },
  input: {
    backgroundColor: loginColors.inputBackground,
    borderColor: loginColors.inputBorder,
    borderWidth: 1,
    borderRadius: 12,
    color: "#ffffff",
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    top: "65%",
    marginTop: -9,
    zIndex: 2,
    padding: 4,
  },
});

export default LoginForm;
