// src/screens/auth/WelcomeScreen.tsx - מסך פתיחה מתוקן

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
import { User } from "../../types/user";

// הוספת טיפוס מורחב למשתמשי דמו
interface DemoUserData extends User {
  color?: string;
  level: "beginner" | "intermediate" | "advanced";
  goal: "build_muscle" | "lose_weight" | "get_stronger" | "general_fitness";
}

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
    async (demoUser: DemoUserData) => {
      // המרה ל-User בסיסי לפני שליחה ל-store
      const userForStore: User = {
        id: demoUser.id,
        email: demoUser.email,
        name: demoUser.name,
        age: demoUser.age,
        isGuest: demoUser.isGuest,
        createdAt: demoUser.createdAt,
        stats: demoUser.stats,
      };

      await loginAsDemoUser(userForStore);
      navigation.reset({
        index: 0,
        routes: [{ name: "Main" }],
      });
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
            <View style={styles.accentLine} />
          </Animated.View>

          <Animated.View
            style={{
              transform: [{ translateY: subtitleSlide }],
              opacity: fadeAnim,
            }}
          >
            <Text style={styles.subtitle}>התוכנית האישית שלך לחדר הכושר</Text>
          </Animated.View>
        </View>

        {/* כפתורי כניסה */}
        <Animated.View
          style={[
            styles.buttonsSection,
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
              variant="secondary"
              style={styles.secondaryButton}
            />
          </View>

          <Button
            title="כניסה כאורח"
            onPress={handleGuestLogin}
            variant="outline"
            style={styles.guestButton}
          />

          {/* פאנל מפתחים - רק ב-DEV mode */}
          {__DEV__ && (
            <View style={styles.devPanel}>
              <View style={styles.devHeader}>
                <View style={styles.devIndicator} />
                <Text style={styles.devTitle}>DEV MODE</Text>
              </View>

              <Text style={styles.demoSectionTitle}>משתמשי דמו</Text>
              <View style={styles.devActions}>
                {(demoUsers as DemoUserData[]).map((user) => (
                  <TouchableOpacity
                    key={user.id}
                    style={[
                      styles.devButton,
                      { backgroundColor: user.color || "#1F2937" },
                    ]}
                    onPress={() => handleDemoLogin(user)}
                  >
                    <Text style={styles.demoButtonText}>{user.name}</Text>
                    <Text style={styles.demoButtonSubtext}>
                      {user.email} • {user.age} שנים
                    </Text>
                    <Text style={styles.demoButtonDetails}>
                      {user.level === "beginner" && "מתחיל"}
                      {user.level === "intermediate" && "ביניים"}
                      {user.level === "advanced" && "מתקדם"}
                      {" • "}
                      {user.goal === "build_muscle" && "בניית שריר"}
                      {user.goal === "lose_weight" && "ירידה במשקל"}
                      {user.goal === "get_stronger" && "חיזוק"}
                      {user.goal === "general_fitness" && "כושר כללי"}
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
  backgroundGradient: {
    position: "absolute",
    width: "100%",
    height: height * 0.5,
  },
  gradientTop: {
    top: 0,
    backgroundColor: "#0a0a0a",
    opacity: 0.8,
  },
  gradientBottom: {
    bottom: 0,
    backgroundColor: "#1a1a1a",
    opacity: 0.6,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
  },
  logoSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: 32,
    alignItems: "center",
  },
  logoGlow: {
    position: "absolute",
    width: 120,
    height: 120,
    backgroundColor: "#3B82F6",
    borderRadius: 60,
    opacity: 0.2,
    top: -10,
  },
  logo: {
    fontSize: 64,
    textAlign: "center",
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 48,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 8,
    letterSpacing: -1,
    fontFamily: Platform.select({
      ios: "Avenir-Heavy",
      android: "sans-serif-condensed",
    }),
  },
  accentLine: {
    width: 60,
    height: 4,
    backgroundColor: "#3B82F6",
    borderRadius: 2,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 4,
  },
  subtitle: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    fontWeight: "400",
  },
  buttonsSection: {
    paddingTop: 32,
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
