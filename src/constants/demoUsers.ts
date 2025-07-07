// src/constants/demoUsers.ts - גרסה משודרגת לשלב 1

import { Plan } from "../types/plan"; // 🔄 עדכון imports
import { User } from "../types/user";
import { Workout } from "../types/workout";

// 🎯 משתמשי דמו מגוונים ומקצועיים
export const demoUsers: User[] = [
  {
    id: "demo-user-avi",
    email: "avi@gymovo.app",
    name: "אבי כהן",
    age: 28,
    experience: "intermediate", // 🆕 רמת ניסיון
    goals: ["muscle_gain", "strength"], // 🆕 מטרות
    joinedAt: "2024-10-01T00:00:00Z", // 🆕 תאריך הצטרפות
  },
  {
    id: "demo-user-maya",
    email: "maya@gymovo.app",
    name: "מאיה לוי",
    age: 32,
    experience: "advanced",
    goals: ["weight_loss", "endurance"],
    joinedAt: "2024-09-15T00:00:00Z",
  },
  {
    id: "demo-user-yoni",
    email: "yoni@gymovo.app",
    name: "יוני רוזן",
    age: 24,
    experience: "beginner",
    goals: ["general_fitness"],
    joinedAt: "2024-11-01T00:00:00Z",
  },
  {
    id: "demo-user-noa",
    email: "noa@gymovo.app",
    name: "נועה בן דוד",
    age: 29,
    experience: "intermediate",
    goals: ["muscle_tone", "flexibility"],
    joinedAt: "2024-08-20T00:00:00Z",
  },
];

// 🏋️ תוכניות דמו מקצועיות - במבנה החדש (workouts)
export const demoPlan_Beginner: Plan = {
  id: "demo-plan-beginner",
  name: "תוכנית מתחילים - 3 ימים",
  description: "תוכנית מושלמת למתחילים עם התמקדות ביסודות",
  creator: "Gymovo",
  workouts: [
    {
      id: "demo-workout-1",
      name: "אימון כוח עליון - יום א׳",
      exercises: [
        {
          id: "pushups",
          name: "שכיבות סמיכה",
          sets: [
            { reps: 8, weight: 0, rest: 60 },
            { reps: 6, weight: 0, rest: 60 },
            { reps: 5, weight: 0, rest: 90 },
          ],
          category: "chest",
          instructions: "שמור על גב ישר וירד עד 90 מעלות בזרועות",
        },
        {
          id: "squats",
          name: "סקוואטים",
          sets: [
            { reps: 12, weight: 0, rest: 60 },
            { reps: 10, weight: 0, rest: 60 },
            { reps: 8, weight: 0, rest: 90 },
          ],
          category: "legs",
          instructions: "רד עד שהירכיים מקבילות לרצפה",
        },
        {
          id: "plank",
          name: "פלאנק",
          sets: [
            { duration: 30, rest: 60, reps: 1 },
            { duration: 25, rest: 60, reps: 1 },
            { duration: 20, rest: 60, reps: 1 },
          ],
          category: "core",
          instructions: "שמור על קו ישר מהראש לעקבים",
        },
      ],
      estimatedDuration: 35,
      difficulty: "beginner",
      targetMuscles: ["chest", "shoulders", "core", "legs"],
    },
    {
      id: "demo-workout-2",
      name: "קרדיו וגמישות - יום ב׳",
      exercises: [
        {
          id: "jumping_jacks",
          name: "קפיצות פתח-סגור",
          sets: [
            { reps: 20, rest: 30, weight: 0 },
            { reps: 15, rest: 30, weight: 0 },
            { reps: 10, rest: 60, weight: 0 },
          ],
          category: "cardio",
          instructions: "קפוץ ופתח רגליים וזרועות בו זמנית",
        },
        {
          id: "lunges",
          name: "פרפרים",
          sets: [
            { reps: 10, weight: 0, rest: 45 }, // לכל רגל
            { reps: 8, weight: 0, rest: 45 },
            { reps: 6, weight: 0, rest: 60 },
          ],
          category: "legs",
          instructions: "צעד קדימה ורד עד 90 מעלות בברך",
        },
      ],
      estimatedDuration: 25,
      difficulty: "beginner",
      targetMuscles: ["legs", "glutes", "cardio"],
    },
    {
      id: "demo-workout-3",
      name: "כוח תחתון וליבה - יום ג׳",
      exercises: [
        {
          id: "wall_sits",
          name: "ישיבה על קיר",
          sets: [
            { duration: 20, rest: 60, reps: 1, weight: 0 },
            { duration: 15, rest: 60, reps: 1, weight: 0 },
            { duration: 10, rest: 60, reps: 1, weight: 0 },
          ],
          category: "legs",
          instructions: "שב עם הגב על הקיר, ירכיים ברמת הברכיים",
        },
        {
          id: "mountain_climbers",
          name: "מטפסי הרים",
          sets: [
            { reps: 20, rest: 45, weight: 0 },
            { reps: 15, rest: 45, weight: 0 },
            { reps: 10, rest: 60, weight: 0 },
          ],
          category: "core",
          instructions: "החלף רגליים במהירות ממצב פלאנק",
        },
      ],
      estimatedDuration: 30,
      difficulty: "beginner",
      targetMuscles: ["legs", "core", "cardio"],
    },
  ],
  createdAt: "2024-11-01T00:00:00Z",
  isActive: true,
  tags: ["beginner", "bodyweight", "full-body"],
  weeklyGoal: 3, // 3 אימונים בשבוע
  userId: "demo-user-yoni",
};

// 🏃‍♀️ תוכנית מתקדמת לדוגמה
export const demoPlan_Advanced: Plan = {
  id: "demo-plan-advanced",
  name: "תוכנית מתקדמים - 5 ימים",
  description: "תוכנית אינטנסיבית למתקדמים עם מיקוד בעוצמה",
  creator: "Gymovo",
  workouts: [
    {
      id: "demo-workout-advanced-1",
      name: "חזה וטריצפס - יום א׳",
      exercises: [
        {
          id: "bench_press",
          name: "פרפסי ספסל",
          sets: [
            { reps: 8, weight: 80, rest: 120 },
            { reps: 6, weight: 85, rest: 120 },
            { reps: 4, weight: 90, rest: 180 },
          ],
          category: "chest",
          instructions: "שלוט מלא בתנועה, עצור חטף על החזה",
        },
        {
          id: "incline_dumbbell_press",
          name: "דחיפת משקולות בזווית",
          sets: [
            { reps: 10, weight: 32, rest: 90 },
            { reps: 8, weight: 36, rest: 90 },
            { reps: 6, weight: 40, rest: 120 },
          ],
          category: "chest",
          instructions: "זווית 30-45 מעלות, דחוף לקשת טבעית",
        },
      ],
      estimatedDuration: 75,
      difficulty: "advanced",
      targetMuscles: ["chest", "triceps", "shoulders"],
    },
  ],
  createdAt: "2024-09-15T00:00:00Z",
  isActive: true,
  tags: ["advanced", "gym", "strength"],
  weeklyGoal: 5,
  userId: "demo-user-maya",
};

// 📊 היסטוריית אימונים לדוגמה
export const demoWorkoutHistory: Workout[] = [
  {
    id: "demo-completed-1",
    name: "אימון כוח עליון - יום א׳",
    exercises: [
      {
        id: "pushups",
        name: "שכיבות סמיכה",
        sets: [
          { reps: 8, weight: 0, rest: 60, completed: true },
          { reps: 6, weight: 0, rest: 60, completed: true },
          { reps: 5, weight: 0, rest: 90, completed: true },
        ],
        category: "chest",
        instructions: "שמור על גב ישר",
      },
    ],
    completedAt: "2024-11-15T18:30:00Z",
    duration: 32, // דקות בפועל
    estimatedDuration: 35,
    difficulty: "beginner",
    targetMuscles: ["chest", "shoulders", "core"],
    notes: "אימון מעולה! השתפרתי בביצוע השכיבות",
    rating: 4, // דירוג 1-5
  },
  {
    id: "demo-completed-2",
    name: "קרדיו וגמישות - יום ב׳",
    exercises: [
      {
        id: "jumping_jacks",
        name: "קפיצות פתח-סגור",
        sets: [
          { reps: 20, rest: 30, completed: true },
          { reps: 15, rest: 30, completed: true },
          { reps: 10, rest: 60, completed: true },
        ],
        category: "cardio",
        instructions: "קפוץ ופתח רגליים וזרועות",
      },
    ],
    completedAt: "2024-11-13T19:15:00Z",
    duration: 28,
    estimatedDuration: 25,
    difficulty: "beginner",
    targetMuscles: ["legs", "cardio"],
    notes: "קשה אבל הרגשתי חזק!",
    rating: 5,
  },
];

// 🎯 פונקציות עזר לטעינת נתוני דמו
// 🎯 פונקציות עזר לטעינת נתוני דמו
export const getDemoUserById = (userId: string): User | undefined => {
  return demoUsers.find((user) => user.id === userId);
};

export const getDemoPlanForUser = (userId: string): Plan | undefined => {
  const userProfile = getDemoUserById(userId);
  if (!userProfile) return undefined;

  // החזר תוכנית בהתאם לרמת הניסיון
  switch (userProfile.experience) {
    case "beginner":
      return demoPlan_Beginner;
    case "advanced":
      return demoPlan_Advanced;
    default:
      return demoPlan_Beginner;
  }
};

export const getDemoWorkoutHistory = (userId: string): Workout[] => {
  // החזר היסטוריה בהתאם למשתמש
  return demoWorkoutHistory.map((workout) => ({
    ...workout,
    id: `${workout.id}_${userId}`,
  }));
};

// 🔧 פונקציית עזר לאיפוס נתוני דמו
export const resetDemoData = async (userId: string): Promise<boolean> => {
  try {
    // האם זה משתמש דמו?
    const isDemoUser = demoUsers.some((user) => user.id === userId);
    if (!isDemoUser) return false;

    // כאן תוכל להוסיף לוגיקה לאיפוס נתונים ספציפיים לדמו
    console.log(`🔄 Resetting demo data for user: ${userId}`);
    return true;
  } catch (error) {
    console.error("Failed to reset demo data:", error);
    return false;
  }
};

// 📱 נתוני מטא לפיתוח
export const demoMeta = {
  version: "1.0.0",
  lastUpdated: "2024-11-20",
  totalUsers: demoUsers.length,
  totalPlans: 2,
  totalWorkouts: demoWorkoutHistory.length,
};
