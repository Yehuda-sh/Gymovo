// src/navigation/hooks/useNavigationSetup.ts
// הוק לאתחול מערכת הניווט עם טיפול בשגיאות ולוגיקה מתקדמת

import { useEffect, useState } from "react";
import { UserPreferencesService } from "../../services/userPreferences";

interface NavigationSetupState {
  isNavigationReady: boolean;
  error: string | null;
  isLoading: boolean;
}

/**
 * הוק לאתחול מערכת הניווט
 * מטפל באתחול שירותים, העדפות משתמש ולוגיקה נוספת
 */
export const useNavigationSetup = () => {
  const [state, setState] = useState<NavigationSetupState>({
    isNavigationReady: false,
    error: null,
    isLoading: true,
  });

  useEffect(() => {
    initializeNavigation();
  }, []);

  /**
   * אתחול מערכת הניווט עם כל השירותים הנדרשים
   */
  const initializeNavigation = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      // ✅ אתחול שירות העדפות משתמש
      const preferencesService = UserPreferencesService.getInstance();
      await preferencesService.load();

      // ✅ אתחול שירותים נוספים (ניתן להוסיף כאן)
      await Promise.all([
        // כאן ניתן להוסיף שירותים נוספים
        // await initializeAnalytics(),
        // await initializePushNotifications(),
        // await checkAppUpdates(),
      ]);

      // 🎯 סימולציה של זמן טעינה מינימלי (לחוויה טובה יותר)
      await new Promise((resolve) => setTimeout(resolve, 300));

      setState({
        isNavigationReady: true,
        error: null,
        isLoading: false,
      });

      if (__DEV__) {
        console.log("🧭 Navigation system initialized successfully");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Failed to initialize navigation:", error);

      setState({
        isNavigationReady: true, // ממשיכים גם במקרה של כשל
        error: errorMessage,
        isLoading: false,
      });

      if (__DEV__) {
        console.warn("⚠️ Navigation initialized with errors:", errorMessage);
      }
    }
  };

  /**
   * ניסיון חוזר לאתחול במקרה של כשל
   */
  const retryInitialization = () => {
    if (!state.isLoading) {
      initializeNavigation();
    }
  };

  return {
    isNavigationReady: state.isNavigationReady,
    error: state.error,
    isLoading: state.isLoading,
    retryInitialization,
  };
};

export default useNavigationSetup;
