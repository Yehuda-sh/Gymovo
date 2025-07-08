// src/screens/auth/WelcomeScreen.tsx - מסך פתיחה מנוקה ומסודר

// Removed unused import of Ionicons
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
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
import { demoUsers } from "../../constants/demoUsers";

const { height } = Dimensions.get("window");

type Props = NativeStackScreenProps<RootStackParamList, "Welcome">;

const WelcomeScreen = ({ navigation }: Props) => {
  const becomeGuest = useUserStore((state: UserState) => state.becomeGuest);
  const loginAsDemoUser = useUserStore(
    (state: UserState) => state.loginAsDemoUser
  );

  // אנימציות בשימוש בלבד
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.2)).current;
  const titleSlide = useRef(new Animated.Value(50)).current;
  const subtitleSlide = useRef(new Animated.Value(30)).current;
  const buttonsSlide = useRef(new Animated.Value(100)).current;

  // 🎬 הפעלת אנימציות
  const startAnimations = useCallback(() => {
    // אנימציה ראשית
    Animated.parallel([
      // Fade in כללי
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      // לוגו
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      // כותרת
      Animated.timing(titleSlide, {
        toValue: 0,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
      }),
      // תת כותרת
      Animated.timing(subtitleSlide, {
        toValue: 0,
        duration: 800,
        delay: 400,
        useNativeDriver: true,
      }),
      // כפתורים
      Animated.timing(buttonsSlide, {
        toValue: 0,
        duration: 800,
        delay: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, logoScale, titleSlide, subtitleSlide, buttonsSlide]);

  // 🎬 הפעלת אנימציות בעת טעינת הרכיב
  useEffect(() => {
    startAnimations();
  }, [startAnimations]);

  // 👤 התחברות כמשתמש דמו
  const handleDemoLogin = useCallback(
    async (userId: string) => {
      const demoUser = demoUsers.find((u) => u.id === userId);
      if (demoUser) {
        await loginAsDemoUser(userId);
        navigation.reset({
          index: 0,
          routes: [{ name: "Main" }],
        });
      }
    },
    [loginAsDemoUser, navigation]
  );

  // 🧑‍💼 כניסה כאורח
  const handleGuestLogin = useCallback(() => {
    becomeGuest();
    navigation.reset({
      index: 0,
      routes: [{ name: "Main" }],
    });
  }, [becomeGuest, navigation]);

  // 🗑️ איפוס נתונים (רק ב-DEV)
  const handleResetData = useCallback(async () => {
    if (__DEV__) {
      await clearAllData();
      console.log("✅ All data cleared!");
    }
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* רקע כהה עם גרדיאנט */}
      <View style={StyleSheet.absoluteFillObject}>
        <View style={[styles.backgroundGradient, styles.gradientTop]} />
        <View style={[styles.backgroundGradient, styles.gradientBottom]} />
      </View>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        {/* לוגו וכותרת */}
        <View style={styles.logoSection}>
          <Animated.View
            style={[
              styles.logoContainer,
              {
                transform: [{ scale: logoScale }],
              },
            ]}
          >
            <View style={styles.logoGlow} />
            <Text style={styles.logo}>💪</Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.titleContainer,
              {
                transform: [{ translateY: titleSlide }],
                opacity: fadeAnim,
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
                opacity: fadeAnim,
              },
            ]}
          >
            <Text style={styles.subtitle}>האפליקציה החכמה לאימונים</Text>
          </Animated.View>
        </View>

        <View style={styles.spacer} />

        {/* כפתורים ראשיים */}
        <Animated.View
          style={[
            styles.actionsSection,
            {
              transform: [{ translateY: buttonsSlide }],
              opacity: fadeAnim,
            },
          ]}
        >
          <View style={styles.primaryActions}>
            <Button
              title="התחל עכשיו"
              onPress={() => navigation.navigate("Signup")}
              variant="primary"
              style={styles.primaryButton}
            />

            <Button
              title="יש לי חשבון"
              onPress={() => navigation.navigate("Login")}
              variant="outline"
              style={styles.secondaryButton}
            />

            <Button
              title="כניסה כאורח"
              onPress={handleGuestLogin}
              variant="outline"
              style={styles.guestButton}
            />
          </View>

          {/* פאנל למפתחים - רק ב-DEV */}
          {__DEV__ && (
            <View style={styles.devPanel}>
              <View style={styles.devHeader}>
                <View style={styles.devIndicator} />
                <Text style={styles.devTitle}>DEV MODE</Text>
              </View>

              <Text style={styles.demoSectionTitle}>משתמשי דמו</Text>
              <View style={styles.devActions}>
                {demoUsers.map((user) => (
                  <TouchableOpacity
                    key={user.id}
                    style={[
                      styles.devButton,
                      {
                        backgroundColor:
                          user.id === "demo_1"
                            ? "rgba(34, 197, 94, 0.2)"
                            : user.id === "demo_2"
                            ? "rgba(59, 130, 246, 0.2)"
                            : "rgba(168, 85, 247, 0.2)",
                      },
                    ]}
                    onPress={() => handleDemoLogin(user)}
                  >
                    <Text style={styles.demoButtonText}>{user.name}</Text>
                    <Text style={styles.demoButtonSubtext}>{user.email}</Text>
                    <Text style={styles.demoButtonDetails}>
                      {user.id.includes("beginner")
                        ? "מתחיל"
                        : user.id.includes("intermediate")
                        ? "בינוני"
                        : "מתקדם"}{" "}
                      • סיים כמה אימונים
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleResetData}
              >
                <Text style={styles.resetButtonText}>🗑️ נקה את כל הנתונים</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  // רקע וגרדיאנטים
  backgroundGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    height: height * 0.6,
  },
  gradientTop: {
    top: 0,
    backgroundColor: "rgba(59, 130, 246, 0.15)",
  },
  gradientBottom: {
    bottom: 0,
    backgroundColor: "rgba(0, 255, 136, 0.1)",
    transform: [{ scaleY: -1 }],
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 40,
  },
  // לוגו וכותרות
  logoSection: {
    alignItems: "center",
    marginTop: height * 0.1,
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
    opacity: 0.3,
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
  // כפתורים
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
  // פאנל מפתחים
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
