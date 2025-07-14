// src/hooks/useNetworkStatus.ts

import { useEffect, useState, useCallback } from "react";
import NetInfo, {
  NetInfoState,
  NetInfoStateType,
} from "@react-native-community/netinfo";
import { Toast } from "../components/common/Toast";

// Types
export interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean;
  type: NetInfoStateType;
  isWifi: boolean;
  isCellular: boolean;
  isOffline: boolean;
  details: {
    isConnectionExpensive?: boolean;
    cellularGeneration?: string | null;
    carrier?: string | null;
    ipAddress?: string | null;
    subnet?: string | null;
  };
}

export interface UseNetworkStatusOptions {
  onConnect?: () => void;
  onDisconnect?: () => void;
  showToasts?: boolean;
  checkInterval?: number; // בmilliseconds
}

/**
 * Hook מתקדם לניטור מצב הרשת
 * @param options - אפשרויות הגדרה
 * @returns מידע מפורט על מצב הרשת ופונקציות עזר
 */
export const useNetworkStatus = (options: UseNetworkStatusOptions = {}) => {
  const {
    onConnect,
    onDisconnect,
    showToasts = true,
    checkInterval = 30000, // בדיקה כל 30 שניות
  } = options;

  // State
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isConnected: true,
    isInternetReachable: true,
    type: NetInfoStateType.unknown,
    isWifi: false,
    isCellular: false,
    isOffline: false,
    details: {},
  });

  const [previouslyConnected, setPreviouslyConnected] = useState(true);
  const [lastCheckTime, setLastCheckTime] = useState(Date.now());
  const [isChecking, setIsChecking] = useState(false);

  // פונקציה לעיבוד מידע הרשת
  const processNetworkState = useCallback(
    (state: NetInfoState): NetworkStatus => {
      const isConnected = state.isConnected ?? false;
      const isInternetReachable = state.isInternetReachable ?? false;

      // בדיקה בטוחה של details לפי סוג החיבור
      let details: NetworkStatus["details"] = {};

      if (state.details) {
        // תמיד קיימים
        details.isConnectionExpensive = state.details.isConnectionExpensive;

        // ספציפי לסוג החיבור
        if (
          state.type === NetInfoStateType.cellular &&
          "cellularGeneration" in state.details
        ) {
          details.cellularGeneration = (
            state.details as any
          ).cellularGeneration;
          details.carrier = (state.details as any).carrier;
        }

        if (
          state.type === NetInfoStateType.wifi &&
          "ipAddress" in state.details
        ) {
          details.ipAddress = (state.details as any).ipAddress;
          details.subnet = (state.details as any).subnet;
        }
      }

      return {
        isConnected,
        isInternetReachable,
        type: state.type,
        isWifi: state.type === NetInfoStateType.wifi,
        isCellular: state.type === NetInfoStateType.cellular,
        isOffline: !isConnected || !isInternetReachable,
        details,
      };
    },
    []
  );

  // טיפול בשינוי מצב חיבור
  const handleConnectionChange = useCallback(
    (newStatus: NetworkStatus) => {
      const wasConnected = previouslyConnected;
      const isNowConnected =
        newStatus.isConnected && newStatus.isInternetReachable;

      // אם השתנה המצב
      if (wasConnected !== isNowConnected) {
        setPreviouslyConnected(isNowConnected);

        if (isNowConnected && !wasConnected) {
          // חזרנו להיות מחוברים
          if (showToasts) {
            Toast.success("החיבור לאינטרנט שוחזר");
          }
          onConnect?.();
        } else if (!isNowConnected && wasConnected) {
          // התנתקנו
          if (showToasts) {
            Toast.error("אין חיבור לאינטרנט");
          }
          onDisconnect?.();
        }
      }
    },
    [previouslyConnected, showToasts, onConnect, onDisconnect]
  );

  // בדיקה ידנית של מצב הרשת
  const checkConnection = useCallback(async () => {
    if (isChecking) return;

    setIsChecking(true);
    try {
      const state = await NetInfo.fetch();
      const status = processNetworkState(state);
      setNetworkStatus(status);
      handleConnectionChange(status);
      setLastCheckTime(Date.now());
      return status;
    } catch (error) {
      console.error("Error checking network status:", error);
      return networkStatus;
    } finally {
      setIsChecking(false);
    }
  }, [isChecking, processNetworkState, handleConnectionChange, networkStatus]);

  // בדיקה אם החיבור איטי
  const isSlowConnection = useCallback(() => {
    if (!networkStatus.isConnected) return false;

    // חיבור סלולרי דור 2 או 3
    if (networkStatus.isCellular) {
      const generation = networkStatus.details.cellularGeneration;
      return generation === "2g" || generation === "3g";
    }

    return false;
  }, [networkStatus]);

  // קבלת תיאור מצב הרשת
  const getConnectionDescription = useCallback(() => {
    if (!networkStatus.isConnected) {
      return "לא מחובר";
    }

    if (!networkStatus.isInternetReachable) {
      return "מחובר לרשת ללא אינטרנט";
    }

    if (networkStatus.isWifi) {
      return "מחובר ב-WiFi";
    }

    if (networkStatus.isCellular) {
      const generation = networkStatus.details.cellularGeneration;
      return `רשת סלולרית${generation ? ` ${generation.toUpperCase()}` : ""}`;
    }

    return "מחובר";
  }, [networkStatus]);

  // האזנה לשינויים במצב הרשת
  useEffect(() => {
    // בדיקה ראשונית
    checkConnection();

    // האזנה לשינויים
    const unsubscribe = NetInfo.addEventListener((state) => {
      const status = processNetworkState(state);
      setNetworkStatus(status);
      handleConnectionChange(status);
    });

    // בדיקה תקופתית (אופציונלי)
    let intervalId: NodeJS.Timeout | null = null;
    if (checkInterval > 0) {
      intervalId = setInterval(() => {
        checkConnection();
      }, checkInterval);
    }

    // Cleanup
    return () => {
      unsubscribe();
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [
    processNetworkState,
    handleConnectionChange,
    checkConnection,
    checkInterval,
  ]);

  return {
    // מצב בסיסי
    isConnected: networkStatus.isConnected,
    isInternetReachable: networkStatus.isInternetReachable,
    isOffline: networkStatus.isOffline,

    // מידע מפורט
    networkStatus,
    connectionType: networkStatus.type,
    isWifi: networkStatus.isWifi,
    isCellular: networkStatus.isCellular,
    isSlowConnection: isSlowConnection(),
    connectionDescription: getConnectionDescription(),

    // מטא-דאטה
    lastCheckTime,
    isChecking,

    // פונקציות
    checkConnection,
    refresh: checkConnection,
  };
};

// Hook פשוט יותר לשימוש בסיסי
export const useIsOnline = () => {
  const { isConnected, isInternetReachable } = useNetworkStatus({
    showToasts: false,
  });
  return isConnected && isInternetReachable;
};

// Hook לבדיקת חיבור WiFi
export const useIsWifi = () => {
  const { isWifi } = useNetworkStatus({ showToasts: false });
  return isWifi;
};

// Utils לבדיקות רשת
export const NetworkUtils = {
  /**
   * בדיקה חד-פעמית של מצב הרשת
   */
  checkConnection: async (): Promise<boolean> => {
    try {
      const state = await NetInfo.fetch();
      return !!(state.isConnected && state.isInternetReachable === true);
    } catch {
      return false;
    }
  },

  /**
   * בדיקה אם יש חיבור WiFi
   */
  isWifiConnected: async (): Promise<boolean> => {
    try {
      const state = await NetInfo.fetch();
      return state.type === NetInfoStateType.wifi && state.isConnected === true;
    } catch {
      return false;
    }
  },

  /**
   * קבלת מידע מלא על הרשת
   */
  getFullNetworkInfo: async (): Promise<NetworkStatus | null> => {
    try {
      const state = await NetInfo.fetch();

      // בדיקה בטוחה של details
      let details: NetworkStatus["details"] = {};

      if (state.details) {
        details.isConnectionExpensive = state.details.isConnectionExpensive;

        // Type guard לסוג החיבור
        if (
          state.type === NetInfoStateType.cellular &&
          "cellularGeneration" in state.details
        ) {
          details.cellularGeneration = (
            state.details as any
          ).cellularGeneration;
          details.carrier = (state.details as any).carrier;
        }

        if (
          state.type === NetInfoStateType.wifi &&
          "ipAddress" in state.details
        ) {
          details.ipAddress = (state.details as any).ipAddress;
          details.subnet = (state.details as any).subnet;
        }
      }

      return {
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable ?? false,
        type: state.type,
        isWifi: state.type === NetInfoStateType.wifi,
        isCellular: state.type === NetInfoStateType.cellular,
        isOffline: !state.isConnected || !state.isInternetReachable,
        details,
      };
    } catch {
      return null;
    }
  },
};

// Type exports
export type {
  NetInfoState,
  NetInfoStateType,
} from "@react-native-community/netinfo";
