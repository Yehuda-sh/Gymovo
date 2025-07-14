// src/screens/workouts/start-workout/hooks/usePlans.ts
// Wrapper קל ל-hook הראשי עם התאמות למסך התחלת אימון

import { useState, useCallback, useMemo } from "react";
import * as Haptics from "expo-haptics";
import { usePlans as useGlobalPlans } from "../../../../hooks/usePlans";
import { Plan } from "../../../../types/plan";

/**
 * Hook מותאם למסך התחלת אימון
 * מוסיף פונקציונליות של בחירת תוכנית וניהול מצב מקומי
 */
export const usePlans = () => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  // שימוש ב-hook הגלובלי
  const {
    plans,
    isLoading,
    isError,
    error,
    refetch,
    getActivePlan,
    isOffline,
  } = useGlobalPlans();

  // פונקציה לבחירת תוכנית עם haptic feedback
  const selectPlan = useCallback((plan: Plan) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedPlan(plan);
  }, []);

  // רענון עם haptic feedback
  const refresh = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await refetch();
  }, [refetch]);

  // סינון תוכניות פעילות בלבד
  const activePlans = useMemo(() => {
    return plans.filter((plan) => plan.isActive !== false);
  }, [plans]);

  // הודעת שגיאה ידידותית
  const errorMessage = useMemo(() => {
    if (error) {
      if (isOffline) {
        return "אין חיבור לאינטרנט. מציג תוכניות שמורות במטמון.";
      }
      return "לא הצלחנו לטעון את התוכניות. אנא נסה שוב.";
    }
    return null;
  }, [error, isOffline]);

  // בחר תוכנית פעילה אוטומטית אם אין בחירה
  useMemo(() => {
    if (!selectedPlan && activePlans.length > 0) {
      const activePlan = getActivePlan();
      if (activePlan) {
        setSelectedPlan(activePlan);
      }
    }
  }, [selectedPlan, activePlans, getActivePlan]);

  return {
    plans: activePlans,
    allPlans: plans, // אם צריך גישה לכל התוכניות
    isLoading,
    isRefreshing: false, // נוסיף בעתיד
    isError,
    error: errorMessage,
    selectedPlan,
    refresh,
    selectPlan,
    isOffline,
  };
};
