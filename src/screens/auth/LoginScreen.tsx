// src/screens/auth/LoginScreen.tsx - גרסה מלאה ומתוקנת

import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { Toast } from "../../components/common/Toast";
import { UserState, useUserStore } from "../../stores/userStore";
import { colors } from "../../theme/colors";
import { RootStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const { width } = Dimensions.get("window");

const LoginScreen = ({ navigation }: Props) => {
  const login = useUserStore((state: UserState) => state.login);

  // State management
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const headerScale = useRef(new Animated.Value(0.5)).current;
  const formSlide = useRef(new Animated.Value(300)).current;
  const keyboardOffset = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(headerScale, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(formSlide, {
        toValue: 0,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Keyboard listeners
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        Animated.timing(keyboardOffset, {
          toValue: -e.endCoordinates.height / 3,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        Animated.timing(keyboardOffset, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, [fadeAnim, formSlide, headerScale, keyboardOffset, slideAnim]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    setError(null);

    // Validation
    if (!email.trim()) {
      setError("נא להזין כתובת מייל");
      return;
    }

    if (!validateEmail(email)) {
      setError("כתובת המייל אינה תקינה");
      return;
    }

    if (!password || password.length < 6) {
      setError("הסיסמה חייבת להכיל לפחות 6 תווים");
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(email.toLowerCase().trim(), password);

      if (result.success) {
        Toast.success("ברוך הבא! 🎯 התחברת בהצלחה");
        // הניווט יתבצע אוטומטית דרך RootLayout
      } else {
        setError(result.error || "שגיאה בהתחברות");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError("שגיאה בלתי צפויה. נסה שוב מאוחר יותר");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.backgroundContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Animated.View
              style={[
                styles.content,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: keyboardOffset }],
                },
              ]}
            >
              {/* Header Section */}
              <Animated.View
                style={[
                  styles.headerSection,
                  {
                    transform: [
                      { translateY: slideAnim },
                      { scale: headerScale },
                    ],
                  },
                ]}
              >
                <View style={styles.logoContainer}>
                  <View style={styles.logoGlow} />
                  <View style={styles.logoFrame}>
                    <Ionicons
                      name="shield-checkmark"
                      size={40}
                      color={colors.primary}
                    />
                  </View>
                </View>

                <Text style={styles.title}>התחברות</Text>
                <Text style={styles.subtitle}>כניסה מאובטחת לחשבון שלך</Text>
                <View style={styles.accentLine} />
              </Animated.View>

              {/* Form Section */}
              <Animated.View
                style={[
                  styles.formSection,
                  { transform: [{ translateY: formSlide }] },
                ]}
              >
                <View style={styles.inputContainer}>
                  <Input
                    label="כתובת מייל"
                    value={email}
                    onChangeText={setEmail}
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
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    editable={!isLoading}
                    iconName="lock-closed-outline"
                    style={styles.input}
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    error={error && error.includes("סיסמה") ? error : undefined}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off" : "eye"}
                      size={18}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                </View>

                {/* Error Display */}
                {error && (
                  <Animated.View style={styles.errorContainer}>
                    <Ionicons name="warning" size={20} color={colors.danger} />
                    <Text style={styles.errorText}>{error}</Text>
                  </Animated.View>
                )}

                {/* Forgot Password */}
                <TouchableOpacity style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>שכחת סיסמה?</Text>
                </TouchableOpacity>
              </Animated.View>

              <View style={styles.spacer} />

              {/* Actions Section */}
              <View style={styles.actionsSection}>
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={styles.loadingText}>מתחבר...</Text>
                  </View>
                ) : (
                  <>
                    <Button
                      title="התחבר"
                      onPress={handleLogin}
                      disabled={isLoading}
                      variant="primary"
                      style={styles.loginButton}
                    />
                    <Button
                      title="חזור"
                      onPress={() => navigation.goBack()}
                      disabled={isLoading}
                      variant="outline"
                      style={styles.backButton}
                    />
                  </>
                )}

                {/* Sign up link */}
                <View style={styles.signupContainer}>
                  <Text style={styles.signupText}>אין לך חשבון? </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Signup")}
                  >
                    <Text style={styles.signupLink}>הירשם עכשיו</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backgroundContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 40,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    position: "relative",
    marginBottom: 24,
  },
  logoGlow: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    top: -20,
    left: -20,
    opacity: 0.2,
  },
  logoFrame: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 8,
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "Avenir-Heavy" : "sans-serif-condensed",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    marginBottom: 16,
  },
  accentLine: {
    width: 60,
    height: 3,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 3,
  },
  formSection: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 20,
    position: "relative",
  },
  input: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderColor: "rgba(0, 255, 136, 0.4)",
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
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderColor: "rgba(239, 68, 68, 0.3)",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
    textAlign: "right",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  spacer: {
    flex: 1,
    minHeight: 20,
  },
  actionsSection: {
    width: "100%",
    gap: 16,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  loadingText: {
    color: colors.primary,
    fontSize: 16,
    marginTop: 12,
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 18,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  backButton: {
    backgroundColor: "transparent",
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 18,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  signupText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
  },
  signupLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
});

export default LoginScreen;
