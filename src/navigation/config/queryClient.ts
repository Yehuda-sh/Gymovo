// src/config/queryClient.ts
// הגדרות React Query Client עם אופטימיזציות וטיפול במצב offline

import {
  QueryClient,
  QueryClientConfig,
  onlineManager,
} from "@tanstack/react-query";
import { Platform } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { useState, useEffect } from "react";

/**
 * הגדרת online manager לזיהוי מצב רשת
 */
onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(state.isConnected ?? false);
  });
});

/**
 * הגדרות אופטימליות ל-React Query Client
 */
export const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      // 🔄 מדיניות חזרה על שגיאות
      retry: (failureCount, error: any) => {
        // אל תנסה שוב אם אין רשת
        if (!navigator.onLine) return false;

        // אל תנסה שוב על שגיאות 4xx
        if (error?.status >= 400 && error?.status < 500) return false;

        // נסה עד 3 פעמים
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // ⏰ זמני cache
      staleTime: 5 * 60 * 1000, // 5 דקות - נתונים נחשבים "טריים"
      gcTime: 10 * 60 * 1000, // 10 דקות - זמן שמירה בזיכרון

      // 🚫 מניעת רפרש אוטומטי
      refetchOnWindowFocus: false,
      refetchOnReconnect: "always", // תמיד רענן בחזרה לאונליין
      refetchOnMount: true,

      // ⚡ אופטימיזציות ביצועים
      structuralSharing: true,

      // 🌐 הגדרות רשת
      networkMode: "online", // או "offlineFirst" לאפליקציות offline-first

      // ⏱️ זמן מקסימלי לבקשה
      ...(Platform.OS === "android" && {
        // אנדרואיד לפעמים איטי יותר
        staleTime: 3 * 60 * 1000,
      }),
    },

    mutations: {
      // 🔄 פחות ניסיונות למוטציות
      retry: 1,
      retryDelay: 1000,

      // 🌐 הגדרות רשת
      networkMode: "online",

      // 🔔 הצגת שגיאות
      onError: (error: any) => {
        if (!navigator.onLine) {
          console.log("Mutation failed: No internet connection");
        }
      },
    },
  },
};

/**
 * יצירת QueryClient instance
 */
export const queryClient = new QueryClient(queryClientConfig);

/**
 * הגדרות DevTools לסביבת פיתוח
 */
export const devToolsConfig = {
  initialIsOpen: false,
  position: "bottom-right" as const,
  // הסתר בפרודקשן
  enabled: __DEV__,
};

/**
 * פונקציות עזר לניהול cache
 */
export const cacheHelpers = {
  // ניקוי כל ה-cache
  clearAllCache: () => {
    queryClient.clear();
  },

  // ניקוי queries ספציפיים
  invalidateQueries: (keys: string[]) => {
    keys.forEach((key) => {
      queryClient.invalidateQueries({ queryKey: [key] });
    });
  },

  // בדיקת מצב רשת
  isOnline: () => onlineManager.isOnline(),

  // רענון כל ה-queries
  refetchAll: () => {
    queryClient.refetchQueries();
  },
};

/**
 * Hook לשימוש במצב הרשת
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(onlineManager.isOnline());

  useEffect(() => {
    const unsubscribe = onlineManager.subscribe(setIsOnline);
    return unsubscribe;
  }, []);

  return isOnline;
};

// Types for better TypeScript support
export type QueryKey = readonly unknown[];
export type MutationKey = readonly unknown[];

export default queryClient;
