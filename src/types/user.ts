// src/types/user.ts - ✅ טיפוסים מלאים ומעודכנים למשתמש

// 🏋️ רמת ניסיון
export type ExperienceLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert";

// 🎯 יעדי אימון
export type FitnessGoal =
  | "strength"
  | "muscle_gain"
  | "weight_loss"
  | "endurance"
  | "general_fitness"
  | "athletic_performance"
  | "rehabilitation";

// 📍 מיקום אימון מועדף
export type PreferredLocation = "gym" | "home" | "outdoor" | "hybrid";

// 👤 משתמש ראשי
export interface User {
  // 🆔 זיהוי
  id: string;
  email: string;
  name?: string;
  username?: string;

  // 📊 פרטים אישיים
  age: number;
  gender?: "male" | "female" | "other";
  height?: number; // בס"מ
  weight?: number; // בק"ג
  bodyFat?: number; // באחוזים

  // 🏋️ פרופיל כושר
  experience?: ExperienceLevel;
  fitnessLevel?: 1 | 2 | 3 | 4 | 5; // 1-מתחיל, 5-מתקדם מאוד
  goals?: FitnessGoal[];
  injuries?: string[];
  medicalConditions?: string[];

  // 📍 העדפות אימון
  preferredLocation?: PreferredLocation;
  preferredWorkoutDays?: string[]; // ["sunday", "tuesday", "thursday"]
  preferredWorkoutTime?: "morning" | "afternoon" | "evening";
  workoutDuration?: number; // דקות מועדפות לאימון
  equipment?: string[]; // ציוד זמין

  // 🖼️ פרופיל
  avatarUrl?: string;
  coverImageUrl?: string;
  bio?: string;
  motivationalQuote?: string;

  // 📈 סטטיסטיקות
  stats?: UserStats;
  achievements?: Achievement[];
  personalRecords?: PersonalRecord[];

  // 🔔 הגדרות
  preferences?: UserPreferences;
  notifications?: NotificationSettings;

  // 🏷️ סטטוס
  isGuest?: boolean;
  isPremium?: boolean;
  isVerified?: boolean;
  isActive?: boolean;
  isCoach?: boolean;

  // 🔐 אבטחה
  token?: string;
  refreshToken?: string;
  lastLogin?: string;
  loginCount?: number;

  // ⏰ חותמות זמן
  createdAt?: string;
  updatedAt?: string;
  joinedAt?: string; // alias לתאימות אחורה
  deletedAt?: string;

  // 📱 מכשיר ופלטפורמה
  deviceInfo?: {
    platform?: "ios" | "android";
    deviceId?: string;
    appVersion?: string;
    osVersion?: string;
  };

  // 🌐 מיקום ושפה
  location?: {
    country?: string;
    city?: string;
    timezone?: string;
  };
  language?: string; // "he", "en"
  currency?: string; // "ILS", "USD"
}

// 📊 סטטיסטיקות משתמש
export interface UserStats {
  // 🏋️ סטטיסטיקות אימון
  workoutsCount: number;
  totalDuration: number; // בדקות
  totalWeightLifted: number; // בק"ג
  totalCaloriesBurned: number;
  totalSets: number;
  totalReps: number;

  // 📅 עקביות
  streakDays: number;
  longestStreak: number;
  weeklyAverage: number;
  monthlyWorkouts: number;
  yearlyWorkouts: number;
  lastWorkoutDate?: string;

  // 💪 התקדמות
  strengthGain?: number; // אחוז עלייה במשקלים
  muscleGain?: number; // ק"ג שרירים
  fatLoss?: number; // ק"ג שומן
  enduranceImprovement?: number; // אחוז שיפור

  // 🏆 הישגים
  achievementsUnlocked: number;
  personalRecordsCount: number;
  plansCompleted: number;
  challengesCompleted: number;

  // 📊 חלוקה לפי קבוצות שרירים
  muscleGroupDistribution?: {
    [muscleGroup: string]: number; // אחוז מהאימונים
  };

  // ⭐ דירוגים
  averageWorkoutRating?: number;
  totalWorkoutRatings?: number;

  // 🎯 יעדים
  goalsAchieved?: number;
  goalsInProgress?: number;
}

// 🏆 הישג
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "strength" | "consistency" | "volume" | "special" | "social";
  unlockedAt: string;
  progress?: number; // 0-100
  target?: number;
  unit?: string;
  rarity?: "common" | "rare" | "epic" | "legendary";
  points?: number;
}

// 💪 שיא אישי
export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  type: "weight" | "reps" | "time" | "distance" | "volume";
  value: number;
  previousValue?: number;
  improvement?: number; // אחוז שיפור
  achievedAt: string;
  workoutId?: string;
  verified?: boolean;
}

// ⚙️ העדפות משתמש
export interface UserPreferences {
  // 🎨 תצוגה
  theme?: "light" | "dark" | "auto";
  colorScheme?: string;
  fontSize?: "small" | "medium" | "large";

  // 📊 יחידות מדידה
  weightUnit?: "kg" | "lbs";
  distanceUnit?: "km" | "miles";
  heightUnit?: "cm" | "ft";
  temperatureUnit?: "celsius" | "fahrenheit";

  // 🏋️ העדפות אימון
  restTimerDuration?: number; // שניות
  autoStartTimer?: boolean;
  soundEffects?: boolean;
  hapticFeedback?: boolean;
  keepScreenOn?: boolean;

  // 📱 פרטיות
  profileVisibility?: "public" | "friends" | "private";
  shareProgress?: boolean;
  allowChallenges?: boolean;
  showOnLeaderboard?: boolean;

  // 🗣️ תקשורת
  language?: string;
  dateFormat?: string;
  firstDayOfWeek?: "sunday" | "monday";
  use24HourTime?: boolean;
}

// 🔔 הגדרות התראות
export interface NotificationSettings {
  // 🏋️ תזכורות אימון
  workoutReminders?: boolean;
  reminderTime?: string; // "08:00"
  reminderDays?: string[];

  // 📊 עדכוני התקדמות
  progressUpdates?: boolean;
  weeklyReport?: boolean;
  monthlyReport?: boolean;

  // 🏆 הישגים וחברתי
  achievementAlerts?: boolean;
  socialNotifications?: boolean;
  challengeInvites?: boolean;

  // 💬 תקשורת
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  smsNotifications?: boolean;

  // 🔕 מצב שקט
  quietHours?: {
    enabled: boolean;
    start: string; // "22:00"
    end: string; // "07:00"
  };
}

// 🏃 פרופיל אימון מפורט
export interface FitnessProfile {
  userId: string;

  // 💪 מדדים פיזיים
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    thighs?: number;
    arms?: number;
    neck?: number;
  };

  // 🏃 יכולות
  performance?: {
    benchPress1RM?: number;
    squat1RM?: number;
    deadlift1RM?: number;
    pullUps?: number;
    pushUps?: number;
    plankTime?: number; // שניות
    runTime5K?: number; // דקות
  };

  // 🎯 יעדים מפורטים
  detailedGoals?: {
    targetWeight?: number;
    targetBodyFat?: number;
    targetMeasurements?: Partial<FitnessProfile["measurements"]>;
    targetPerformance?: Partial<FitnessProfile["performance"]>;
    deadline?: string;
  };

  // 📅 היסטוריה
  weightHistory?: Array<{
    date: string;
    weight: number;
    bodyFat?: number;
  }>;

  measurementHistory?: Array<{
    date: string;
    measurements: Partial<FitnessProfile["measurements"]>;
  }>;
}

// 🔧 Type Guards
export const isGuestUser = (user: User): boolean => {
  return user.isGuest === true;
};

export const isPremiumUser = (user: User): boolean => {
  return user.isPremium === true;
};

export const isCoach = (user: User): boolean => {
  return user.isCoach === true;
};

export const hasCompletedProfile = (user: User): boolean => {
  return !!(
    user.name &&
    user.age &&
    user.experience &&
    user.goals &&
    user.goals.length > 0
  );
};

// 🔧 Helper Functions
export const calculateBMI = (user: User): number | null => {
  if (!user.height || !user.weight) return null;
  const heightInMeters = user.height / 100;
  return Number((user.weight / (heightInMeters * heightInMeters)).toFixed(1));
};

export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return "תת משקל";
  if (bmi < 25) return "משקל תקין";
  if (bmi < 30) return "עודף משקל";
  return "השמנה";
};

export const getExperienceLabel = (level: ExperienceLevel): string => {
  const labels = {
    beginner: "מתחיל",
    intermediate: "מתקדם",
    advanced: "מתקדם+",
    expert: "מומחה",
  };
  return labels[level];
};

export const getGoalLabel = (goal: FitnessGoal): string => {
  const labels = {
    strength: "כוח",
    muscle_gain: "בניית שריר",
    weight_loss: "ירידה במשקל",
    endurance: "סיבולת",
    general_fitness: "כושר כללי",
    athletic_performance: "ביצועים אתלטיים",
    rehabilitation: "שיקום",
  };
  return labels[goal];
};

// 🎯 ברירות מחדל
export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  theme: "dark",
  weightUnit: "kg",
  distanceUnit: "km",
  heightUnit: "cm",
  restTimerDuration: 90,
  autoStartTimer: true,
  soundEffects: true,
  hapticFeedback: true,
  keepScreenOn: true,
  profileVisibility: "public",
  shareProgress: true,
  language: "he",
  use24HourTime: true,
  firstDayOfWeek: "sunday",
};

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  workoutReminders: true,
  reminderTime: "18:00",
  reminderDays: ["sunday", "tuesday", "thursday"],
  progressUpdates: true,
  weeklyReport: true,
  achievementAlerts: true,
  pushNotifications: true,
  emailNotifications: false,
};

// 🏷️ טיפוסים נוספים
export type UserRole = "user" | "coach" | "admin" | "guest";
export type SubscriptionTier = "free" | "basic" | "premium" | "coach";
export type AccountStatus = "active" | "suspended" | "deleted" | "pending";
