// src/navigation/config/queryClient.ts
// הגדרות React Query Client עם אופטימיזציות לביצועים

import { QueryClientConfig } from "@tanstack/react-query";

/**
 * הגדרות אופטימליות ל-React Query Client
 */
export const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      // 🔄 מדיניות חזרה על שגיאות
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // ⏰ זמני cache
      staleTime: 5 * 60 * 1000, // 5 דקות - כמה זמן הנתון נחשב "טרי"
      gcTime: 10 * 60 * 1000, // 10 דקות - כמה זמן לשמור בזכרון (החלפנו cacheTime)

      // 🚫 מניעת רפרש אוטומטי במצבים מסוימים
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,

      // ⚡ אופטימיזציות ביצועים
      structuralSharing: true,

      // 🔍 הגדרות רשת
      networkMode: "online",
    },

    mutations: {
      // 🔄 חזרה פחותה על mutations
      retry: 1,
      retryDelay: 1000,

      // 🌐 הגדרות רשת
      networkMode: "online",
    },
  },
};

/**
 * הגדרות DevTools לסביבת פיתוח
 */
export const devToolsConfig = {
  initialIsOpen: false,
  position: "bottom-right" as const,
};

export default queryClientConfig;
