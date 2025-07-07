// src/types/user.ts - מעודכן עם שדות חדשים
export interface User {
  id: string;
  email: string;
  name?: string;
  age: number;
  isGuest?: boolean;
  createdAt?: string;
  avatarUrl?: string;
  stats?: UserStats;
  token?: string;

  // 🆕 שדות חדשים לשלב 1
  experience?: "beginner" | "intermediate" | "advanced";
  goals?: string[];
  joinedAt?: string;
}

export interface UserStats {
  workoutsCount: number;
  totalWeightLifted: number;
  streakDays: number;
  [key: string]: number;
}
