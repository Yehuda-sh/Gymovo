// src/screens/auth/signup/components/SignupForm.tsx
import React, { useState } from "react";
import {
  Animated,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SignupFormProps } from "../types";

const colors = {
  text: "#FFFFFF",
  textMuted: "rgba(255, 255, 255, 0.6)",
  inputBorder: "rgba(255, 255, 255, 0.2)",
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
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Animated.View
      style={[
        styles.formSection,
        {
          opacity: formSlide,
          transform: [
            {
              translateY: formSlide.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            },
          ],
        },
      ]}
    >
      {/* Email */}
      <View style={styles.inputWrapper}>
        <View style={styles.inputContainer}>
          <Ionicons
            name="mail-outline"
            size={18}
            color={colors.textMuted}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="example@gmail.com"
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={onEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <Text style={styles.inputLabel}>כתובת מייל</Text>
      </View>

      {/* Password */}
      <View style={styles.inputWrapper}>
        <View style={styles.inputContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={18}
            color={colors.textMuted}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="סיסמה חזקה"
            placeholderTextColor={colors.textMuted}
            value={password}
            onChangeText={onPasswordChange}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={18}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.inputLabel}>סיסמה (6 תווים לפחות)</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  formSection: {
    marginBottom: 24,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  eyeButton: {
    padding: 4,
  },
  inputLabel: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 4,
    textAlign: "right",
  },
});

export default SignupForm;
