// File: src/types/user.ts
export interface User {
  id: string;
  email: string;
  name?: string;
  age: number;
  isGuest?: boolean;
  createdAt?: string; // תאריך הרשמה
  avatarUrl?: string;
  stats?: UserStats;
  token?: string; // לאחסון טוקן גישה
}

export interface UserStats {
  workoutsCount: number;
  totalWeightLifted: number;
  streakDays: number;
  [key: string]: number; // לאפשר הרחבה
}
