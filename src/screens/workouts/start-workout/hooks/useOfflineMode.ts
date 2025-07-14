// src/screens/workouts/start-workout/hooks/useOfflineMode.ts

import { useState, useEffect } from "react";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import { Alert } from "react-native";

export const useOfflineMode = () => {
  const [isOffline, setIsOffline] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const offline = !state.isConnected;

      // Show alert when going offline
      if (offline && !wasOffline) {
        Alert.alert(
          "אין חיבור לאינטרנט",
          "חלק מהפונקציות עשויות להיות מוגבלות",
          [{ text: "אישור" }]
        );
      }

      // Show alert when coming back online
      if (!offline && wasOffline) {
        Alert.alert("החיבור חזר", "כל הפונקציות זמינות כעת", [
          { text: "אישור" },
        ]);
      }

      setIsOffline(offline);
      setWasOffline(offline);
    });

    // Check initial state
    NetInfo.fetch().then((state) => {
      setIsOffline(!state.isConnected);
    });

    return unsubscribe;
  }, [wasOffline]);

  return { isOffline };
};
