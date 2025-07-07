// src/screens/auth/LoginScreen.tsx - גרסה מקצועית

import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  ImageBackground,
  Keyboard,
  Platform,
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

const { width, height } = Dimensions.get("window");

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
  const slideAnim = useRef(new Animated.Value(-100)).current; // מלמעלה
  const headerScale = useRef(new Animated.Value(0.5)).current; // קטן יותר
  const formSlide = useRef(new Animated.Value(300)).current; // מלמטה רחוק יותר
  const keyboardOffset = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animations - משופרות ודרמטיות יותר
    Animated.sequence([
      // Phase 1: Fade in + Header מלמעלה
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(headerScale, {
          toValue: 1,
          tension: 40,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      // Phase 2: Form עולה מלמטה
      Animated.spring(formSlide, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Keyboard listeners
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        Animated.timing(keyboardOffset, {
          toValue: -event.endCoordinates.height / 3,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        Animated.timing(keyboardOffset, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("נא למלא את כל השדות");
      return;
    }

    setError(null);
    setIsLoading(true);

    // Loading animation
    const loadingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(headerScale, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(headerScale, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    loadingAnimation.start();

    try {
      const res = await login(email, password);
      loadingAnimation.stop();

      if (!res.success) {
        const errorMessage = res.error || "התחברות נכשלה, נסה שוב";
        setError(errorMessage);
        Toast.show(errorMessage, "error");
      } else {
        // Success animation
        Animated.sequence([
          Animated.spring(headerScale, {
            toValue: 1.1,
            tension: 100,
            friction: 5,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      }
    } catch (e) {
      loadingAnimation.stop();
      const errorMessage = "אירעה שגיאה בלתי צפויה";
      setError(errorMessage);
      Toast.show(errorMessage, "error");
    } finally {
      setIsLoading(false);
      Animated.timing(headerScale, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Background */}
      <ImageBackground
        source={require("../../../assets/images/backgrounds/welcome-bg.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        {/* Content */}
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
                transform: [{ translateY: slideAnim }, { scale: headerScale }],
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

          {/* Actions Section - הועבר למעלה */}
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
              <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <Text style={styles.signupLink}>הירשם כאן</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 80,
    paddingBottom: 40,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  logoGlow: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(0, 255, 136, 0.2)",
    shadowColor: "#00ff88",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 15,
  },
  logoFrame: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderWidth: 2,
    borderColor: "rgba(0, 255, 136, 0.6)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 8,
    fontFamily: Platform.OS === "ios" ? "Futura" : "sans-serif-condensed",
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
    backgroundColor: "rgba(0, 0, 0, 0.6)", // שינוי לרקע כהה
    borderColor: "rgba(0, 255, 136, 0.4)",
    borderWidth: 1,
    borderRadius: 12,
    color: "#ffffff", // טקסט לבן
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    top: "65%", // שינוי מ-50% ל-65% להתחשב בלייבל
    marginTop: -9,
    zIndex: 2,
    padding: 4, // הוספתי padding לקליק טוב יותר
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
    marginBottom: 24, // הגדלתי מ-8 ל-24
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  spacer: {
    minHeight: 20, // הוספתי minHeight במקום flex
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
