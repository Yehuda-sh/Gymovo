// src/types/user.ts - קובץ מלא ומעודכן

export interface UserStats {
  totalWorkouts: number;
  totalTime: number; // בדקות
  totalVolume: number; // בק"ג
  favoriteExercises: string[];
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
