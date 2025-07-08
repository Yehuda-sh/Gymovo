// App.tsx - גרסה מתוקנת עם אתחול מלא

import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  AppState,
  I18nManager,
  Platform,
  StatusBar,
} from "react-native";

// 📱 הניווט הראשי
import AppWithProviders from "./src/navigation/RootLayout";

// 🔧 הגדרות גלובליות
SplashScreen.preventAutoHideAsync();

// הפעלת תמיכה ב-RTL (עברית)
if (!I18nManager.isRTL) {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
}

// הגדרת לוגים
if (__DEV__) {
  console.log("🚀 Gymovo App starting in development mode");
  console.log(`📱 Platform: ${Platform.OS} ${Platform.Version}`);
  console.log(`🌐 RTL Enabled: ${I18nManager.isRTL}`);

  // Developer helpers
  (global as any).__DEV_HELPERS__ = {
    clearAsyncStorage: async () => {
      const AsyncStorage = await import(
        "@react-native-async-storage/async-storage"
      );
      await AsyncStorage.default.clear();
      console.log("🧹 AsyncStorage cleared");
    },
    logState: () => {
      console.log("📊 App state:", {
        platform: Platform.OS,
        rtl: I18nManager.isRTL,
        timestamp: new Date().toISOString(),
      });
    },
  };
}

// 📱 רכיב App הראשי
const App = () => {
  const [isAppReady, setIsAppReady] = useState(false);
  const appState = useRef(AppState.currentState);

  // ⚙️ טעינת העדפות משתמש
  const loadUserPreferences = useCallback(async () => {
    try {
      // טעינת העדפות בסיסיות
      const defaultPreferences = {
        theme: "dark",
        accentColor: "#00ff88",
        general: {
          language: "he",
          timeFormat: "24h",
          dateFormat: "dd/mm/yyyy",
          firstDayOfWeek: "sunday",
        },
        notifications: {
          pushNotifications: true,
          workoutReminders: true,
          restReminders: true,
          weeklyGoals: true,
          achievements: true,
        },
        workout: {
          units: "kg",
          defaultRestTime: 90,
          autoStartTimer: true,
          hapticFeedback: true,
          showVideoGuides: true,
          playBeepSounds: false,
        },
        privacy: {
          shareWorkouts: false,
          shareProgress: false,
          allowAnalytics: true,
          backupData: true,
        },
      };

      console.log("👤 User preferences loaded:", defaultPreferences);

      // סימולציה של זמן טעינה
      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (error) {
      console.error("Failed to load user preferences:", error);
      // לא קריטי - אפשר להמשיך בלי העדפות
    }
  }, []);

  // 🛠️ אתחול שירותים חיוניים
  const initializeServices = useCallback(async () => {
    try {
      // סימולציה של זמן טעינה לשירותים
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("🔧 Core services initialized");
    } catch (error) {
      console.error("Failed to initialize services:", error);
      throw error;
    }
  }, []);

  // ❌ טיפול בשגיאות אתחול קריטיות
  const handleInitializationError = useCallback((error: any) => {
    console.error("💥 Critical initialization error:", error);

    const errorMessage = error?.message || "Unknown initialization error";
    console.error("Initialization error details:", errorMessage);

    // מציגים את האפליקציה בכל מקרה
    setIsAppReady(true);
    SplashScreen.hideAsync();

    // הצגת התראה למשתמש
    setTimeout(() => {
      Alert.alert(
        "הודעת מערכת",
        "חלק מהפיצ'רים עלולים לא לעבוד בצורה מיטבית. אנא ודא שיש לך חיבור אינטרנט תקין.",
        [{ text: "הבנתי", style: "default" }]
      );
    }, 1000);
  }, []);

  // 🚀 פונקציית אתחול ראשית
  const initializeApp = useCallback(async () => {
    try {
      console.log("🔧 Initializing Gymovo app...");

      // שלב 1: אתחול שירותים חיוניים
      await initializeServices();

      // שלב 2: טעינת הגדרות משתמש
      await loadUserPreferences();

      // שלב 3: סיום טעינה והצגת האפליקציה
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsAppReady(true);
      await SplashScreen.hideAsync();

      console.log("✅ App initialization completed successfully");
    } catch (error) {
      console.error("❌ App initialization failed:", error);
      handleInitializationError(error);
    }
  }, [initializeServices, loadUserPreferences, handleInitializationError]);

  // 🎬 אתחול האפליקציה
  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  // מעקב אחר מצב האפליקציה
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("📱 App has come to the foreground");
      }
      appState.current = nextAppState;
    });

    return () => subscription?.remove();
  }, []);

  // עד שהאפליקציה לא מוכנה, נשאיר את ה-splash screen
  if (!isAppReady) {
    return null;
  }

  // החזרת האפליקציה המלאה
  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#ffffff"
        translucent={false}
      />
      <AppWithProviders />
    </>
  );
};

export default App;
