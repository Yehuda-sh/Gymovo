// src/screens/auth/SignupScreen.tsx - גרסה מקצועית

import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ImageBackground,
  Keyboard,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { colors } from "../../theme/colors";
import { RootStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Signup">;

const { width, height } = Dimensions.get("window");

const SignupScreen = ({ navigation }: Props) => {
  // State management
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const headerScale = useRef(new Animated.Value(0.5)).current;
  const formSlide = useRef(new Animated.Value(300)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const keyboardOffset = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animations
    Animated.sequence([
      // Phase 1: Header מלמעלה
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
      // Phase 2: Form מלמטה
      Animated.spring(formSlide, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      // Phase 3: Progress bar
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: false, // false כי זה width
      }),
    ]).start();

    // Keyboard listeners
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        Animated.timing(keyboardOffset, {
          toValue: -event.endCoordinates.height / 4,
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

  const handleProceedToQuiz = () => {
    setError(null);
    const ageNum = parseInt(age, 10);

    // Validation עם אנימציות
    if (!email.trim() || !password.trim() || !age.trim()) {
      setError("נא למלא את כל השדות");
      // Shake animation
      Animated.sequence([
        Animated.timing(formSlide, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(formSlide, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(formSlide, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    if (!email.includes("@")) {
      setError("כתובת המייל אינה תקינה");
      return;
    }

    if (password.length < 6) {
      setError("הסיסמה חייבת להכיל לפחות 6 תווים");
      return;
    }

    if (isNaN(ageNum) || ageNum < 16) {
      setError("הגיל המינימלי להרשמה הוא 16");
      return;
    }

    // Success animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(headerScale, {
        toValue: 1.1,
        tension: 100,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.navigate("Quiz", {
        signupData: { email, password, age: ageNum },
      });
    });
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "33%"], // שלב 1 מתוך 3
  });

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

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <Animated.View
              style={[styles.progressFill, { width: progressWidth }]}
            />
          </View>
          <Text style={styles.progressText}>שלב 1 מתוך 3</Text>
        </View>

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
                <Ionicons name="person-add" size={40} color={colors.primary} />
              </View>
            </View>

            <Text style={styles.title}>הרשמה</Text>
            <Text style={styles.subtitle}>הצטרף לקהילת הכושר המתקדמת</Text>
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
                iconName="mail-outline"
                style={styles.input}
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                placeholder="example@gmail.com"
              />
            </View>

            <View style={styles.inputContainer}>
              <Input
                label="סיסמה (6 תווים לפחות)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                iconName="lock-closed-outline"
                style={styles.input}
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                placeholder="סיסמה חזקה"
              />
            </View>

            <View style={styles.inputContainer}>
              <Input
                label="גיל"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
                iconName="body-outline"
                style={styles.input}
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                placeholder="25"
                maxLength={2}
              />
            </View>

            {/* Error Display */}
            {error && (
              <Animated.View style={styles.errorContainer}>
                <Ionicons name="warning" size={20} color={colors.danger} />
                <Text style={styles.errorText}>{error}</Text>
              </Animated.View>
            )}

            {/* Security Note */}
            <View style={styles.securityNote}>
              <Ionicons
                name="shield-checkmark"
                size={16}
                color={colors.primary}
              />
              <Text style={styles.securityText}>
                הנתונים שלך מוגנים בהצפנה מתקדמת
              </Text>
            </View>
          </Animated.View>

          {/* Spacer */}
          <View style={styles.spacer} />

          {/* Actions Section */}
          <View style={styles.actionsSection}>
            <Button
              title="המשך לשאלון"
              onPress={handleProceedToQuiz}
              variant="primary"
              style={styles.nextButton}
            />
            <Button
              title="חזור"
              onPress={() => navigation.goBack()}
              variant="outline"
              style={styles.backButton}
            />

            {/* Login link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>יש לך כבר חשבון? </Text>
              <Text
                style={styles.loginLink}
                onPress={() => navigation.navigate("Login")}
              >
                התחבר כאן
              </Text>
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
  progressContainer: {
    position: "absolute",
    top: 60,
    left: 32,
    right: 32,
    zIndex: 1,
  },
  progressBackground: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  progressText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
    fontWeight: "500",
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 120, // מקום לprogress bar
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
  securityNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 255, 136, 0.1)",
    borderColor: "rgba(0, 255, 136, 0.3)",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  securityText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    marginLeft: 8,
    fontWeight: "500",
  },
  spacer: {
    minHeight: 20,
  },
  actionsSection: {
    width: "100%",
    gap: 16,
  },
  nextButton: {
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
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  loginText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
  },
  loginLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
});

export default SignupScreen;
