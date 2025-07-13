// src/screens/auth/login/components/LoginForm.tsx - תיקון סופי ללא כפילויות

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
import { LoginFormProps } from "../types";

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
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(errorShakeAnim, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(errorShakeAnim, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(errorShakeAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [error]);

  // Toggle password visibility
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

  const getPasswordStrengthColor = () => {
    if (password.length < 6) return ["#ff3366", "#ff5252"];
    if (password.length < 10) return ["#FFB74D", "#F57C00"];
    return ["#00E676", "#00B248"];
  };

  const getPasswordStrengthText = () => {
    if (password.length === 0) return "";
    if (password.length < 6) return "חלשה";
    if (password.length < 10) return "בינונית";
    return "חזקה";
  };

  const passwordStrengthPercentage = Math.min(
    (password.length / 12) * 100,
    100
  );

  // קביעת האם להציג placeholder
  const shouldShowEmailPlaceholder = !emailFocused && !email;
  const shouldShowPasswordPlaceholder = !passwordFocused && !password;

  return (
    <Animated.View
      style={[
        styles.container,
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
              {/* Email icon */}
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
                style={styles.input}
                value={email}
                onChangeText={onEmailChange}
                placeholder={shouldShowEmailPlaceholder ? "אימייל" : ""}
                placeholderTextColor="rgba(255,255,255,0.4)"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                textAlign="right"
              />

              {/* Email validation icon */}
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
                      email.includes("@") && email.includes(".")
                        ? "checkmark-circle"
                        : "close-circle"
                    }
                    size={20}
                    color={
                      email.includes("@") && email.includes(".")
                        ? "#00b894"
                        : "#ff7675"
                    }
                  />
                </Animated.View>
              )}
            </LinearGradient>
          </BlurView>
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
                style={styles.input}
                value={password}
                onChangeText={onPasswordChange}
                placeholder={shouldShowPasswordPlaceholder ? "סיסמה" : ""}
                placeholderTextColor="rgba(255,255,255,0.4)"
                secureTextEntry={!showPassword}
                editable={!isLoading}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                textAlign="right"
              />

              {/* Eye button */}
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

        {/* Password strength indicator */}
        {password.length > 0 && (
          <View style={styles.passwordStrength}>
            <View style={styles.strengthBar}>
              <LinearGradient
                colors={
                  getPasswordStrengthColor() as [string, string, ...string[]]
                }
                style={[
                  styles.strengthFill,
                  { width: `${passwordStrengthPercentage}%` },
                ]}
              />
            </View>
            <Text style={styles.strengthText}>{getPasswordStrengthText()}</Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  inputWrapper: {
    marginBottom: 16,
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 16 : 12,
    borderRadius: 16,
  },
  inputIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  eyeButton: {
    marginRight: 8,
  },
  eyeButtonGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  validationIcon: {
    marginRight: 8,
  },
  passwordStrength: {
    marginTop: 8,
    paddingHorizontal: 16,
  },
  strengthBar: {
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
    color: "rgba(255,255,255,0.5)",
    marginTop: 4,
    textAlign: "right",
  },
});

export default LoginForm;
