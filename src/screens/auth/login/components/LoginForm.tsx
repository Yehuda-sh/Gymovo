// src/screens/auth/login/components/LoginForm.tsx - טופס מעוצב בהשראת Welcome

import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useEffect, useState } from "react";
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  Text,
  Platform,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { LoginFormProps } from "../types";
import { loginColors } from "../styles/loginStyles";

const { height } = Dimensions.get("window");
const isSmallDevice = height < 700;

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
  // Animation states
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Animation refs
  const emailFocusAnim = useRef(new Animated.Value(0)).current;
  const passwordFocusAnim = useRef(new Animated.Value(0)).current;
  const emailShakeAnim = useRef(new Animated.Value(0)).current;
  const passwordShakeAnim = useRef(new Animated.Value(0)).current;

  // Focus animations
  useEffect(() => {
    Animated.spring(emailFocusAnim, {
      toValue: emailFocused ? 1 : 0,
      speed: 20,
      bounciness: 10,
      useNativeDriver: true,
    }).start();
  }, [emailFocused]);

  useEffect(() => {
    Animated.spring(passwordFocusAnim, {
      toValue: passwordFocused ? 1 : 0,
      speed: 20,
      bounciness: 10,
      useNativeDriver: true,
    }).start();
  }, [passwordFocused]);

  // Error shake animation
  useEffect(() => {
    if (error) {
      Animated.sequence([
        Animated.timing(emailShakeAnim, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(emailShakeAnim, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(emailShakeAnim, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(emailShakeAnim, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [error]);

  const handleTogglePassword = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onTogglePassword();
  };

  const handleFocus = (field: "email" | "password") => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (field === "email") {
      setEmailFocused(true);
    } else {
      setPasswordFocused(true);
    }
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
      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Animated.View
          style={[
            styles.inputWrapper,
            {
              transform: [
                { translateX: emailShakeAnim },
                {
                  scale: emailFocusAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.02],
                  }),
                },
              ],
            },
          ]}
        >
          <BlurView
            intensity={80}
            tint="dark"
            style={[
              styles.inputBackground,
              emailFocused && styles.inputFocused,
              error && styles.inputError,
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="אימייל"
              placeholderTextColor={loginColors.textMuted}
              value={email}
              onChangeText={onEmailChange}
              onFocus={() => handleFocus("email")}
              onBlur={() => setEmailFocused(false)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
              returnKeyType="next"
            />
            <Animated.View
              style={[
                styles.inputIcon,
                {
                  transform: [
                    {
                      scale: emailFocusAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.2],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={22}
                color={
                  emailFocused ? loginColors.primary : loginColors.textMuted
                }
              />
            </Animated.View>
          </BlurView>
        </Animated.View>
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <Animated.View
          style={[
            styles.inputWrapper,
            {
              transform: [
                { translateX: passwordShakeAnim },
                {
                  scale: passwordFocusAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.02],
                  }),
                },
              ],
            },
          ]}
        >
          <BlurView
            intensity={80}
            tint="dark"
            style={[
              styles.inputBackground,
              passwordFocused && styles.inputFocused,
              error && styles.inputError,
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="סיסמה"
              placeholderTextColor={loginColors.textMuted}
              value={password}
              onChangeText={onPasswordChange}
              onFocus={() => handleFocus("password")}
              onBlur={() => setPasswordFocused(false)}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
              returnKeyType="go"
            />
            <Animated.View
              style={[
                styles.inputIcon,
                {
                  transform: [
                    {
                      scale: passwordFocusAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.2],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={22}
                color={
                  passwordFocused ? loginColors.primary : loginColors.textMuted
                }
              />
            </Animated.View>
            <TouchableOpacity
              style={styles.passwordToggle}
              onPress={handleTogglePassword}
              activeOpacity={0.7}
            >
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={22}
                color={loginColors.textMuted}
              />
            </TouchableOpacity>
          </BlurView>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  formSection: {
    width: "100%",
    marginBottom: isSmallDevice ? 16 : 24,
  },
  inputContainer: {
    marginBottom: isSmallDevice ? 14 : 18,
  },
  inputWrapper: {
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  inputBackground: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 14,
    overflow: "hidden",
  },
  inputFocused: {
    borderColor: loginColors.primary,
    borderWidth: 1.5,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  inputError: {
    borderColor: loginColors.danger,
    borderWidth: 2,
  },
  input: {
    height: isSmallDevice ? 52 : 56,
    paddingHorizontal: 52,
    fontSize: isSmallDevice ? 15 : 16,
    color: loginColors.text,
    fontWeight: "500",
    textAlign: "right",
  },
  inputIcon: {
    position: "absolute",
    right: 18,
    top: isSmallDevice ? 15 : 17,
  },
  passwordToggle: {
    position: "absolute",
    left: 14,
    top: isSmallDevice ? 11 : 13,
    padding: 6,
    zIndex: 1,
  },
});

export default LoginForm;
