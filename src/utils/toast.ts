// src/utils/toast.ts
// פונקציות להצגת הודעות למשתמש

import { Alert, Platform, ToastAndroid } from "react-native";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastOptions {
  duration?: "short" | "long";
  position?: "top" | "center" | "bottom";
}

/**
 * הצגת הודעת Toast למשתמש
 * @param message - ההודעה להצגה
 * @param type - סוג ההודעה
 * @param options - אפשרויות נוספות
 */
export const showToast = (
  message: string,
  type: ToastType = "info",
  options?: ToastOptions
) => {
  // באנדרואיד - השתמש ב-ToastAndroid
  if (Platform.OS === "android") {
    const duration =
      options?.duration === "long" ? ToastAndroid.LONG : ToastAndroid.SHORT;

    const gravity =
      options?.position === "top"
        ? ToastAndroid.TOP
        : options?.position === "center"
        ? ToastAndroid.CENTER
        : ToastAndroid.BOTTOM;

    ToastAndroid.showWithGravity(message, duration, gravity);
    return;
  }

  // ב-iOS - השתמש ב-Alert
  const titles = {
    success: "הצלחה ✅",
    error: "שגיאה ❌",
    warning: "אזהרה ⚠️",
    info: "הודעה ℹ️",
  };

  Alert.alert(titles[type], message, [{ text: "אישור" }]);
};

/**
 * הצגת הודעת הצלחה
 */
export const showSuccessToast = (message: string, options?: ToastOptions) => {
  showToast(message, "success", options);
};

/**
 * הצגת הודעת שגיאה
 */
export const showErrorToast = (message: string, options?: ToastOptions) => {
  showToast(message, "error", options);
};

/**
 * הצגת הודעת אזהרה
 */
export const showWarningToast = (message: string, options?: ToastOptions) => {
  showToast(message, "warning", options);
};

/**
 * הצגת הודעת מידע
 */
export const showInfoToast = (message: string, options?: ToastOptions) => {
  showToast(message, "info", options);
};

// אלטרנטיבה: אם תרצה להשתמש בספריית Toast חיצונית כמו react-native-toast-message
// תוכל להתקין אותה ולהחליף את המימוש כאן
