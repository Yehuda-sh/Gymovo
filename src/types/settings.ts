// src/types/settings.ts - טיפוסים להגדרות

export interface UserPreferences {
  // 🎨 עיצוב ונושא
  theme: "dark" | "light" | "auto";
  accentColor: string;

  // 🔔 התראות
  notifications: {
    workoutReminders: boolean;
    restReminders: boolean;
    weeklyGoals: boolean;
    achievements: boolean;
    pushNotifications: boolean;
  };

  // 🏋️ אימונים
  workout: {
    defaultRestTime: number; // בשניות
    autoStartTimer: boolean;
    playBeepSounds: boolean;
    hapticFeedback: boolean;
    units: "kg" | "lbs";
    showVideoGuides: boolean;
  };

  // 📊 פרטיות ונתונים
  privacy: {
    shareWorkouts: boolean;
    allowAnalytics: boolean;
    shareProgress: boolean;
    backupData: boolean;
  };

  // 🌐 כללי
  general: {
    language: "he" | "en";
    dateFormat: "dd/mm/yyyy" | "mm/dd/yyyy";
    timeFormat: "24h" | "12h";
    firstDayOfWeek: "sunday" | "monday";
  };
}

export interface AppSettings {
  version: string;
  buildNumber: string;
  lastUpdated: string;
  userId?: string;
  deviceId: string;
}

// ברירות מחדל
export const defaultPreferences: UserPreferences = {
  theme: "dark",
  accentColor: "#00ff88",

  notifications: {
    workoutReminders: true,
    restReminders: true,
    weeklyGoals: true,
    achievements: true,
    pushNotifications: true,
  },

  workout: {
    defaultRestTime: 90,
    autoStartTimer: true,
    playBeepSounds: false,
    hapticFeedback: true,
    units: "kg",
    showVideoGuides: true,
  },

  privacy: {
    shareWorkouts: false,
    allowAnalytics: true,
    shareProgress: false,
    backupData: true,
  },

  general: {
    language: "he",
    dateFormat: "dd/mm/yyyy",
    timeFormat: "24h",
    firstDayOfWeek: "sunday",
  },
};
