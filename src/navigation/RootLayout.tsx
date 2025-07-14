// src/navigation/RootLayout.tsx
// ניהול ראשי לניווט באפליקציה - מוכן ומאורגן

import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// 🛡️ רכיבי אבטחה וטיפול בשגיאות
import ErrorBoundary from "../components/common/ErrorBoundary";
import { DialogProvider } from "../components/common/Dialog";

// 🎯 רכיבים וקונפיגורציה של הניווט
import { SplashScreen } from "../screens/splash/SplashScreen";
import { queryClientConfig } from "../config/queryClient";
import { useNavigationSetup } from "./hooks/useNavigationSetup";
import { AppStack } from "./stacks/AppStack";
import { AuthStack } from "./stacks/AuthStack";

// 📊 ניהול מצב משתמש
import { useUserStore, initializeUser } from "../stores/userStore";

/**
 * יצירת React Query client עם הגדרות אופטימליות
 */
const queryClient = new QueryClient(queryClientConfig);

/**
 * הרכיב הראשי לניווט - מנהל את כל זרימת הניווט באפליקציה
 * כולל אתחול שירותים, טיפול בשגיאות וניהול מצב הטעינה
 */
const RootLayout: React.FC = () => {
  const { isNavigationReady, error } = useNavigationSetup();
  const user = useUserStore((state) => state.user);
  const isLoading = useUserStore((state) => state.isLoading);
  const [isInitialized, setIsInitialized] = useState(false);

  // אתחול משתמש (יצירת אורח אם צריך)
  useEffect(() => {
    const init = async () => {
      await initializeUser();
      setIsInitialized(true);
    };
    init();
  }, []);

  // 🔄 מסך טעינה בזמן אתחול
  if (!isNavigationReady || !isInitialized || isLoading) {
    return (
      <ErrorBoundary>
        <SplashScreen message="מאתחל את המערכת..." showLogo={true} />
      </ErrorBoundary>
    );
  }

  // ⚠️ הצגת שגיאה במקרה הצורך (אבל ממשיכים לטעון)
  if (error && __DEV__) {
    console.warn("Navigation warning:", error);
  }

  // 🎯 הרכיב הראשי עם כל ה-providers הנדרשים
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <DialogProvider>
            <NavigationContainer>
              {/* אם יש משתמש (רגיל או אורח) - הצג את האפליקציה */}
              {user ? <AppStack /> : <AuthStack />}
              <Toast />
            </NavigationContainer>
          </DialogProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
