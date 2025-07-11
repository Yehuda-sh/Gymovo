// src/screens/auth/signup/components/SignupForm.tsx - מתוקן ללא שגיאות

import React, { useRef, useEffect } from "react";
import { Animated, StyleSheet, View, Text, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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
  const focusAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Subtle breathing animation for form
    Animated.loop(
      Animated.sequence([
        Animated.timing(focusAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(focusAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [focusAnim]); // תיקון dependencies

  const renderEnhancedInput = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    icon: keyof typeof Ionicons.glyphMap,
    placeholder: string,
    keyboardType: "default" | "email-address" | "numeric" = "default",
    secureTextEntry = false,
    maxLength?: number
  ) => {
    const hasError = error && error.toLowerCase().includes(label.toLowerCase());
    const hasValue = value.length > 0;

    return (
      <View style={styles.inputContainer}>
        {/* Enhanced Input with Better Contrast */}
        <View style={styles.inputWrapper}>
          {/* Background Gradient */}
          <LinearGradient
            colors={
              hasError
                ? ["rgba(255, 51, 102, 0.15)", "rgba(255, 107, 157, 0.15)"]
                : hasValue
                ? ["rgba(102, 126, 234, 0.15)", "rgba(118, 75, 162, 0.15)"]
                : ["rgba(255, 255, 255, 0.08)", "rgba(255, 255, 255, 0.04)"]
            }
            style={styles.inputBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />

          {/* Border Gradient */}
          <LinearGradient
            colors={
              hasError
                ? ["#ff3366", "#ff6b9d"]
                : hasValue
                ? ["#667eea", "#764ba2"]
                : ["rgba(255, 255, 255, 0.2)", "rgba(255, 255, 255, 0.1)"]
            }
            style={styles.inputBorder}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.inputInner}>
              {/* Icon */}
              <View style={styles.iconContainer}>
                <Ionicons
                  name={icon}
                  size={22}
                  color={
                    hasError
                      ? "#ff3366"
                      : hasValue
                      ? "#667eea"
                      : "rgba(255, 255, 255, 0.6)"
                  }
                />
              </View>

              {/* Input Content */}
              <View style={styles.inputContent}>
                {/* Label - Always Visible and Clear */}
                <Text
                  style={[
                    styles.inputLabel,
                    {
                      color: hasError
                        ? "#ff3366"
                        : hasValue
                        ? "#667eea"
                        : "rgba(255, 255, 255, 0.8)", // Increased opacity for better visibility
                    },
                  ]}
                >
                  {label}
                </Text>

                {/* TextInput */}
                <TextInput
                  value={value}
                  onChangeText={onChangeText}
                  keyboardType={keyboardType}
                  secureTextEntry={secureTextEntry}
                  placeholder={placeholder}
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  maxLength={maxLength}
                  autoCapitalize="none"
                  style={[
                    styles.textInput,
                    {
                      color: hasValue ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                    },
                  ]}
                />
              </View>

              {/* Status Indicator */}
              <View style={styles.statusContainer}>
                {hasValue && !hasError && (
                  <Ionicons name="checkmark-circle" size={20} color="#00ff88" />
                )}
                {hasError && (
                  <Ionicons name="alert-circle" size={20} color="#ff3366" />
                )}
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Error Message */}
        {hasError && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={16} color="#ff3366" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <Animated.View
      style={[
        styles.formSection,
        {
          transform: [{ translateY: formSlide }],
        },
      ]}
    >
      {/* Email Input - Enhanced for better visibility */}
      {renderEnhancedInput(
        "כתובת מייל",
        email,
        onEmailChange,
        "mail-outline",
        "example@gmail.com",
        "email-address"
      )}

      {/* Password Input */}
      {renderEnhancedInput(
        "סיסמה",
        password,
        onPasswordChange,
        "lock-closed-outline",
        "6 תווים לפחות",
        "default",
        true
      )}

      {/* Age Input */}
      {renderEnhancedInput(
        "גיל",
        age,
        onAgeChange,
        "body-outline",
        "25",
        "numeric",
        false,
        2
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  formSection: {
    width: "100%",
    paddingVertical: 8,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputWrapper: {
    position: "relative",
    borderRadius: 16,
    overflow: "hidden",
  },
  inputBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  inputBorder: {
    padding: 2,
    borderRadius: 16,
  },
  inputInner: {
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Darker background for better contrast
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 18,
    minHeight: 70,
  },
  iconContainer: {
    marginRight: 12,
    width: 28,
    alignItems: "center",
  },
  inputContent: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "700", // Bolder font for better visibility
    marginBottom: 6,
    textAlign: "right",
    letterSpacing: -0.2,
  },
  textInput: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "right",
    includeFontPadding: false,
    padding: 0,
    margin: 0,
    minHeight: 24,
  },
  statusContainer: {
    marginLeft: 8,
    width: 24,
    alignItems: "center",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 51, 102, 0.1)",
    borderRadius: 8,
    paddingVertical: 8,
  },
  errorText: {
    color: "#ff3366",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 6,
    textAlign: "right",
    flex: 1,
  },
});

export default SignupForm;
