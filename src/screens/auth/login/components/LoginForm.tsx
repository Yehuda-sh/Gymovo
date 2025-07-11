// src/screens/auth/login/components/LoginForm.tsx - טופס התחברות מעוצב

import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useEffect, useState } from "react";
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  Text,
  Dimensions,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { colors } from "../../../../theme/colors";
import { LoginFormProps, loginColors } from "../types";

const { width } = Dimensions.get("window");

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
  const emailIconRotate = useRef(new Animated.Value(0)).current;
  const passwordIconScale = useRef(new Animated.Value(1)).current;
  const errorShakeAnim = useRef(new Animated.Value(0)).current;

  // Focus animations
  useEffect(() => {
    Animated.timing(emailFocusAnim, {
      toValue: emailFocused ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    if (emailFocused) {
      Animated.spring(emailIconRotate, {
        toValue: 1,
        speed: 20,
        bounciness: 10,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(emailIconRotate, {
        toValue: 0,
        speed: 20,
        bounciness: 10,
        useNativeDriver: true,
      }).start();
    }
  }, [emailFocused]);

  useEffect(() => {
    Animated.timing(passwordFocusAnim, {
      toValue: passwordFocused ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [passwordFocused]);

  // Error shake animation
  useEffect(() => {
    if (error) {
      Animated.sequence([
        Animated.timing(errorShakeAnim, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(errorShakeAnim, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(errorShakeAnim, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(errorShakeAnim, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [error]);

  const handleTogglePasswordVisibility = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    Animated.sequence([
      Animated.timing(passwordIconScale, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(passwordIconScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onTogglePassword();
  };

  return (
    <Animated.View
      style={[
        styles.formSection,
        {
          transform: [
            { translateY: formSlide },
            { translateX: errorShakeAnim },
          ],
        },
      ]}
    >
      {/* Email Input */}
      <View style={styles.inputWrapper}>
        <Animated.View
          style={[
            styles.inputContainer,
            {
              transform: [
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
          {/* Animated border gradient */}
          <Animated.View
            style={[
              styles.inputBorderGradient,
              {
                opacity: emailFocusAnim,
              },
            ]}
          >
            <LinearGradient
              colors={["#667eea", "#764ba2"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientBorder}
            />
          </Animated.View>

          <BlurView intensity={20} style={styles.inputBlur}>
            <LinearGradient
              colors={[
                emailFocused ? "rgba(102,126,234,0.1)" : "rgba(0,0,0,0.4)",
                emailFocused ? "rgba(118,75,162,0.1)" : "rgba(0,0,0,0.3)",
              ]}
              style={styles.inputGradient}
            >
              {/* Icon with animation */}
              <Animated.View
                style={[
                  styles.inputIcon,
                  {
                    transform: [
                      {
                        rotate: emailIconRotate.interpolate({
                          inputRange: [0, 1],
                          outputRange: ["0deg", "360deg"],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={emailFocused ? "#667eea" : "rgba(255,255,255,0.5)"}
                />
              </Animated.View>

              <TextInput
                style={[styles.input, emailFocused && styles.inputFocused]}
                value={email}
                onChangeText={onEmailChange}
                placeholder="כתובת מייל"
                placeholderTextColor="rgba(255,255,255,0.4)"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                textAlign="right"
              />

              {/* Validation indicator */}
              {email.length > 0 && (
                <Animated.View
                  style={[
                    styles.validationIcon,
                    {
                      opacity: emailFocusAnim,
                    },
                  ]}
                >
                  <Ionicons
                    name={
                      email.includes("@") ? "checkmark-circle" : "close-circle"
                    }
                    size={20}
                    color={email.includes("@") ? "#00b894" : "#ff7675"}
                  />
                </Animated.View>
              )}
            </LinearGradient>
          </BlurView>
        </Animated.View>

        {/* Label */}
        <Animated.View
          style={[
            styles.labelContainer,
            {
              transform: [
                {
                  translateY: emailFocusAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -25],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={[styles.label, emailFocused && styles.labelFocused]}>
            אימייל
          </Text>
        </Animated.View>
      </View>

      {/* Password Input */}
      <View style={styles.inputWrapper}>
        <Animated.View
          style={[
            styles.inputContainer,
            {
              transform: [
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
          {/* Animated border gradient */}
          <Animated.View
            style={[
              styles.inputBorderGradient,
              {
                opacity: passwordFocusAnim,
              },
            ]}
          >
            <LinearGradient
              colors={["#667eea", "#764ba2"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientBorder}
            />
          </Animated.View>

          <BlurView intensity={20} style={styles.inputBlur}>
            <LinearGradient
              colors={[
                passwordFocused ? "rgba(102,126,234,0.1)" : "rgba(0,0,0,0.4)",
                passwordFocused ? "rgba(118,75,162,0.1)" : "rgba(0,0,0,0.3)",
              ]}
              style={styles.inputGradient}
            >
              {/* Lock icon */}
              <View style={styles.inputIcon}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={passwordFocused ? "#667eea" : "rgba(255,255,255,0.5)"}
                />
              </View>

              <TextInput
                style={[styles.input, passwordFocused && styles.inputFocused]}
                value={password}
                onChangeText={onPasswordChange}
                placeholder="סיסמה"
                placeholderTextColor="rgba(255,255,255,0.4)"
                secureTextEntry={!showPassword}
                editable={!isLoading}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                textAlign="right"
              />

              {/* Eye button with animation */}
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={handleTogglePasswordVisibility}
                disabled={isLoading}
              >
                <Animated.View
                  style={{
                    transform: [{ scale: passwordIconScale }],
                  }}
                >
                  <LinearGradient
                    colors={
                      showPassword
                        ? ["#667eea", "#764ba2"]
                        : ["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]
                    }
                    style={styles.eyeButtonGradient}
                  >
                    <Ionicons
                      name={showPassword ? "eye" : "eye-off"}
                      size={18}
                      color="#fff"
                    />
                  </LinearGradient>
                </Animated.View>
              </TouchableOpacity>
            </LinearGradient>
          </BlurView>
        </Animated.View>

        {/* Label */}
        <Animated.View
          style={[
            styles.labelContainer,
            {
              transform: [
                {
                  translateY: passwordFocusAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -25],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={[styles.label, passwordFocused && styles.labelFocused]}>
            סיסמה
          </Text>
        </Animated.View>

        {/* Password strength indicator */}
        {password.length > 0 && (
          <View style={styles.passwordStrength}>
            <View style={styles.strengthBar}>
              <LinearGradient
                colors={
                  password.length < 6
                    ? ["#ff7675", "#d63031"]
                    : password.length < 10
                    ? ["#fdcb6e", "#f39c12"]
                    : ["#00b894", "#00cec9"]
                }
                style={[
                  styles.strengthFill,
                  {
                    width: `${Math.min((password.length / 12) * 100, 100)}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.strengthText}>
              {password.length < 6
                ? "חלשה"
                : password.length < 10
                ? "בינונית"
                : "חזקה"}
            </Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  formSection: {
    width: "100%",
    gap: 24,
  },
  inputWrapper: {
    position: "relative",
  },
  inputContainer: {
    position: "relative",
    borderRadius: 16,
    overflow: "hidden",
  },
  inputBorderGradient: {
    position: "absolute",
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 18,
    zIndex: -1,
  },
  gradientBorder: {
    flex: 1,
    borderRadius: 18,
  },
  inputBlur: {
    borderRadius: 16,
    overflow: "hidden",
  },
  inputGradient: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 16 : 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  inputIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  inputFocused: {
    color: "#fff",
  },
  validationIcon: {
    marginRight: 8,
  },
  eyeButton: {
    padding: 4,
    marginRight: 8,
  },
  eyeButtonGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  labelContainer: {
    position: "absolute",
    right: 16,
    top: 18,
    backgroundColor: "#0a0a0a",
    paddingHorizontal: 8,
  },
  label: {
    fontSize: 14,
    color: "rgba(255,255,255,0.5)",
    fontWeight: "500",
  },
  labelFocused: {
    color: "#667eea",
  },
  passwordStrength: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginTop: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 2,
    overflow: "hidden",
  },
  strengthFill: {
    height: "100%",
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    fontWeight: "500",
  },
});

export default LoginForm;
