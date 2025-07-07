// src/screens/auth/WelcomeScreen.tsx - גרסה מתוקנת ללא שגיאות

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useRef } from "react";
import {
  Animated,
  DevSettings,
  Dimensions,
  ImageBackground,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../../components/common/Button";
import { clearAllData } from "../../data/storage";
import { UserState, useUserStore } from "../../stores/userStore";
import { RootStackParamList } from "../../types/navigation";
import { User } from "../../types/user";

const { width } = Dimensions.get("window"); // ✅ הסרת height שלא בשימוש

type Props = NativeStackScreenProps<RootStackParamList, "Welcome">;

// ✅ נתוני דמו מקומיים (פתרון זמני)
const mockDemoUsers: User[] = [
  {
    id: "demo-user-avi",
    email: "avi@gymovo.app",
    name: "אבי כהן",
    age: 28,
    experience: "intermediate",
    goals: ["muscle_gain", "strength"],
    joinedAt: "2024-10-01T00:00:00Z",
  },
  {
    id: "demo-user-maya",
    email: "maya@gymovo.app",
    name: "מאיה לוי",
    age: 32,
    experience: "advanced",
    goals: ["weight_loss", "endurance"],
    joinedAt: "2024-09-15T00:00:00Z",
  },
  {
    id: "demo-user-yoni",
    email: "yoni@gymovo.app",
    name: "יוני רוזן",
    age: 24,
    experience: "beginner",
    goals: ["general_fitness"],
    joinedAt: "2024-11-01T00:00:00Z",
  },
];

const WelcomeScreen = ({ navigation }: Props) => {
  const becomeGuest = useUserStore((state: UserState) => state.becomeGuest);
  const loginAsDemoUser = useUserStore(
    (state: UserState) => state.loginAsDemoUser
  );

  // אנימציות מתקדמות ומקצועיות
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.2)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const glowPulse = useRef(new Animated.Value(0.5)).current;
  const titleSlide = useRef(new Animated.Value(-50)).current;
  const subtitleSlide = useRef(new Animated.Value(50)).current;
  const buttonsSlide = useRef(new Animated.Value(100)).current;
  const particleFloat = useRef(new Animated.Value(0)).current;

  // ✅ פונקציית אנימציה מובקת עם useCallback
  const startAnimations = useCallback(() => {
    // אנימציית כניסה קינמטית מקצועית
    Animated.sequence([
      // Phase 1: Logo Entrance
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotate, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),

      // Phase 2: Text Slides
      Animated.parallel([
        Animated.spring(titleSlide, {
          toValue: 0,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(subtitleSlide, {
          toValue: 0,
          tension: 80,
          friction: 8,
          delay: 200,
          useNativeDriver: true,
        }),
      ]),

      // Phase 3: Buttons Entrance
      Animated.spring(buttonsSlide, {
        toValue: 0,
        tension: 80,
        friction: 8,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // תחילת אנימציות רקע רציפות
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowPulse, {
          toValue: 0.5,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(particleFloat, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(particleFloat, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [
    fadeAnim,
    logoScale,
    logoRotate,
    glowPulse,
    titleSlide,
    subtitleSlide,
    buttonsSlide,
    particleFloat,
  ]); // ✅ הוספת כל ה-dependencies

  useEffect(() => {
    startAnimations();
  }, [startAnimations]); // ✅ תיקון dependency array

  // פונקציה לאיפוס הנתונים (למפתחים בלבד)
  const resetAllData = async () => {
    try {
      await clearAllData();
      console.log("🗑️ All data cleared");

      // רענון האפליקציה במצב פיתוח
      if (__DEV__ && DevSettings) {
        DevSettings.reload();
      }
    } catch (error) {
      console.error("Failed to reset data:", error);
    }
  };

  // פונקציה לכניסה כמשתמש דמו
  const handleDemoLogin = async (demoUser: User) => {
    // ✅ תיקון טיפוס
    try {
      console.log(`🎭 Logging in as demo user: ${demoUser.name}`);
      await loginAsDemoUser(demoUser);
    } catch (error) {
      console.error("Failed to login as demo user:", error);
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

        {/* Floating particles effect */}
        <Animated.View
          style={[
            styles.particleContainer,
            {
              transform: [
                {
                  translateY: particleFloat.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -30],
                  }),
                },
              ],
            },
          ]}
        >
          {[...Array(8)].map((_, index) => (
            <View
              key={index}
              style={[
                styles.particle,
                {
                  left: (index * width) / 8,
                  opacity: 0.6,
                  transform: [
                    {
                      scale: 0.5 + (index % 3) * 0.3,
                    },
                  ],
                },
              ]}
            />
          ))}
        </Animated.View>

        {/* Content */}
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <Animated.View
              style={[
                styles.logoContainer,
                {
                  transform: [
                    { scale: logoScale },
                    {
                      rotate: logoRotate.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0deg", "360deg"],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Animated.View
                style={[
                  styles.logoGlow,
                  {
                    opacity: glowPulse,
                  },
                ]}
              />
              <View style={styles.logo}>
                <Text style={styles.logoText}>💪</Text>
              </View>
            </Animated.View>

            <Animated.View
              style={[
                styles.titleContainer,
                {
                  transform: [{ translateY: titleSlide }],
                },
              ]}
            >
              <Text style={styles.title}>Gymovo</Text>
              <View style={styles.accentLine} />
            </Animated.View>

            <Animated.View
              style={[
                styles.subtitleContainer,
                {
                  transform: [{ translateY: subtitleSlide }],
                },
              ]}
            >
              <Text style={styles.subtitle}>האפליקציה המחכה שתעשה גיינז</Text>
            </Animated.View>
          </View>

          <View style={styles.spacer} />

          {/* Actions Section */}
          <Animated.View
            style={[
              styles.actionsSection,
              {
                transform: [{ translateY: buttonsSlide }],
              },
            ]}
          >
            <View style={styles.primaryActions}>
              <Button
                title="הירשמו"
                onPress={() => navigation.navigate("Signup")}
                style={styles.primaryButton}
              />
              <Button
                title="התחברו"
                onPress={() => navigation.navigate("Login")}
                variant="outline"
                style={styles.secondaryButton}
              />
            </View>

            <Button
              title="המשיכו כאורח"
              onPress={becomeGuest}
              variant="outline"
              style={styles.guestButton}
            />

            {/* 🎭 כפתורי דמו למפתחים */}
            {__DEV__ && (
              <View style={styles.devPanel}>
                <View style={styles.devHeader}>
                  <View style={styles.devIndicator} />
                  <Text style={styles.devTitle}>DEV MODE</Text>
                  <View style={styles.devIndicator} />
                </View>

                <Text style={styles.demoSectionTitle}>🎭 משתמשי דמו</Text>
                <View style={styles.devActions}>
                  {mockDemoUsers.map((demoUser) => (
                    <TouchableOpacity
                      key={demoUser.id}
                      style={[
                        styles.devButton,
                        {
                          backgroundColor:
                            demoUser.experience === "beginner"
                              ? "rgba(34, 197, 94, 0.2)"
                              : demoUser.experience === "intermediate"
                              ? "rgba(251, 191, 36, 0.2)"
                              : "rgba(239, 68, 68, 0.2)",
                          borderColor:
                            demoUser.experience === "beginner"
                              ? "#22c55e"
                              : demoUser.experience === "intermediate"
                              ? "#fbbf24"
                              : "#ef4444",
                          borderWidth: 1,
                        },
                      ]}
                      onPress={() => handleDemoLogin(demoUser)}
                    >
                      <Text style={styles.demoButtonText}>{demoUser.name}</Text>
                      <Text style={styles.demoButtonSubtext}>
                        {demoUser.experience === "beginner"
                          ? "מתחיל"
                          : demoUser.experience === "intermediate"
                          ? "בינוני"
                          : "מתקדם"}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity
                  style={[
                    styles.resetButton,
                    {
                      backgroundColor: "rgba(239, 68, 68, 0.2)",
                      borderColor: "#ef4444",
                      borderWidth: 1,
                      marginTop: 8,
                    },
                  ]}
                  onPress={resetAllData}
                >
                  <Text style={styles.demoButtonText}>🗑️ איפוס נתונים</Text>
                  <Text style={styles.demoButtonSubtext}>מחק הכל ורענן</Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
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
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  particleContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  particle: {
    position: "absolute",
    width: 4,
    height: 4,
    backgroundColor: "#00ff88",
    borderRadius: 2,
    top: "20%",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 48,
    justifyContent: "space-between",
  },
  logoSection: {
    alignItems: "center",
    marginTop: 60,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  logoGlow: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#00ff88",
    shadowColor: "#00ff88",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(0, 255, 136, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#00ff88",
  },
  logoText: {
    fontSize: 36,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 8,
    fontFamily: Platform.OS === "ios" ? "Futura" : "sans-serif-condensed",
  },
  accentLine: {
    width: 60,
    height: 3,
    backgroundColor: "#00ff88",
    shadowColor: "#00ff88",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 3,
  },
  subtitleContainer: {
    alignItems: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
  },
  spacer: {
    flex: 1,
    minHeight: 40,
  },
  actionsSection: {
    gap: 16,
  },
  primaryActions: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#00ff88",
    borderRadius: 12,
    paddingVertical: 18,
    shadowColor: "#00ff88",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 18,
  },
  guestButton: {
    backgroundColor: "transparent",
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 16,
  },
  devPanel: {
    marginTop: 24,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  devHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    gap: 8,
  },
  devIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00ff88",
  },
  devTitle: {
    color: "#00ff88",
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  demoSectionTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  devActions: {
    gap: 8,
    marginBottom: 12,
  },
  devButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  demoButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  demoButtonSubtext: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    marginTop: 2,
    textAlign: "center",
  },
  resetButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
});

export default WelcomeScreen;
