// src/utils/networkUtils.ts
import NetInfo from "@react-native-community/netinfo";
import { Alert } from "react-native";
import { useEffect, useState } from "react";

// Types
export interface NetworkError extends Error {
  statusCode?: number;
  retry?: () => Promise<any>;
  isNetworkError: boolean;
}

export interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  backoffMultiplier?: number;
  onRetry?: (attempt: number) => void;
}

// בדיקת חיבור לאינטרנט
export const checkInternetConnection = async (): Promise<boolean> => {
  const netInfo = await NetInfo.fetch();
  return netInfo.isConnected ?? false;
};

// Wrapper לבקשות עם retry logic
export const fetchWithRetry = async <T>(
  fetchFn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> => {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    backoffMultiplier = 2,
    onRetry,
  } = options;

  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // בדיקת חיבור לפני הבקשה
      const isConnected = await checkInternetConnection();
      if (!isConnected && attempt === 0) {
        throw createNetworkError("אין חיבור לאינטרנט", 0);
      }

      // ביצוע הבקשה
      const result = await fetchFn();
      return result;
    } catch (error: any) {
      lastError = error;

      // אם זה הניסיון האחרון, זרוק את השגיאה
      if (attempt === maxRetries) {
        throw enhanceError(error, () => fetchWithRetry(fetchFn, options));
      }

      // אם יש callback, קרא לו
      if (onRetry) {
        onRetry(attempt + 1);
      }

      // חכה לפני הניסיון הבא (עם exponential backoff)
      const delay = retryDelay * Math.pow(backoffMultiplier, attempt);
      await sleep(delay);
    }
  }

  throw lastError!;
};

// יצירת שגיאת רשת מותאמת
const createNetworkError = (
  message: string,
  statusCode?: number
): NetworkError => {
  const error = new Error(message) as NetworkError;
  error.statusCode = statusCode;
  error.isNetworkError = true;
  return error;
};

// הוספת retry function לשגיאה
const enhanceError = (
  error: Error,
  retryFn: () => Promise<any>
): NetworkError => {
  const networkError = error as NetworkError;
  networkError.retry = retryFn;
  networkError.isNetworkError = true;
  return networkError;
};

// Helper function for delays
const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// תצוגת שגיאה למשתמש עם אפשרות retry
export const showNetworkError = (
  error: NetworkError,
  customMessage?: string
): void => {
  const message = customMessage || getErrorMessage(error);

  Alert.alert(
    "שגיאת חיבור",
    message,
    error.retry
      ? [
          { text: "ביטול", style: "cancel" },
          {
            text: "נסה שוב",
            onPress: async () => {
              try {
                await error.retry!();
              } catch (retryError) {
                showNetworkError(retryError as NetworkError);
              }
            },
          },
        ]
      : [{ text: "אוקיי" }]
  );
};

// המרת שגיאה להודעה ידידותית
const getErrorMessage = (error: NetworkError): string => {
  if (!error.isNetworkError) {
    return "אירעה שגיאה לא צפויה";
  }

  if (error.statusCode === 0) {
    return "אין חיבור לאינטרנט. אנא בדוק את החיבור שלך.";
  }

  switch (error.statusCode) {
    case 400:
      return "הבקשה שגויה. אנא נסה שוב.";
    case 401:
      return "נדרשת הזדהות מחדש.";
    case 403:
      return "אין לך הרשאה לבצע פעולה זו.";
    case 404:
      return "המידע המבוקש לא נמצא.";
    case 408:
      return "תם הזמן המוקצב לבקשה. אנא נסה שוב.";
    case 500:
    case 502:
    case 503:
      return "שגיאה בשרת. אנא נסה שוב מאוחר יותר.";
    default:
      return "שגיאת חיבור. אנא נסה שוב.";
  }
};

// React Hook לבדיקת חיבור
export const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [networkType, setNetworkType] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? false);
      setNetworkType(state.type);
    });

    // בדיקה ראשונית
    NetInfo.fetch().then((state) => {
      setIsConnected(state.isConnected ?? false);
      setNetworkType(state.type);
    });

    return unsubscribe;
  }, []);

  return { isConnected, networkType };
};

// דוגמה לשימוש ב-API
export const apiCall = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  return fetchWithRetry(async () => {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw createNetworkError(
        `Request failed with status ${response.status}`,
        response.status
      );
    }

    return response.json();
  });
};

// Helper לבדיקת חיבור לפני פעולה
export const withNetworkCheck = async <T>(
  action: () => Promise<T>,
  errorMessage?: string
): Promise<T> => {
  const isConnected = await checkInternetConnection();

  if (!isConnected) {
    const error = createNetworkError(
      errorMessage || "אין חיבור לאינטרנט. אנא בדוק את החיבור שלך.",
      0
    );
    showNetworkError(error);
    throw error;
  }

  return action();
};

// Utility לביטול בקשות
export class CancelableRequest<T> {
  private abortController: AbortController;
  private promise: Promise<T>;

  constructor(fetchFn: (signal: AbortSignal) => Promise<T>) {
    this.abortController = new AbortController();
    this.promise = fetchFn(this.abortController.signal);
  }

  get request(): Promise<T> {
    return this.promise;
  }

  cancel(): void {
    this.abortController.abort();
  }
}

// דוגמה לשימוש בביטול בקשות
export const cancelableApiCall = <T>(
  url: string,
  options?: RequestInit
): CancelableRequest<T> => {
  return new CancelableRequest((signal) =>
    apiCall<T>(url, { ...options, signal })
  );
};
