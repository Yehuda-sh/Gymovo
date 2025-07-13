// src/services/workoutAnalytics.service.ts
// שירות אנליטיקה נפרד שעובד עם ה-workoutStore הקיים

import { WorkoutState, useWorkoutStore } from "../stores/workoutStore";
import { Workout, WorkoutExercise } from "../types/workout";

// 🧠 ממשק אנליטיקה
export interface WorkoutAnalytics {
  performanceScore: number;
  fatigueLevel: "fresh" | "optimal" | "tired" | "exhausted";
  techniqueQuality: "excellent" | "good" | "needs-work" | "poor";

  recommendations: {
    weight: {
      suggestion: "increase" | "maintain" | "decrease";
      amount?: number;
    };
    rest: {
      suggestion: number;
      reason: string;
    };
    technique: string[];
  };

  predictions: {
    nextSetSuccess: number;
    injuryRisk: "low" | "medium" | "high";
    expectedPR: boolean;
  };
}

// 🔧 שירות האנליטיקה
export class WorkoutAnalyticsService {
  private static instance: WorkoutAnalyticsService;

  private constructor() {}

  static getInstance(): WorkoutAnalyticsService {
    if (!WorkoutAnalyticsService.instance) {
      WorkoutAnalyticsService.instance = new WorkoutAnalyticsService();
    }
    return WorkoutAnalyticsService.instance;
  }

  // 📊 ניתוח ביצועים כללי
  analyzeWorkout(state: WorkoutState): WorkoutAnalytics | null {
    if (!state.activeWorkout) return null;

    return {
      performanceScore: this.calculatePerformanceScore(state),
      fatigueLevel: this.detectFatigueLevel(state),
      techniqueQuality: this.assessTechniqueQuality(state),
      recommendations: this.generateRecommendations(state),
      predictions: this.generatePredictions(state),
    };
  }

  // 🎯 חישוב ציון ביצועים
  private calculatePerformanceScore(state: WorkoutState): number {
    if (!state.activeWorkout) return 0;

    const { completedSets, totalSets, volume } = state.currentWorkoutStats;
    const completionRate = totalSets > 0 ? completedSets / totalSets : 0;

    // חישוב מורכב
    const volumeScore = Math.min(volume / 10000, 1) * 30;
    const completionScore = completionRate * 40;
    const consistencyScore = this.calculateConsistencyScore(state) * 30;

    return Math.round(volumeScore + completionScore + consistencyScore);
  }

  // 😴 זיהוי רמת עייפות
  private detectFatigueLevel(
    state: WorkoutState
  ): WorkoutAnalytics["fatigueLevel"] {
    if (
      !state.activeWorkout ||
      state.currentExerciseIndex >= state.activeWorkout.exercises.length
    ) {
      return "fresh";
    }

    const currentExercise =
      state.activeWorkout.exercises[state.currentExerciseIndex];
    if (!currentExercise) return "fresh";

    const completedSets = currentExercise.sets.filter(
      (s) => s.status === "completed"
    );
    if (completedSets.length < 2) return "fresh";

    // חישוב ירידה בביצועים
    const firstSetVolume =
      (completedSets[0].actualWeight || 0) * (completedSets[0].actualReps || 0);
    const lastSetVolume =
      (completedSets[completedSets.length - 1].actualWeight || 0) *
      (completedSets[completedSets.length - 1].actualReps || 0);

    if (firstSetVolume === 0) return "fresh";

    const dropPercentage =
      ((firstSetVolume - lastSetVolume) / firstSetVolume) * 100;

    if (dropPercentage < 10) return "fresh";
    if (dropPercentage < 20) return "optimal";
    if (dropPercentage < 30) return "tired";
    return "exhausted";
  }

  // 💪 הערכת איכות טכניקה
  private assessTechniqueQuality(
    state: WorkoutState
  ): WorkoutAnalytics["techniqueQuality"] {
    // בעתיד: ניתוח וידאו או מד תאוצה
    // כרגע: הערכה לפי עקביות
    const consistency = this.calculateConsistencyScore(state);

    if (consistency > 0.9) return "excellent";
    if (consistency > 0.7) return "good";
    if (consistency > 0.5) return "needs-work";
    return "poor";
  }

  // 📝 יצירת המלצות
  private generateRecommendations(
    state: WorkoutState
  ): WorkoutAnalytics["recommendations"] {
    const fatigueLevel = this.detectFatigueLevel(state);

    // המלצות מנוחה
    const restRecommendation = this.getRestRecommendation(fatigueLevel);

    // המלצות משקל
    const weightRecommendation = this.getWeightRecommendation(state);

    // המלצות טכניקה
    const techniqueRecommendations = this.getTechniqueRecommendations(state);

    return {
      weight: weightRecommendation,
      rest: restRecommendation,
      technique: techniqueRecommendations,
    };
  }

  // 🔮 יצירת חיזויים
  private generatePredictions(
    state: WorkoutState
  ): WorkoutAnalytics["predictions"] {
    const fatigueLevel = this.detectFatigueLevel(state);
    const nextSetSuccess = this.predictNextSetSuccess(state, fatigueLevel);
    const injuryRisk = this.assessInjuryRisk(state, fatigueLevel);
    const expectedPR = this.checkForPotentialPR(state);

    return {
      nextSetSuccess,
      injuryRisk,
      expectedPR,
    };
  }

  // === פונקציות עזר פרטיות ===

  private calculateConsistencyScore(state: WorkoutState): number {
    if (
      !state.activeWorkout ||
      state.currentExerciseIndex >= state.activeWorkout.exercises.length
    ) {
      return 0;
    }

    const currentExercise =
      state.activeWorkout.exercises[state.currentExerciseIndex];
    const completedSets = currentExercise.sets.filter(
      (s) => s.status === "completed"
    );

    if (completedSets.length < 2) return 1;

    // חישוב סטיית תקן של חזרות
    const reps = completedSets.map((s) => s.actualReps || 0);
    const avgReps = reps.reduce((sum, r) => sum + r, 0) / reps.length;
    const variance =
      reps.reduce((sum, r) => sum + Math.pow(r - avgReps, 2), 0) / reps.length;
    const stdDev = Math.sqrt(variance);

    // המרה לציון 0-1 (פחות סטייה = ציון גבוה יותר)
    return Math.max(0, 1 - stdDev / avgReps);
  }

  private getRestRecommendation(
    fatigueLevel: WorkoutAnalytics["fatigueLevel"]
  ) {
    const recommendations = {
      fresh: { suggestion: 60, reason: "ביצועים מעולים, מנוחה קצרה מספיקה" },
      optimal: { suggestion: 90, reason: "רמת ביצועים טובה, מנוחה רגילה" },
      tired: { suggestion: 120, reason: "סימני עייפות, מומלץ להאריך מנוחה" },
      exhausted: { suggestion: 180, reason: "עייפות ניכרת, נדרשת מנוחה ארוכה" },
    };

    return recommendations[fatigueLevel];
  }

  private getWeightRecommendation(
    state: WorkoutState
  ): WorkoutAnalytics["recommendations"]["weight"] {
    if (
      !state.activeWorkout ||
      state.currentExerciseIndex >= state.activeWorkout.exercises.length
    ) {
      return { suggestion: "maintain" };
    }

    const currentExercise =
      state.activeWorkout.exercises[state.currentExerciseIndex];
    const completedSets = currentExercise.sets.filter(
      (s) => s.status === "completed"
    );

    if (completedSets.length === 0) {
      return { suggestion: "maintain" };
    }

    // אם כל הסטים בוצעו בקלות (מעל 12 חזרות)
    const allSetsEasy = completedSets.every((s) => (s.actualReps || 0) >= 12);
    if (allSetsEasy) {
      return {
        suggestion: "increase",
        amount: 2.5,
      };
    }

    // אם יש קושי (מתחת ל-8 חזרות)
    const strugglingReps = completedSets.some((s) => (s.actualReps || 0) < 8);
    if (strugglingReps) {
      return {
        suggestion: "decrease",
        amount: 2.5,
      };
    }

    return { suggestion: "maintain" };
  }

  private getTechniqueRecommendations(state: WorkoutState): string[] {
    const recommendations: string[] = [];
    const fatigueLevel = this.detectFatigueLevel(state);

    if (fatigueLevel === "exhausted") {
      recommendations.push("שים לב לטכניקה - עייפות עלולה לפגוע בביצוע");
    }

    if (this.calculateConsistencyScore(state) < 0.7) {
      recommendations.push("נסה לשמור על מספר חזרות עקבי בין הסטים");
    }

    return recommendations;
  }

  private predictNextSetSuccess(
    state: WorkoutState,
    fatigueLevel: WorkoutAnalytics["fatigueLevel"]
  ): number {
    let probability = 0.9;

    const fatigueFactors = {
      fresh: 1.0,
      optimal: 0.95,
      tired: 0.8,
      exhausted: 0.6,
    };

    probability *= fatigueFactors[fatigueLevel];

    // הפחתה נוספת לפי מספר סטים שכבר בוצעו
    if (
      state.activeWorkout &&
      state.currentExerciseIndex < state.activeWorkout.exercises.length
    ) {
      const currentExercise =
        state.activeWorkout.exercises[state.currentExerciseIndex];
      const completedSetsCount = currentExercise.sets.filter(
        (s) => s.status === "completed"
      ).length;
      probability *= Math.max(0.5, 1 - completedSetsCount * 0.1);
    }

    return probability;
  }

  private assessInjuryRisk(
    state: WorkoutState,
    fatigueLevel: WorkoutAnalytics["fatigueLevel"]
  ): "low" | "medium" | "high" {
    if (fatigueLevel === "exhausted") return "high";
    if (fatigueLevel === "tired") return "medium";
    return "low";
  }

  private checkForPotentialPR(state: WorkoutState): boolean {
    // בעתיד: השוואה להיסטוריה
    // כרגע: בדיקה פשוטה
    const score = this.calculatePerformanceScore(state);
    return score > 85;
  }
}

// יצירת instance יחיד
export const workoutAnalytics = WorkoutAnalyticsService.getInstance();
