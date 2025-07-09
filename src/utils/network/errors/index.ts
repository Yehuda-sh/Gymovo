// src/utils/network/errors/index.ts
// טיפול בשגיאות רשת

import { Alert } from "react-native";
import { NetworkError, HTTP_STATUS } from "../types";

/**
 * יוצר שגיאת רשת מותאמת
 * @param message הודעת השגיאה
 * @param statusCode קוד סטטוס HTTP
 */
export const createNetworkError = (
  message: string,
  statusCode?: number
): NetworkError => {
  const error = new Error(message) as NetworkError;
  error.statusCode = statusCode;
  error.isNetworkError = true;
  return error;
};

/**
 * מוסיף פונקצית retry לשגיאה
 * @param error השגיאה המקורית
 * @param retryFn פונקצית הניסיון החוזר
 */
export const enhanceError = (
  error: Error,
  retryFn: () => Promise<any>
): NetworkError => {
  const networkError = error as NetworkError;
  networkError.retry = retryFn;
  networkError.isNetworkError = true;
  return networkError;
};

/**
 * מציג שגיאת רשת למשתמש עם אפשרות retry
 * @param error השגיאה להצגה
 * @param customMessage הודעה מותאמת אישית
 */
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

/**
 * ממיר שגיאה להודעה ידידותית בעברית
 * @param error השגיאה לתרגום
 */
export const getErrorMessage = (error: NetworkError): string => {
  if (!error.isNetworkError) {
    return "אירעה שגיאה לא צפויה";
  }

  if (error.statusCode === 0) {
    return "אין חיבור לאינטרנט. אנא בדוק את החיבור שלך.";
  }

  switch (error.statusCode) {
    case HTTP_STATUS.BAD_REQUEST:
      return "הבקשה שגויה. אנא נסה שוב.";
    case HTTP_STATUS.UNAUTHORIZED:
      return "נדרשת הזדהות מחדש.";
    case HTTP_STATUS.FORBIDDEN:
      return "אין לך הרשאה לבצע פעולה זו.";
    case HTTP_STATUS.NOT_FOUND:
      return "המידע המבוקש לא נמצא.";
    case HTTP_STATUS.TIMEOUT:
      return "תם הזמן המוקצב לבקשה. אנא נסה שוב.";
    case HTTP_STATUS.INTERNAL_SERVER_ERROR:
    case HTTP_STATUS.BAD_GATEWAY:
    case HTTP_STATUS.SERVICE_UNAVAILABLE:
      return "שגיאה בשרת. אנא נסה שוב מאוחר יותר.";
    default:
      return "שגיאת חיבור. אנא נסה שוב.";
  }
};

/**
 * בדיקה האם השגיאה היא שגיאת רשת
 * @param error השגיאה לבדיקה
 */
export const isNetworkError = (error: any): error is NetworkError => {
  return error && typeof error === "object" && error.isNetworkError === true;
};

/**
 * בדיקה האם השגיאה היא timeout
 * @param error השגיאה לבדיקה
 */
export const isTimeoutError = (error: NetworkError): boolean => {
  return (
    error.statusCode === HTTP_STATUS.TIMEOUT ||
    error.message.includes("timeout") ||
    error.message.includes("TIMEOUT")
  );
};

/**
 * בדיקה האם השגיאה דורשת התחברות מחדש
 * @param error השגיאה לבדיקה
 */
export const requiresReauth = (error: NetworkError): boolean => {
  return error.statusCode === HTTP_STATUS.UNAUTHORIZED;
};
