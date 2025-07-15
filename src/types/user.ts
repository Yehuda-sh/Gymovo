// src/types/user.ts - קובץ מלא ומעודכן

export interface UserStats {
  totalWorkouts: number;
  totalTime: number; // בדקות
  totalVolume: number; // בק"ג
  favoriteExercises: string[];

  // שדות נוספים שנדרשים
  workoutsCount: number;
  streakDays: number;
  longestStreak: number;
  weeklyAverage: number;
  achievementsUnlocked: number;
  personalRecordsCount: number;
  plansCompleted: number;
  challengesCompleted: number;

  // שדות נוספים לנתוני דמו
  totalDuration?: number;
  totalWeightLifted?: number;
  totalCaloriesBurned?: number;
  totalSets?: number;
  totalReps?: number;
  monthlyWorkouts?: number;
  yearlyWorkouts?: number;
  lastWorkoutDate?: string;
  strengthGain?: number;
  muscleGain?: number;
  fatLoss?: number;
  enduranceImprovement?: number;
  averageWorkoutRating?: number;
  totalWorkoutRatings?: number;
  goalsAchieved?: number;
  goalsInProgress?: number;
  muscleGroupDistribution?: Record<string, number>;
}

export interface User {
  id: string;
  email: string;
  name: string;
  age?: number;
  isGuest: boolean;
  createdAt?: string;
  stats?: UserStats;

  // שדות חדשים למשתמשי אורח
  guestCreatedAt?: string; // מתי נוצר כאורח
  guestDataExpiry?: string; // מתי הנתונים יימחקו

  // שדות אופציונליים נוספים
  avatarUrl?: string;
  phoneNumber?: string;
  preferredLanguage?: string;

  // שדות נוספים שנדרשים
  experience?: "beginner" | "intermediate" | "advanced";
  goals?: string[];
}

// טיפוסים נוספים קשורים למשתמש
export interface UserPreferences {
  theme?: "light" | "dark" | "auto";
  language?: "he" | "en";
  notifications?: {
    workoutReminders?: boolean;
    achievements?: boolean;
    updates?: boolean;
  };
  privacy?: {
    shareProgress?: boolean;
    showProfile?: boolean;
  };
}

export interface UserAchievement {
  id: string;
  type: "streak" | "volume" | "frequency" | "milestone";
  title: string;
  description: string;
  unlockedAt: string;
  icon?: string;
}

export interface UserGoal {
  id: string;
  type: "weight_loss" | "muscle_gain" | "strength" | "endurance";
  target: number;
  current: number;
  deadline?: string;
  createdAt: string;
}
