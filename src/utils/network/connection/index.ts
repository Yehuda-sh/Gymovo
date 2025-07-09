// src/utils/network/connection/index.ts
// פונקציות בדיקת חיבור רשת

import NetInfo from "@react-native-community/netinfo";
import { NetworkError } from "../types";
import { createNetworkError, showNetworkError } from "../errors";

/**
 * בדיקת חיבור לאינטרנט
 * @returns Promise<boolean> - האם יש חיבור
 */
export const checkInternetConnection = async (): Promise<boolean> => {
  try {
    const netInfo = await NetInfo.fetch();
    return netInfo.isConnected ?? false;
  } catch (error) {
    console.warn("Failed to check internet connection:", error);
    return false;
  }
};

/**
 * בדיקת איכות החיבור
 * @returns Promise<'good' | 'poor' | 'none'> - איכות החיבור
 */
export const getConnectionQuality = async (): Promise<
  "good" | "poor" | "none"
> => {
  try {
    const netInfo = await NetInfo.fetch();

    if (!netInfo.isConnected) {
      return "none";
    }

    // בדיקה לפי סוג הרשת
    if (netInfo.type === "wifi") {
      return "good";
    }

    if (netInfo.type === "cellular") {
      // אם יש מידע על כוח האות
      const details = netInfo.details as any;
      if (details?.strength && details.strength > 3) {
        return "good";
      }
      return "poor";
    }

    return "poor";
  } catch (error) {
    console.warn("Failed to get connection quality:", error);
    return "poor";
  }
};

/**
 * מבצע פעולה רק אם יש חיבור לאינטרנט
 * @param action הפעולה לביצוע
 * @param errorMessage הודעת שגיאה מותאמת
 */
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

/**
 * ממתין לחיבור רשת
 * @param timeout מקסימום זמן המתנה במילישניות
 * @param checkInterval מרווח בדיקה במילישניות
 */
export const waitForConnection = async (
  timeout: number = 30000,
  checkInterval: number = 1000
): Promise<boolean> => {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const isConnected = await checkInternetConnection();

    if (isConnected) {
      return true;
    }

    await new Promise((resolve) => setTimeout(resolve, checkInterval));
  }

  return false;
};
