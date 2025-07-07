// src/screens/auth/WelcomeScreen.tsx - ✅ מעודכן לשימוש בקובץ demoUsers המרכזי

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
import { demoUsers, getDemoUserById } from "../../constants/demoUsers"; // ✅ ייבוא מהקובץ המרכזי

const { width } = Dimensions.get("window");

type Props = NativeStackScreenProps<RootStackParamList, "Welcome">;

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
  const titleSlide = useRef(new Animated.Value(50)).current;
  const subtitleSlide = useRef(new Animated.Value(30)).current;
  const buttonsSlide = useRef(new Animated.Value(100)).current;
  const particleFloat = useRef(new Animated.Value(0)).current;

  // 🎬 הפעלת אנימציות
  const startAnimations = useCallback(() => {
    // אנימציה ראשית
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(logoRotate, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(titleSlide, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(subtitleSlide, {
        toValue: 0,
        duration: 1400,
        useNativeDriver: true,
      }),
      Animated.timing(buttonsSlide, {
        toValue: 0,
        duration: 1600,
        useNativeDriver: true,
      }),
    ]).start();

    // אנימציית זוהר מתמשכת
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

    // אנימציית חלקיקים צפים
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
  ]);

  useEffect(() => {
    startAnimations();
  }, [startAnimations]);

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
    try {
      console.log(`🎭 Logging in as demo user: ${demoUser.name}`);
      await loginAsDemoUser(demoUser);
    } catch (error) {
      console.error("Failed to login as demo user:", error);
    }
  };

  // פונקציה לקבלת אייקון לפי רמת ניסיון
  const getExperienceIcon = (experience: string) => {
    switch (experience) {
      case "beginner":
        return "🌱";
      case "intermediate":
        return "💪";
      case "advanced":
        return "🔥";
      default:
        return "💯";
    }
  };

  // פונקציה לקבלת תיאור רמת ניסיון
  const getExperienceLabel = (experience: string) => {
    switch (experience) {
      case "beginner":
        return "מתחיל";
      case "intermediate":
        return "בינוני";
      case "advanced":
        return "מתקדם";
      default:
        return "כללי";
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
          {[...Array(6)].map((_, i) => (
            <Animated.View
              key={i}
              style={[
                styles.particle,
                {
                  left: `${15 + i * 12}%`,
                  top: `${20 + (i % 3) * 25}%`,
                  opacity: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.6],
                  }),
                },
              ]}
            />
          ))}
        </Animated.View>

        {/* Main Content */}
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
              <Text style={styles.logo}>💪</Text>
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
                  {demoUsers.map((demoUser) => (
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
                      <Text style={styles.demoButtonText}>
                        {getExperienceIcon(demoUser.experience || "beginner")}{" "}
                        {demoUser.name}
                      </Text>
                      <Text style={styles.demoButtonSubtext}>
                        {getExperienceLabel(demoUser.experience || "beginner")}
                      </Text>
                      <Text style={styles.demoButtonDetails}>
                        {demoUser.stats?.workoutsCount || 0} אימונים •{" "}
                        {demoUser.stats?.streakDays || 0} ימי רצף
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* כפתור איפוס נתונים */}
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={resetAllData}
                >
                  <Text style={styles.resetButtonText}>
                    🗑️ איפוס כל הנתונים
                  </Text>
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
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
  },
  particleContainer: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: "none",
  },
  particle: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3B82F6",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: "center",
    marginTop: 60,
  },
  logoContainer: {
    position: "relative",
    marginBottom: 30,
  },
  logoGlow: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#3B82F6",
    top: -10,
    left: -10,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  logo: {
    fontSize: 100,
    textAlign: "center",
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 48,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: 2,
    textShadowColor: "rgba(59, 130, 246, 0.5)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitleContainer: {
    alignItems: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#94A3B8",
    textAlign: "center",
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  spacer: {
    flex: 1,
  },
  actionsSection: {
    gap: 16,
  },
  primaryActions: {
    gap: 12,
  },
  primaryButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: "#3B82F6",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  secondaryButton: {
    height: 56,
    borderRadius: 16,
    borderColor: "#3B82F6",
    borderWidth: 2,
  },
  guestButton: {
    height: 48,
    borderRadius: 12,
    borderColor: "#64748B",
    borderWidth: 1,
    backgroundColor: "rgba(100, 116, 139, 0.1)",
  },
  // Dev Panel Styles
  devPanel: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#374151",
  },
  devHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    gap: 8,
  },
  devIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10B981",
  },
  devTitle: {
    color: "#10B981",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
  demoSectionTitle: {
    color: "#F59E0B",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 12,
  },
  devActions: {
    gap: 8,
  },
  devButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  demoButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  demoButtonSubtext: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
  },
  demoButtonDetails: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "400",
  },
  resetButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ef4444",
    alignItems: "center",
  },
  resetButtonText: {
    color: "#ef4444",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default WelcomeScreen;
