// src/screens/auth/WelcomeScreen.tsx - גרסה מלאה עם כפתורי דמו

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  DevSettings,
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../../components/common/Button";
import { demoUsers } from "../../constants/demoUsers";
import { clearAllData } from "../../data/storage";
import { UserState, useUserStore } from "../../stores/userStore";
import { RootStackParamList } from "../../types/navigation";

const { width, height } = Dimensions.get("window");

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
  const titleSlide = useRef(new Animated.Value(-50)).current;
  const subtitleSlide = useRef(new Animated.Value(50)).current;
  const buttonsSlide = useRef(new Animated.Value(100)).current;
  const particleFloat = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
          tension: 50,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotate, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),

      // Phase 2: Title Animation
      Animated.timing(titleSlide, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),

      // Phase 3: Subtitle
      Animated.timing(subtitleSlide, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),

      // Phase 4: Buttons
      Animated.spring(buttonsSlide, {
        toValue: 0,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // אנימציה מתמשכת לגלוו
    const glowAnimation = Animated.loop(
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
    );

    // אנימציה מתמשכת לחלקיקים צפים
    const floatAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(particleFloat, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(particleFloat, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );

    setTimeout(() => {
      glowAnimation.start();
      floatAnimation.start();
    }, 2000);

    return () => {
      glowAnimation.stop();
      floatAnimation.stop();
    };
  }, []);

  // פונקציה לריסט נתוני דמו (רק בפיתוח)
  const handleResetData = async () => {
    try {
      await clearAllData();
      if (__DEV__ && DevSettings) {
        DevSettings.reload();
      }
    } catch (error) {
      console.error("Failed to reset data:", error);
    }
  };

  // פונקציה לכניסה כמשתמש דמו
  const handleDemoLogin = async (demoUser: any) => {
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
          {/* Header Section */}
          <View style={styles.headerSection}>
            {/* Logo with glow effect */}
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
              <Image
                source={require("../../../assets/images/branding/logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </Animated.View>

            {/* Title */}
            <Animated.View
              style={[
                styles.titleContainer,
                {
                  transform: [{ translateY: titleSlide }],
                },
              ]}
            >
              <Text style={styles.title}>GYMOVO</Text>
              <View style={styles.accentLine} />
            </Animated.View>

            {/* Subtitle */}
            <Animated.View
              style={[
                styles.subtitleContainer,
                {
                  transform: [{ translateY: subtitleSlide }],
                },
              ]}
            >
              <Text style={styles.subtitle}>המסע שלך לכושר מושלם</Text>
              <Text style={styles.description}>
                אפליקציה מתקדמת לניהול אימונים אישיים
              </Text>
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
                    },
                  ]}
                  onPress={handleResetData}
                >
                  <Text style={[styles.demoButtonText, { color: "#ef4444" }]}>
                    🗑️ איפוס נתונים
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
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  particleContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  particle: {
    position: "absolute",
    width: 4,
    height: 4,
    backgroundColor: "#00ff88",
    borderRadius: 2,
    shadowColor: "#00ff88",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 60,
    zIndex: 2,
  },
  headerSection: {
    alignItems: "center",
    width: "100%",
  },
  logoContainer: {
    position: "relative",
    marginBottom: 40,
  },
  logoGlow: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#00ff88",
    opacity: 0.3,
    shadowColor: "#00ff88",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 10,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    shadowColor: "#00ff88",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 8,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: "900",
    color: "#ffffff",
    textAlign: "center",
    letterSpacing: 4,
    fontFamily: Platform.OS === "ios" ? "Futura" : "sans-serif-condensed",
    textShadowColor: "#00ff88",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    marginBottom: 12,
  },
  accentLine: {
    width: 80,
    height: 4,
    backgroundColor: "#00ff88",
    shadowColor: "#00ff88",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
  },
  subtitleContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    marginBottom: 8,
    fontFamily: Platform.OS === "ios" ? "Hebrew" : "sans-serif",
  },
  description: {
    fontSize: 16,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "Hebrew" : "sans-serif",
  },
  spacer: {
    flex: 1,
  },
  actionsSection: {
    width: "100%",
  },
  primaryActions: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#00ff88",
    borderRadius: 12,
    paddingVertical: 18,
    shadowColor: "#00ff88",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 10,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 136, 0.8)",
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderColor: "rgba(255, 255, 255, 0.4)",
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 18,
  },
  guestButton: {
    backgroundColor: "transparent",
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 18,
    marginBottom: 20,
  },

  // 🎭 Dev Panel Styles
  devPanel: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 53, 0.4)",
  },
  devHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  devIndicator: {
    width: 20,
    height: 2,
    backgroundColor: "#ff6b35",
    marginHorizontal: 8,
  },
  devTitle: {
    color: "#ff6b35",
    fontWeight: "800",
    fontSize: 12,
    letterSpacing: 2,
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
