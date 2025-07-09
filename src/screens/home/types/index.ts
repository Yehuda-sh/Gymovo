// src/screens/home/types/index.ts
// ממשקים עבור מסך הבית - דשבורד וסטטיסטיקות

import { Ionicons } from "@expo/vector-icons";
import { Plan } from "../../../types/plan";
import { Workout } from "../../../types/workout";

// 📊 נתוני הדשבורד הראשי
export interface DashboardData {
  recentWorkouts: Workout[];
  activePlans: Plan[];
  weeklyStats: {
    completedWorkouts: number;
    totalWeightLifted: number;
    totalDuration: number;
    streak: number;
  };
  todaysWorkout?: Plan;
}

// 🎯 פעולה מהירה
export interface QuickAction {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
  disabled?: boolean;
}

// 📈 סטטיסטיקה
export interface StatItem {
  label: string;
  value: number | string;
  unit?: string;
  icon: keyof typeof Ionicons.glyphMap;
  trend?: "up" | "down" | "neutral";
}

// 🎨 מצב אימונים
export interface WorkoutDisplayData {
  id: string;
  name: string;
  date: string;
  exercises: number;
  duration?: number;
  rating?: number;
}
