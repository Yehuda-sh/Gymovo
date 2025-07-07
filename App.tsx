// App.tsx - גרסה מתוקנת ללא שגיאות

import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  AppState,
  I18nManager,
  Platform,
  StatusBar,
} from "react-native";
// 🔧 תיקון השגיאה - העברת ה-import לחלק העליון
import AsyncStorage from "@react-native-async-storage/async-storage";

// 🛡️ רכיבי אבטחה ויציבות
import { ErrorBoundary } from "./src/components/common/ErrorBoundary";

// 📱 הניווט הראשי
import AppWithProviders from "./src/navigation/RootLayout";

// 🎨 עיצוב ונושא

// 🔧 הגדרות גלובליות

// 1. מניעת סגירת Splash Screen עד שהאפליקציה מוכנה
SplashScreen.preventAutoHideAsync();

// 2. הפעלת תמיכה ב-RTL (עברית)
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

// 3. הגדרת קונסול לוגים לפי סביבה
if (__DEV__) {
  console.log("🚀 Gymovo App starting in development mode");
  console.log(`📱 Platform: ${Platform.OS} ${Platform.Version}`);
  console.log(`🌐 RTL Enabled: ${I18nManager.isRTL}`);
} else {
  // בפרודקשן, הגבל את הלוגים
  console.log = () => {};
  console.warn = () => {};
}

// 📱 רכיב App הראשי עם כל השדרוגים
const App = () => {
  // 🔄 State לניהול מצב האפליקציה
  const [isAppReady, setIsAppReady] = useState(false);

  // 📊 מעקב אחר מצב האפליקציה
  const appState = useRef(AppState.currentState);

  // 🎬 אתחול האפליקציה
  useEffect(() => {
    initializeApp();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 🔄 מעקב אחר מעברים בין foreground/background
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("📱 App has come to the foreground");
        // כאן אפשר להוסיף לוגיקה לרענון נתונים
      }
      appState.current = nextAppState;
    });

    return () => subscription?.remove();
  }, []);

  // 🚀 פונקציית אתחול ראשית
  const initializeApp = async () => {
    try {
      console.log("🔧 Initializing Gymovo app...");

      // שלב 1: אתחול שירותים חיוניים
      await initializeServices();

      // שלב 2: טעינת הגדרות משתמש
      await loadUserPreferences();

      // שלב 3: סיום טעינה והצגת האפליקציה
      // קצת דיליי כדי שה-splash screen יהיה חלק
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsAppReady(true);
      await SplashScreen.hideAsync();

      console.log("✅ App initialization completed successfully");
    } catch (error) {
      console.error("❌ App initialization failed:", error);
      handleInitializationError(error);
    }
  };

  // 🛠️ אתחול שירותים חיוניים
  const initializeServices = async () => {
    try {
      // כאן אפשר להוסיף אתחול של:
      // - Analytics service
      // - Crash reporting
      // - Push notifications
      // - Background sync

      console.log("🔧 Core services initialized");

      // סימולציה של זמן טעינה
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Failed to initialize services:", error);
      throw error;
    }
  };

  // ⚙️ טעינת העדפות משתמש
  const loadUserPreferences = async () => {
    try {
      // כאן אפשר לטעון:
      // - נושא (כהה/בהיר)
      // - שפה
      // - הגדרות התראות
      // - העדפות אימון

      console.log("👤 User preferences loaded");

      // סימולציה של זמן טעינה
      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (error) {
      console.error("Failed to load user preferences:", error);
      // לא קריטי - אפשר להמשיך בלי העדפות
    }
  };

  // ❌ טיפול בשגיאות אתחול קריטיות
  const handleInitializationError = (error: any) => {
    console.error("💥 Critical initialization error:", error);

    setIsAppReady(true); // מציגים את האפליקציה בכל מקרה
    SplashScreen.hideAsync();

    // הצגת התראה למשתמש (רק אם זו שגיאה רצינית)
    setTimeout(() => {
      Alert.alert(
        "הודעת מערכת",
        "חלק מהפיצ'רים עלולים לא לעבוד בצורה מיטבית. אנא ודא שיש לך חיבור אינטרנט תקין.",
        [{ text: "הבנתי", style: "default" }],
        { cancelable: true }
      );
    }, 2000);
  };

  // 🌐 טיפול בשגיאות רשת גלובליות
  const handleGlobalError = (error: Error, errorInfo: any) => {
    console.error("🚨 Global error caught by ErrorBoundary:", error);

    // בעתיד: שליחה לשירות מעקב שגיאות
    // Sentry.captureException(error, { extra: errorInfo });

    // בעתיד: Analytics event
    // Analytics.trackError('app_crash', { error: error.message });

    // לוג מפורט לפיתוח
    if (__DEV__) {
      console.error("Error Details:", {
        message: error.message,
        stack: error.stack,
        errorInfo,
      });
    }
  };

  // ⏳ מסך טעינה בזמן אתחול
  if (!isAppReady) {
    return null; // SplashScreen עדיין מוצג
  }

  // 📱 רינדור האפליקציה הראשית
  return (
    <>
      {/* 🎨 סטטוס בר מותאם לעיצוב - תיקון הבעיה כאן */}
      <StatusBar
        barStyle="light-content" // תואם לעיצוב הכהה
        backgroundColor="#0a0a0a" // שחור עמוק - צבע ישיר במקום אובייקט
        translucent={false}
      />

      {/* 🛡️ הגנה מפני שגיאות */}
      <ErrorBoundary onError={handleGlobalError} showDetails={__DEV__}>
        <AppWithProviders />
      </ErrorBoundary>
    </>
  );
};

export default App;

// 📊 מידע לפיתוח (רק במצב debug)
if (__DEV__) {
  // יצירת כמה פונקציות עזר גלובליות לפיתוח
  // 🔧 תיקון השגיאה השנייה - AsyncStorage כבר מיובא למעלה

  (global as any).__DEV_HELPERS__ = {
    clearAsyncStorage: async () => {
      await AsyncStorage.clear();
      console.log("🗑️ AsyncStorage cleared");
    },

    logAppState: () => {
      console.log("📊 Current app state:", {
        platform: Platform.OS,
        version: Platform.Version,
        rtl: I18nManager.isRTL,
        timestamp: new Date().toISOString(),
      });
    },

    simulateError: () => {
      throw new Error("🧪 Simulated error for testing ErrorBoundary");
    },
  };

  console.log(`
🚀 GYMOVO DEVELOPMENT MODE
📱 Platform: ${Platform.OS} ${Platform.Version}
🎨 RTL: ${I18nManager.isRTL}  
🛠️ Dev helpers available at global.__DEV_HELPERS__
  `);
}
