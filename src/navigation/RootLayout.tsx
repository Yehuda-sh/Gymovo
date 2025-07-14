// src/navigation/RootLayout.tsx
// ניהול ראשי לניווט באפליקציה - מוכן ומאורגן

import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler"; // הוספנו!

// 🛡️ רכיבי אבטחה וטיפול בשגיאות
import { ErrorBoundary } from "../components/common/ErrorBoundary";
import { DialogProvider } from "../components/common/Dialog";

// 🎯 רכיבים וקונפיגורציה של הניווט
import { SplashScreen } from "../screens/splash/SplashScreen";
import { queryClientConfig } from "../config/queryClient";
import { useNavigationSetup } from "./hooks/useNavigationSetup";
import { AppStack } from "./stacks/AppStack";
import { AuthStack } from "./stacks/AuthStack";

// 📊 ניהול מצב משתמש
import { UserState, useUserStore } from "../stores/userStore";

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
  const status = useUserStore((state: UserState) => state.status);

  // 🔄 מסך טעינה בזמן אתחול
  if (!isNavigationReady) {
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
              {status === "loading" ? (
                <SplashScreen message="טוען נתונים..." showLogo={false} />
              ) : status === "authenticated" || status === "guest" ? (
                <AppStack />
              ) : (
                <AuthStack />
              )}
              <Toast />
            </NavigationContainer>
          </DialogProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
