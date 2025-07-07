// src/services/networkErrorHandler.ts - טיפול מתקדם בשגיאות רשת

import * as Haptics from "expo-haptics";
import { Alert } from "react-native";

// סוגי שגיאות רשת
export enum NetworkErrorType {
  NO_CONNECTION = "NO_CONNECTION",
  TIMEOUT = "TIMEOUT",
  SERVER_ERROR = "SERVER_ERROR",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  RATE_LIMITED = "RATE_LIMITED",
  UNKNOWN = "UNKNOWN",
}

// ממשק שגיאת רשת
export interface NetworkError extends Error {
  type: NetworkErrorType;
  status?: number;
  retryable: boolean;
  userMessage: string;
  technicalMessage: string;
  timestamp: Date;
  requestId?: string;
}

// אפשרויות עבור Retry
export interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number; // milliseconds
  maxDelay?: number; // milliseconds
  backoffFactor?: number;
  retryCondition?: (error: NetworkError) => boolean;
  onRetry?: (attempt: number, error: NetworkError) => void;
}

// ברירות מחדל עבור Retry
const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
  retryCondition: (error) => error.retryable,
  onRetry: () => {},
};

// מחלקה לטיפול בשגיאות רשת
export class NetworkErrorHandler {
  private static instance: NetworkErrorHandler;

  static getInstance(): NetworkErrorHandler {
    if (!NetworkErrorHandler.instance) {
      NetworkErrorHandler.instance = new NetworkErrorHandler();
    }
    return NetworkErrorHandler.instance;
  }

  // זיהוי סוג השגיאה
  identifyErrorType(error: any): NetworkErrorType {
    // בדיקת סטטוס HTTP
    if (error.response?.status) {
      const status = error.response.status;

      if (status === 401) return NetworkErrorType.UNAUTHORIZED;
      if (status === 403) return NetworkErrorType.FORBIDDEN;
      if (status === 404) return NetworkErrorType.NOT_FOUND;
      if (status === 429) return NetworkErrorType.RATE_LIMITED;
      if (status >= 500) return NetworkErrorType.SERVER_ERROR;
    }

    // בדיקת שגיאות רשת
    if (
      error.code === "NETWORK_ERROR" ||
      error.message?.includes("Network Error")
    ) {
      return NetworkErrorType.NO_CONNECTION;
    }

    if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
      return NetworkErrorType.TIMEOUT;
    }

    return NetworkErrorType.UNKNOWN;
  }

  // יצירת שגיאת רשת מסודרת
  createNetworkError(originalError: any): NetworkError {
    const type = this.identifyErrorType(originalError);
    const status = originalError.response?.status;

    const networkError: NetworkError = {
      name: "NetworkError",
      message: this.getTechnicalMessage(type, originalError),
      type,
      status,
      retryable: this.isRetryable(type),
      userMessage: this.getUserMessage(type),
      technicalMessage: this.getTechnicalMessage(type, originalError),
      timestamp: new Date(),
      requestId: this.generateRequestId(),
    };

    return networkError;
  }

  // בדיקה אם שגיאה ניתנת לחזרה
  private isRetryable(type: NetworkErrorType): boolean {
    const retryableTypes = [
      NetworkErrorType.NO_CONNECTION,
      NetworkErrorType.TIMEOUT,
      NetworkErrorType.SERVER_ERROR,
      NetworkErrorType.RATE_LIMITED,
    ];

    return retryableTypes.includes(type);
  }

  // הודעה למשתמש
  private getUserMessage(type: NetworkErrorType): string {
    const messages = {
      [NetworkErrorType.NO_CONNECTION]:
        "אין חיבור לאינטרנט. אנא בדוק את החיבור שלך ונסה שוב.",
      [NetworkErrorType.TIMEOUT]: "החיבור לשרת לוקח יותר מדי זמן. אנא נסה שוב.",
      [NetworkErrorType.SERVER_ERROR]: "שגיאה בשרת. אנא נסה שוב בעוד כמה דקות.",
      [NetworkErrorType.UNAUTHORIZED]: "נדרשת התחברות מחדש לחשבון.",
      [NetworkErrorType.FORBIDDEN]: "אין לך הרשאה לגשת למידע זה.",
      [NetworkErrorType.NOT_FOUND]: "המידע המבוקש לא נמצא.",
      [NetworkErrorType.RATE_LIMITED]:
        "יותר מדי בקשות. אנא המתן כמה דקות ונסה שוב.",
      [NetworkErrorType.UNKNOWN]: "אירעה שגיאה בלתי צפויה. אנא נסה שוב.",
    };

    return messages[type] || messages[NetworkErrorType.UNKNOWN];
  }

  // הודעה טכנית
  private getTechnicalMessage(
    type: NetworkErrorType,
    originalError: any
  ): string {
    const baseMessage = `Network Error [${type}]`;
    const errorDetails = originalError.message || originalError.toString();
    const status = originalError.response?.status;

    return `${baseMessage}${status ? ` (${status})` : ""}: ${errorDetails}`;
  }

  // יצירת Request ID ייחודי
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // פונקציית Retry עם Exponential Backoff
  async retryWithBackoff<T>(
    operation: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> {
    const opts = { ...DEFAULT_RETRY_OPTIONS, ...options };
    let lastError: NetworkError;

    for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          // המתנה לפני ניסיון חוזר
          const delay = Math.min(
            opts.baseDelay * Math.pow(opts.backoffFactor, attempt - 1),
            opts.maxDelay
          );

          console.log(
            `🔄 Retry attempt ${attempt}/${opts.maxRetries} after ${delay}ms`
          );
          await this.sleep(delay);
        }

        const result = await operation();

        if (attempt > 0) {
          console.log(`✅ Operation succeeded on attempt ${attempt + 1}`);
          // Haptic feedback על הצלחה אחרי retry
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }

        return result;
      } catch (error) {
        const networkError = this.createNetworkError(error);
        lastError = networkError;

        // בדיקה אם כדאי לנסות שוב
        if (attempt === opts.maxRetries || !opts.retryCondition(networkError)) {
          break;
        }

        // קריאה ל-callback של retry
        opts.onRetry(attempt + 1, networkError);

        console.warn(
          `⚠️ Attempt ${attempt + 1} failed:`,
          networkError.userMessage
        );
      }
    }

    // אם הגענו לכאן, כל הניסיונות נכשלו
    console.error(
      `❌ All ${opts.maxRetries + 1} attempts failed. Last error:`,
      lastError!
    );
    throw lastError!;
  }

  // פונקציית עזר להמתנה
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // הצגת שגיאה למשתמש
  showErrorToUser(
    error: NetworkError,
    showRetryOption: boolean = true
  ): Promise<boolean> {
    return new Promise((resolve) => {
      // Haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      const buttons = [
        {
          text: "הבנתי",
          style: "default" as const,
          onPress: () => resolve(false),
        },
      ];

      if (showRetryOption && error.retryable) {
        buttons.unshift({
          text: "נסה שוב",
          style: "default" as const,
          onPress: () => resolve(true),
        });
      }

      Alert.alert(this.getErrorTitle(error.type), error.userMessage, buttons, {
        cancelable: false,
      });
    });
  }

  // כותרת השגיאה
  private getErrorTitle(type: NetworkErrorType): string {
    const titles = {
      [NetworkErrorType.NO_CONNECTION]: "אין חיבור לאינטרנט",
      [NetworkErrorType.TIMEOUT]: "זמן החיבור פג",
      [NetworkErrorType.SERVER_ERROR]: "שגיאת שרת",
      [NetworkErrorType.UNAUTHORIZED]: "נדרשת התחברות",
      [NetworkErrorType.FORBIDDEN]: "אין הרשאה",
      [NetworkErrorType.NOT_FOUND]: "לא נמצא",
      [NetworkErrorType.RATE_LIMITED]: "יותר מדי בקשות",
      [NetworkErrorType.UNKNOWN]: "שגיאה",
    };

    return titles[type] || titles[NetworkErrorType.UNKNOWN];
  }

  // מעקב אחר שגיאות לאנליטיקס
  logError(error: NetworkError, context?: string): void {
    const logData = {
      type: error.type,
      status: error.status,
      message: error.technicalMessage,
      timestamp: error.timestamp.toISOString(),
      requestId: error.requestId,
      context,
      userAgent: navigator.userAgent,
    };

    // Log לקונסול
    console.error("🚨 Network Error logged:", logData);

    // כאן אפשר להוסיף שליחה לשירות אנליטיקס
    // analytics.logError('network_error', logData);
  }
}

// Hook לשימוש קל יותר
export const useNetworkErrorHandler = () => {
  const handler = NetworkErrorHandler.getInstance();

  const executeWithRetry = async <T>(
    operation: () => Promise<T>,
    options?: RetryOptions
  ): Promise<T> => {
    try {
      return await handler.retryWithBackoff(operation, options);
    } catch (error) {
      const networkError = error as NetworkError;

      // Log השגיאה
      handler.logError(networkError, "useNetworkErrorHandler");

      // הצג למשתמש אם נדרש
      const shouldRetry = await handler.showErrorToUser(networkError, true);

      if (shouldRetry) {
        return executeWithRetry(operation, options);
      }

      throw networkError;
    }
  };

  const handleError = (error: any, context?: string): NetworkError => {
    const networkError = handler.createNetworkError(error);
    handler.logError(networkError, context);
    return networkError;
  };

  return {
    executeWithRetry,
    handleError,
    showError: handler.showErrorToUser.bind(handler),
  };
};

// Wrapper לבקשות API
export const withNetworkErrorHandling = <T extends any[], R>(
  apiFunction: (...args: T) => Promise<R>,
  retryOptions?: RetryOptions
) => {
  return async (...args: T): Promise<R> => {
    const handler = NetworkErrorHandler.getInstance();

    const operation = () => apiFunction(...args);

    try {
      return await handler.retryWithBackoff(operation, retryOptions);
    } catch (error) {
      const networkError = handler.createNetworkError(error);
      handler.logError(networkError, apiFunction.name);
      throw networkError;
    }
  };
};

export default NetworkErrorHandler;
