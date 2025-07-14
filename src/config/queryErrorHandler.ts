// src/config/queryErrorHandler.ts
// טיפול מרכזי בשגיאות React Query

import { showToast } from "../utils/toast";
import { QueryCache, MutationCache } from "@tanstack/react-query";

/**
 * טיפול בשגיאות queries
 */
export const queryCache = new QueryCache({
  onError: (error: any, query) => {
    // התעלם משגיאות רשת אם אנחנו offline
    if (!navigator.onLine) {
      showToast("אין חיבור לאינטרנט", "warning");
      return;
    }

    // טיפול לפי סוג השגיאה
    if (error?.status === 401) {
      showToast("יש להתחבר מחדש", "error");
      // Navigate to login
    } else if (error?.status === 403) {
      showToast("אין לך הרשאה לפעולה זו", "error");
    } else if (error?.status >= 500) {
      showToast("שגיאת שרת, נסה שוב מאוחר יותר", "error");
    } else {
      showToast(error?.message || "שגיאה בטעינת הנתונים", "error");
    }
  },
});

/**
 * טיפול בשגיאות mutations
 */
export const mutationCache = new MutationCache({
  onError: (error: any, variables, context, mutation) => {
    // אותו טיפול כמו queries
    if (!navigator.onLine) {
      showToast("לא ניתן לבצע פעולה ללא חיבור לאינטרנט", "warning");
      return;
    }

    const errorMessage = error?.response?.data?.message || error?.message;
    showToast(errorMessage || "שגיאה בביצוע הפעולה", "error");
  },
});

// עדכון queryClient:
// export const queryClient = new QueryClient({
//   ...queryClientConfig,
//   queryCache,
//   mutationCache,
// });
