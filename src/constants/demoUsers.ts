// src/constants/demoUsers.ts - ✅ קובץ מעודכן עם משתמשי הדמו הנכונים ותוכניות מלאות

import { User } from "../types/user";
import { Workout } from "../types/workout";
import { Plan, PlanDay, PlanExercise } from "../types/plan";

// ✅ משתמשי הדמו שלך - אבי כהן, מאיה לוי, יוני רוזן
export const demoUsers: User[] = [
  {
    id: "demo-user-avi",
    email: "avi@gymovo.app",
    name: "אבי כהן",
    age: 28,
    isGuest: false,
    experience: "intermediate",
    goals: ["muscle_gain", "strength"],
    createdAt: "2024-10-01T00:00:00Z",
    joinedAt: "2024-10-01T00:00:00Z",
    stats: {
      workoutsCount: 45,
      totalWeightLifted: 85000,
      streakDays: 12,
    },
  },
  {
    id: "demo-user-maya",
    email: "maya@gymovo.app",
    name: "מאיה לוי",
    age: 32,
    isGuest: false,
    experience: "advanced",
    goals: ["weight_loss", "endurance", "muscle_definition"],
    createdAt: "2024-09-15T00:00:00Z",
    joinedAt: "2024-09-15T00:00:00Z",
    stats: {
      workoutsCount: 78,
      totalWeightLifted: 95000,
      streakDays: 23,
    },
  },
  {
    id: "demo-user-yoni",
    email: "yoni@gymovo.app",
    name: "יוני רוזן",
    age: 24,
    isGuest: false,
    experience: "beginner",
    goals: ["general_fitness", "muscle_gain"],
    createdAt: "2024-11-01T00:00:00Z",
    joinedAt: "2024-11-01T00:00:00Z",
    stats: {
      workoutsCount: 15,
      totalWeightLifted: 18000,
      streakDays: 3,
    },
  },
];

// ✅ תוכניות אימון מותאמות לכל משתמש
export const getDemoPlanForUser = (userId: string): Plan | null => {
  const plans: { [key: string]: Plan } = {
    "demo-user-avi": {
      id: "plan-avi-push-pull-legs",
      name: "Push/Pull/Legs - אבי",
      description:
        "תוכנית מתקדמת לבניית כוח ומסה עם חלוקה לימי דחיפה, משיכה ורגליים",
      difficulty: "intermediate",
      creator: "Gymovo AI",
      targetMuscleGroups: ["חזה", "גב", "רגליים", "כתפיים", "זרועות"],
      durationWeeks: 12,
      weeklyGoal: 5,
      tags: ["power", "muscle_gain", "intermediate"],
      rating: 5,
      createdAt: "2024-10-01T10:00:00Z",
      updatedAt: "2024-12-01T10:00:00Z",
      userId: "demo-user-avi",
      isActive: true,
      days: [
        {
          id: "avi-day-push",
          name: "יום דחיפה - חזה, כתפיים, יד אחורית",
          estimatedDuration: 75,
          targetMuscleGroups: ["חזה", "כתפיים", "יד אחורית"],
          difficulty: "intermediate",
          exercises: [
            {
              id: "avi-bench-press",
              name: "לחיצת חזה במוט",
              muscleGroup: "חזה",
              sets: 4,
              reps: 8,
              weight: 80,
              restTime: 120,
              notes: "התמקד בטכניקה נכונה",
            },
            {
              id: "avi-incline-db",
              name: "לחיצת חזה שיפוע עם משקולות",
              muscleGroup: "חזה",
              sets: 3,
              reps: 10,
              weight: 30,
              restTime: 90,
            },
            {
              id: "avi-shoulder-press",
              name: "לחיצת כתפיים עם משקולות",
              muscleGroup: "כתפיים",
              sets: 3,
              reps: 12,
              weight: 22,
              restTime: 90,
            },
            {
              id: "avi-lateral-raise",
              name: "הרמות לצדדים",
              muscleGroup: "כתפיים",
              sets: 3,
              reps: 15,
              weight: 12,
              restTime: 60,
            },
            {
              id: "avi-tricep-pushdown",
              name: "פשיטת מרפקים בפולי",
              muscleGroup: "יד אחורית",
              sets: 3,
              reps: 12,
              weight: 35,
              restTime: 60,
            },
            {
              id: "avi-overhead-tricep",
              name: "פשיטה מעל הראש",
              muscleGroup: "יד אחורית",
              sets: 3,
              reps: 10,
              weight: 20,
              restTime: 60,
            },
          ],
        },
        {
          id: "avi-day-pull",
          name: "יום משיכה - גב, יד קדמית",
          estimatedDuration: 70,
          targetMuscleGroups: ["גב", "יד קדמית"],
          difficulty: "intermediate",
          exercises: [
            {
              id: "avi-pullups",
              name: "מתח",
              muscleGroup: "גב",
              sets: 4,
              reps: 8,
              weight: 10,
              restTime: 120,
              notes: "עם משקל נוסף או עזרה",
            },
            {
              id: "avi-barbell-row",
              name: "חתירה עם מוט",
              muscleGroup: "גב",
              sets: 4,
              reps: 10,
              weight: 60,
              restTime: 90,
            },
            {
              id: "avi-lat-pulldown",
              name: "משיכת פולי עליון",
              muscleGroup: "גב",
              sets: 3,
              reps: 12,
              weight: 55,
              restTime: 90,
            },
            {
              id: "avi-cable-row",
              name: "חתירה בפולי נמוך",
              muscleGroup: "גב",
              sets: 3,
              reps: 12,
              weight: 50,
              restTime: 90,
            },
            {
              id: "avi-bicep-curl",
              name: "כפיפת מרפקים עם משקולות",
              muscleGroup: "יד קדמית",
              sets: 3,
              reps: 12,
              weight: 18,
              restTime: 60,
            },
            {
              id: "avi-hammer-curl",
              name: "כפיפת פטיש",
              muscleGroup: "יד קדמית",
              sets: 3,
              reps: 10,
              weight: 20,
              restTime: 60,
            },
          ],
        },
        {
          id: "avi-day-legs",
          name: "יום רגליים - רגליים מלא",
          estimatedDuration: 80,
          targetMuscleGroups: ["רגליים", "שוקיים"],
          difficulty: "intermediate",
          exercises: [
            {
              id: "avi-squat",
              name: "סקוואט עם מוט",
              muscleGroup: "רגליים",
              sets: 4,
              reps: 8,
              weight: 100,
              restTime: 150,
              notes: "עומק מלא",
            },
            {
              id: "avi-romanian-deadlift",
              name: "דדליפט רומני",
              muscleGroup: "רגליים",
              sets: 4,
              reps: 10,
              weight: 80,
              restTime: 120,
            },
            {
              id: "avi-leg-press",
              name: "לחיצת רגליים במכונה",
              muscleGroup: "רגליים",
              sets: 3,
              reps: 15,
              weight: 120,
              restTime: 90,
            },
            {
              id: "avi-leg-curl",
              name: "כפיפת רגליים שכיבה",
              muscleGroup: "רגליים",
              sets: 3,
              reps: 12,
              weight: 40,
              restTime: 90,
            },
            {
              id: "avi-calf-raises",
              name: "הרמות עקבים",
              muscleGroup: "שוקיים",
              sets: 4,
              reps: 20,
              weight: 60,
              restTime: 60,
            },
          ],
        },
      ],
    },

    "demo-user-maya": {
      id: "plan-maya-hiit-strength",
      name: "HIIT + Strength - מאיה",
      description:
        "תוכנית מתקדמת המשלבת אימוני HIIT עם אימוני כוח לחיטוב וביצועים",
      difficulty: "advanced",
      creator: "Gymovo AI",
      targetMuscleGroups: ["כל הגוף", "ליבה", "חזה", "רגליים"],
      durationWeeks: 8,
      weeklyGoal: 6,
      tags: ["hiit", "weight_loss", "advanced", "endurance"],
      rating: 5,
      createdAt: "2024-09-15T10:00:00Z",
      updatedAt: "2024-12-01T10:00:00Z",
      userId: "demo-user-maya",
      isActive: true,
      days: [
        {
          id: "maya-day-hiit-upper",
          name: "HIIT חלק עליון",
          estimatedDuration: 45,
          targetMuscleGroups: ["חזה", "גב", "כתפיים", "ליבה"],
          difficulty: "advanced",
          exercises: [
            {
              id: "maya-burpees",
              name: "ברפיז",
              muscleGroup: "כל הגוף",
              sets: 4,
              reps: 15,
              weight: 0,
              restTime: 30,
              notes: "30 שניות מאמץ, 30 שניות מנוחה",
            },
            {
              id: "maya-pushup-variations",
              name: "שכיבות סמיכה - וריאציות",
              muscleGroup: "חזה",
              sets: 3,
              reps: 12,
              weight: 0,
              restTime: 45,
            },
            {
              id: "maya-db-thrusters",
              name: "משקולות דחיפה מעל הראש",
              muscleGroup: "כתפיים",
              sets: 3,
              reps: 15,
              weight: 12,
              restTime: 60,
            },
            {
              id: "maya-mountain-climbers",
              name: "מטפסי הרים",
              muscleGroup: "ליבה",
              sets: 3,
              reps: 20,
              weight: 0,
              restTime: 30,
            },
            {
              id: "maya-plank-variations",
              name: "פלאנק - וריאציות",
              muscleGroup: "ליבה",
              sets: 3,
              reps: 45,
              weight: 0,
              restTime: 45,
              notes: "שניות החזקה",
            },
          ],
        },
        {
          id: "maya-day-strength-lower",
          name: "כוח רגליים",
          estimatedDuration: 50,
          targetMuscleGroups: ["רגליים", "שוקיים"],
          difficulty: "advanced",
          exercises: [
            {
              id: "maya-squat-jumps",
              name: "סקוואט קפיצות",
              muscleGroup: "רגליים",
              sets: 4,
              reps: 12,
              weight: 0,
              restTime: 60,
            },
            {
              id: "maya-bulgarian-split",
              name: "סקוואט בולגרי",
              muscleGroup: "רגליים",
              sets: 3,
              reps: 12,
              weight: 15,
              restTime: 90,
              notes: "כל רגל בנפרד",
            },
            {
              id: "maya-deadlift-sumo",
              name: "דדליפט סומו",
              muscleGroup: "רגליים",
              sets: 4,
              reps: 10,
              weight: 60,
              restTime: 120,
            },
            {
              id: "maya-walking-lunges",
              name: "זינוקים הליכה",
              muscleGroup: "רגליים",
              sets: 3,
              reps: 16,
              weight: 20,
              restTime: 90,
            },
            {
              id: "maya-single-calf",
              name: "הרמות עקבים יחיד",
              muscleGroup: "שוקיים",
              sets: 3,
              reps: 15,
              weight: 25,
              restTime: 60,
              notes: "כל רגל בנפרד",
            },
          ],
        },
        {
          id: "maya-day-circuit",
          name: "מעגל כל הגוף",
          estimatedDuration: 40,
          targetMuscleGroups: ["כל הגוף"],
          difficulty: "advanced",
          exercises: [
            {
              id: "maya-kettlebell-swing",
              name: "נדנוד קטלבל",
              muscleGroup: "כל הגוף",
              sets: 4,
              reps: 20,
              weight: 16,
              restTime: 45,
            },
            {
              id: "maya-bear-crawl",
              name: "זחילת דוב",
              muscleGroup: "כל הגוף",
              sets: 3,
              reps: 30,
              weight: 0,
              restTime: 60,
              notes: "שניות תנועה",
            },
            {
              id: "maya-db-man-makers",
              name: "משקולות איש יוצר",
              muscleGroup: "כל הגוף",
              sets: 3,
              reps: 8,
              weight: 12,
              restTime: 90,
            },
            {
              id: "maya-high-knees",
              name: "הרמת ברכיים גבוה",
              muscleGroup: "כל הגוף",
              sets: 3,
              reps: 30,
              weight: 0,
              restTime: 30,
              notes: "שניות מהירות",
            },
          ],
        },
      ],
    },

    "demo-user-yoni": {
      id: "plan-yoni-beginner-full",
      name: "מתחילים מלא - יוני",
      description:
        "תוכנית בסיסית ועדינה למתחילים עם דגש על טכניקה נכונה וביטחון",
      difficulty: "beginner",
      creator: "Gymovo AI",
      targetMuscleGroups: ["כל הגוף", "ליבה"],
      durationWeeks: 6,
      weeklyGoal: 3,
      tags: ["beginner", "safety", "technique", "basic"],
      rating: 4,
      createdAt: "2024-11-01T10:00:00Z",
      updatedAt: "2024-12-01T10:00:00Z",
      userId: "demo-user-yoni",
      isActive: true,
      days: [
        {
          id: "yoni-day-basic-upper",
          name: "בסיסי חלק עליון",
          estimatedDuration: 30,
          targetMuscleGroups: ["חזה", "גב", "זרועות"],
          difficulty: "beginner",
          exercises: [
            {
              id: "yoni-wall-pushup",
              name: "שכיבות סמיכה על קיר",
              muscleGroup: "חזה",
              sets: 2,
              reps: 8,
              weight: 0,
              restTime: 90,
              notes: "התחל בקלות, התמקד בטכניקה",
            },
            {
              id: "yoni-assisted-pullup",
              name: "מתח בעזרה",
              muscleGroup: "גב",
              sets: 2,
              reps: 5,
              weight: 0,
              restTime: 120,
              notes: "השתמש בגומיה או בעזרת חבר",
            },
            {
              id: "yoni-light-db-press",
              name: "לחיצת משקולות קלות",
              muscleGroup: "חזה",
              sets: 2,
              reps: 10,
              weight: 5,
              restTime: 90,
            },
            {
              id: "yoni-arm-circles",
              name: "סיבובי זרועות",
              muscleGroup: "כתפיים",
              sets: 2,
              reps: 15,
              weight: 0,
              restTime: 30,
              notes: "חימום וחיזוק בסיסי",
            },
            {
              id: "yoni-light-bicep",
              name: "כפיפות זרוע קלות",
              muscleGroup: "יד קדמית",
              sets: 2,
              reps: 12,
              weight: 3,
              restTime: 60,
            },
          ],
        },
        {
          id: "yoni-day-basic-lower",
          name: "בסיסי רגליים",
          estimatedDuration: 25,
          targetMuscleGroups: ["רגליים", "ליבה"],
          difficulty: "beginner",
          exercises: [
            {
              id: "yoni-bodyweight-squat",
              name: "סקוואט משקל גוף",
              muscleGroup: "רגליים",
              sets: 2,
              reps: 10,
              weight: 0,
              restTime: 90,
              notes: "התמקד בעומק נכון",
            },
            {
              id: "yoni-wall-sit",
              name: "ישיבה על קיר",
              muscleGroup: "רגליים",
              sets: 2,
              reps: 20,
              weight: 0,
              restTime: 90,
              notes: "שניות החזקה",
            },
            {
              id: "yoni-basic-lunges",
              name: "זינוקים בסיסיים",
              muscleGroup: "רגליים",
              sets: 2,
              reps: 8,
              weight: 0,
              restTime: 90,
              notes: "כל רגל בנפרד",
            },
            {
              id: "yoni-calf-raise-basic",
              name: "הרמות עקבים בסיסי",
              muscleGroup: "שוקיים",
              sets: 2,
              reps: 15,
              weight: 0,
              restTime: 60,
            },
            {
              id: "yoni-basic-plank",
              name: "פלאנק בסיסי",
              muscleGroup: "ליבה",
              sets: 2,
              reps: 15,
              weight: 0,
              restTime: 90,
              notes: "שניות החזקה",
            },
          ],
        },
        {
          id: "yoni-day-flexibility",
          name: "גמישות ושיקום",
          estimatedDuration: 20,
          targetMuscleGroups: ["כל הגוף"],
          difficulty: "beginner",
          exercises: [
            {
              id: "yoni-cat-cow",
              name: "חתול פרה",
              muscleGroup: "גב",
              sets: 2,
              reps: 10,
              weight: 0,
              restTime: 30,
              notes: "תנועה איטית וחלקה",
            },
            {
              id: "yoni-child-pose",
              name: "תנוחת הילד",
              muscleGroup: "גב",
              sets: 2,
              reps: 30,
              weight: 0,
              restTime: 0,
              notes: "שניות מתיחה",
            },
            {
              id: "yoni-leg-swings",
              name: "נדנודי רגל",
              muscleGroup: "רגליים",
              sets: 2,
              reps: 10,
              weight: 0,
              restTime: 30,
              notes: "כל רגל בנפרד",
            },
            {
              id: "yoni-arm-stretch",
              name: "מתיחת זרועות",
              muscleGroup: "זרועות",
              sets: 2,
              reps: 15,
              weight: 0,
              restTime: 30,
              notes: "שניות החזקה לכל צד",
            },
            {
              id: "yoni-deep-breathing",
              name: "נשימות עמוקות",
              muscleGroup: "ליבה",
              sets: 1,
              reps: 10,
              weight: 0,
              restTime: 0,
              notes: "התמקד בנשימה",
            },
          ],
        },
      ],
    },
  };

  return plans[userId] || null;
};

// ✅ היסטוריית אימונים מותאמת לכל משתמש
export const getDemoWorkoutHistory = (userId: string): Workout[] => {
  const workoutHistories: { [key: string]: Workout[] } = {
    "demo-user-avi": [
      {
        id: "workout-avi-1",
        name: "Push Day - חזה וכתפיים",
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 75,
        exercises: [],
        rating: 5,
        results: {
          totalWeight: 3800,
          completedSets: 18,
          totalSets: 18,
        },
        notes: "אימון מצוין! הרגשתי חזק היום",
      },
      {
        id: "workout-avi-2",
        name: "Pull Day - גב ויד קדמית",
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 70,
        exercises: [],
        rating: 4,
        results: {
          totalWeight: 4200,
          completedSets: 16,
          totalSets: 18,
        },
        notes: "קשה במתח, אבל המשכתי",
      },
      {
        id: "workout-avi-3",
        name: "Leg Day - רגליים מלא",
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 80,
        exercises: [],
        rating: 5,
        results: {
          totalWeight: 4800,
          completedSets: 20,
          totalSets: 20,
        },
        notes: "יום רגליים קשה אבל מספק!",
      },
      {
        id: "workout-avi-4",
        name: "Push Day - חזרה",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 65,
        exercises: [],
        rating: 4,
        results: {
          totalWeight: 3600,
          completedSets: 16,
          totalSets: 18,
        },
      },
    ],

    "demo-user-maya": [
      {
        id: "workout-maya-1",
        name: "HIIT חלק עליון",
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 45,
        exercises: [],
        rating: 5,
        results: {
          totalWeight: 1600,
          completedSets: 16,
          totalSets: 16,
        },
        notes: "אימון אינטנסיבי ומצוין! הרגשתי בכושר",
      },
      {
        id: "workout-maya-2",
        name: "כוח רגליים",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 50,
        exercises: [],
        rating: 4,
        results: {
          totalWeight: 2200,
          completedSets: 17,
          totalSets: 17,
        },
        notes: "הרגליים עבדו קשה היום",
      },
      {
        id: "workout-maya-3",
        name: "מעגל כל הגוף",
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 40,
        exercises: [],
        rating: 5,
        results: {
          totalWeight: 1400,
          completedSets: 13,
          totalSets: 13,
        },
        notes: "מעגל מהיר ויעיל!",
      },
      {
        id: "workout-maya-4",
        name: "HIIT חלק עליון",
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 45,
        exercises: [],
        rating: 4,
        results: {
          totalWeight: 1500,
          completedSets: 15,
          totalSets: 16,
        },
      },
    ],

    "demo-user-yoni": [
      {
        id: "workout-yoni-1",
        name: "בסיסי חלק עליון",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 30,
        exercises: [],
        rating: 4,
        results: {
          totalWeight: 800,
          completedSets: 8,
          totalSets: 10,
        },
        notes: "התחלה טובה! קצת קשה אבל מרגיש טוב",
      },
      {
        id: "workout-yoni-2",
        name: "בסיסי רגליים",
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 25,
        exercises: [],
        rating: 3,
        results: {
          totalWeight: 400,
          completedSets: 7,
          totalSets: 10,
        },
        notes: "קשה עדיין, אבל משתפר",
      },
      {
        id: "workout-yoni-3",
        name: "גמישות ושיקום",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 20,
        exercises: [],
        rating: 5,
        results: {
          totalWeight: 0,
          completedSets: 9,
          totalSets: 9,
        },
        notes: "אימון מתיחות נעים ומרגיע",
      },
    ],
  };

  return workoutHistories[userId] || [];
};

// ✅ Helper functions for demo user management
export const getDemoUserById = (id: string): User | undefined => {
  return demoUsers.find((user) => user.id === id);
};

export const getDemoUserByEmail = (email: string): User | undefined => {
  return demoUsers.find((user) => user.email === email);
};

export const isDemoUser = (userId: string): boolean => {
  return userId.startsWith("demo-user-");
};

// ✅ Statistics helpers with safe date handling
export const getDemoUserStats = (userId: string) => {
  const user = demoUsers.find((u) => u.id === userId);
  if (!user) return null;

  const workouts = getDemoWorkoutHistory(userId);
  const totalDuration = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
  const totalVolume = workouts.reduce(
    (sum, w) => sum + (w.results?.totalWeight || 0),
    0
  );
  const averageRating =
    workouts.length > 0
      ? workouts.reduce((sum, w) => sum + (w.rating || 0), 0) / workouts.length
      : 0;

  return {
    totalWorkouts: workouts.length,
    totalDuration,
    totalVolume,
    averageRating,
    streak: user.stats?.streakDays || 0,
    thisWeekWorkouts: workouts.filter((w) => {
      if (!w.date) return false;

      try {
        const workoutDate = new Date(w.date);
        if (isNaN(workoutDate.getTime())) return false;

        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return workoutDate > weekAgo;
      } catch (error) {
        console.warn("Invalid date in workout:", w.date);
        return false;
      }
    }).length,
  };
};
