// src/hooks/useWorkoutAnalytics.ts
// Hook נוח לשימוש באנליטיקה במסכי האימון

import { useEffect, useState, useCallback } from "react";
import { useWorkoutStore } from "../stores/workoutStore";
import {
  workoutAnalytics,
  WorkoutAnalytics,
} from "../services/workoutAnalytics.service";
import { showToast } from "../utils/toast";

export const useWorkoutAnalytics = () => {
  const workoutState = useWorkoutStore();
  const [analytics, setAnalytics] = useState<WorkoutAnalytics | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // עדכון אנליטיקה אוטומטי
  useEffect(() => {
    if (workoutState.activeWorkout) {
      const timer = setInterval(() => {
        const newAnalytics = workoutAnalytics.analyzeWorkout(workoutState);
        setAnalytics(newAnalytics);
      }, 5000); // כל 5 שניות

      return () => clearInterval(timer);
    }
  }, [
    workoutState.activeWorkout,
    workoutState.currentWorkoutStats,
    workoutState,
  ]);

  // ניתוח מיידי
  const analyzeNow = useCallback(async () => {
    setIsAnalyzing(true);
    try {
      const newAnalytics = workoutAnalytics.analyzeWorkout(workoutState);
      setAnalytics(newAnalytics);

      // הצג המלצות אם יש
      if (newAnalytics?.fatigueLevel === "exhausted") {
        showToast("⚠️ רמת עייפות גבוהה - שקול להפחית עומס", "warning");
      }

      return newAnalytics;
    } finally {
      setIsAnalyzing(false);
    }
  }, [workoutState]);

  // החלת המלצות חכמות
  const applyRecommendations = useCallback(() => {
    if (!analytics) return;

    // עדכון זמן מנוחה מומלץ
    if (analytics.recommendations.rest) {
      workoutState.updateRestTime(analytics.recommendations.rest.suggestion);
      showToast(
        `⏱️ זמן מנוחה עודכן: ${analytics.recommendations.rest.suggestion} שניות`,
        "info"
      );
    }

    // הצג המלצת משקל
    if (analytics.recommendations.weight.suggestion !== "maintain") {
      const { suggestion, amount } = analytics.recommendations.weight;
      const message =
        suggestion === "increase"
          ? `💪 מומלץ להוסיף ${amount}ק״ג`
          : `⬇️ מומלץ להפחית ${amount}ק״ג`;
      showToast(message, "info");
    }
  }, [analytics, workoutState]);

  // בדיקת סיכון פציעה
  const checkInjuryRisk = useCallback(() => {
    if (!analytics) return null;

    if (analytics.predictions.injuryRisk === "high") {
      showToast("⚠️ סיכון פציעה גבוה - שים לב לטכניקה!", "error");
      return true;
    }

    return false;
  }, [analytics]);

  // קבלת הודעת מאמן
  const getCoachingMessage = useCallback((): string => {
    if (!analytics) return "";

    const messages: string[] = [];

    // הודעות לפי ביצועים
    if (analytics.performanceScore > 80) {
      messages.push("🔥 ביצועים מעולים! המשך כך");
    } else if (analytics.performanceScore < 50) {
      messages.push("💪 אל תוותר! כל סט מקרב אותך למטרה");
    }

    // הודעות לפי עייפות
    const fatigueMessages = {
      fresh: "💯 אתה במצב מעולה!",
      optimal: "👍 רמת אנרגיה טובה",
      tired: "😮‍💨 מתחיל להרגיש את העייפות",
      exhausted: "🥵 עייפות ניכרת - שקול לסיים",
    };
    messages.push(fatigueMessages[analytics.fatigueLevel]);

    // חיזוי PR
    if (analytics.predictions.expectedPR) {
      messages.push("🏆 נראה שאתה בדרך לשיא אישי!");
    }

    return messages.join(" ");
  }, [analytics]);

  return {
    analytics,
    isAnalyzing,
    analyzeNow,
    applyRecommendations,
    checkInjuryRisk,
    getCoachingMessage,

    // גישה ישירה לנתונים
    performanceScore: analytics?.performanceScore || 0,
    fatigueLevel: analytics?.fatigueLevel || "fresh",
    nextSetSuccessProbability: analytics?.predictions.nextSetSuccess || 1,
  };
};
