// src/constants/demoUsers.ts - ✅ Fixed with all required functions and exports

import { User } from "../types/user";
import { Workout } from "../types/workout";
import { Plan } from "../types/plan";

// ✅ Demo users array
export const demoUsers: User[] = [
  {
    id: "demo-user-1",
    email: "john@demo.com",
    name: "ג'ון הכוחני",
    age: 28,
    isGuest: false,
    experience: "intermediate",
    goals: ["בניית כוח", "הגדלת מסה"],
    createdAt: "2024-01-01T10:00:00.000Z",
    joinedAt: "2024-01-01T10:00:00.000Z",
    stats: {
      workoutsCount: 45,
      totalWeightLifted: 85000,
      streakDays: 12,
    },
  },
  {
    id: "demo-user-2",
    email: "sarah@demo.com",
    name: "שרה הבריאה",
    age: 25,
    isGuest: false,
    experience: "beginner",
    goals: ["ירידה במשקל", "שיפור כושר"],
    createdAt: "2024-01-15T10:00:00.000Z",
    joinedAt: "2024-01-15T10:00:00.000Z",
    stats: {
      workoutsCount: 22,
      totalWeightLifted: 28000,
      streakDays: 5,
    },
  },
  {
    id: "demo-user-3",
    email: "mike@demo.com",
    name: "מייק המתקדם",
    age: 32,
    isGuest: false,
    experience: "advanced",
    goals: ["שיפור ביצועים", "תחרויות"],
    createdAt: "2023-12-01T10:00:00.000Z",
    joinedAt: "2023-12-01T10:00:00.000Z",
    stats: {
      workoutsCount: 120,
      totalWeightLifted: 180000,
      streakDays: 25,
    },
  },
];

// ✅ Demo workout history generator
export const getDemoWorkoutHistory = (userId: string): Workout[] => {
  const baseWorkouts: Workout[] = [
    {
      id: `demo-workout-1-${userId}`,
      name: "אימון חזה וכתפיים",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // אתמול
      duration: 45,
      exercises: [
        {
          id: "ex1",
          name: "לחיצת חזה",
          exercise: { id: "bench_press", name: "לחיצת חזה", category: "חזה" },
          sets: [
            { id: "set1", reps: 10, weight: 80, status: "completed" },
            { id: "set2", reps: 10, weight: 80, status: "completed" },
            { id: "set3", reps: 8, weight: 85, status: "completed" },
          ],
        },
        {
          id: "ex2",
          name: "לחיצת כתפיים",
          exercise: {
            id: "shoulder_press",
            name: "לחיצת כתפיים",
            category: "כתפיים",
          },
          sets: [
            { id: "set1", reps: 12, weight: 25, status: "completed" },
            { id: "set2", reps: 10, weight: 25, status: "completed" },
            { id: "set3", reps: 10, weight: 25, status: "completed" },
          ],
        },
      ],
      rating: 4,
      completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      results: {
        totalWeight: 2500,
        completedSets: 6,
        totalSets: 6,
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      id: `demo-workout-2-${userId}`,
      name: "אימון גב ויד קדמית",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // לפני 3 ימים
      duration: 50,
      exercises: [
        {
          id: "ex1",
          name: "חתירה",
          exercise: { id: "row", name: "חתירה", category: "גב" },
          sets: [
            { id: "set1", reps: 12, weight: 60, status: "completed" },
            { id: "set2", reps: 10, weight: 65, status: "completed" },
            { id: "set3", reps: 10, weight: 65, status: "completed" },
          ],
        },
        {
          id: "ex2",
          name: "סיבוב ביצפס",
          exercise: {
            id: "bicep_curl",
            name: "סיבוב ביצפס",
            category: "יד קדמית",
          },
          sets: [
            { id: "set1", reps: 15, weight: 15, status: "completed" },
            { id: "set2", reps: 12, weight: 15, status: "completed" },
            { id: "set3", reps: 12, weight: 15, status: "completed" },
          ],
        },
      ],
      rating: 5,
      completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      results: {
        totalWeight: 2800,
        completedSets: 6,
        totalSets: 6,
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    },
    {
      id: `demo-workout-3-${userId}`,
      name: "אימון רגליים",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // לפני 5 ימים
      duration: 60,
      exercises: [
        {
          id: "ex1",
          name: "סקוואט",
          exercise: { id: "squat", name: "סקוואט", category: "רגליים" },
          sets: [
            { id: "set1", reps: 12, weight: 100, status: "completed" },
            { id: "set2", reps: 10, weight: 110, status: "completed" },
            { id: "set3", reps: 8, weight: 120, status: "completed" },
          ],
        },
        {
          id: "ex2",
          name: "דדליפט",
          exercise: { id: "deadlift", name: "דדליפט", category: "רגליים" },
          sets: [
            { id: "set1", reps: 8, weight: 140, status: "completed" },
            { id: "set2", reps: 6, weight: 150, status: "completed" },
            { id: "set3", reps: 6, weight: 150, status: "skipped" },
          ],
        },
      ],
      rating: 4,
      completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      results: {
        totalWeight: 3200,
        completedSets: 5,
        totalSets: 6,
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    },
  ];

  // Add more workouts for advanced users
  const user = demoUsers.find((u) => u.id === userId);
  if (user?.experience === "advanced") {
    return [...baseWorkouts, ...generateAdditionalWorkouts(userId, 10)];
  } else if (user?.experience === "intermediate") {
    return [...baseWorkouts, ...generateAdditionalWorkouts(userId, 5)];
  }

  return baseWorkouts;
};

// ✅ Helper function to create safe dates
const createSafeDate = (dateString?: string): Date => {
  if (!dateString) return new Date();

  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? new Date() : date;
  } catch {
    return new Date();
  }
};

// ✅ Helper function to generate additional workouts with safe dates
const generateAdditionalWorkouts = (
  userId: string,
  count: number
): Workout[] => {
  const workouts: Workout[] = [];

  for (let i = 0; i < count; i++) {
    const daysAgo = (i + 1) * 7; // Weekly workouts
    const workoutDate = new Date(
      Date.now() - 1000 * 60 * 60 * 24 * daysAgo
    ).toISOString();

    workouts.push({
      id: `demo-workout-extra-${i}-${userId}`,
      name: `אימון ${i + 4}`,
      date: workoutDate, // ✅ Always a valid ISO string
      duration: 45 + Math.random() * 30, // 45-75 minutes
      exercises: [],
      rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
      completedAt: workoutDate, // ✅ Always a valid ISO string
      results: {
        totalWeight: 2000 + Math.random() * 2000,
        completedSets: 8 + Math.floor(Math.random() * 8),
        totalSets: 10 + Math.floor(Math.random() * 6),
      },
      createdAt: workoutDate, // ✅ Always a valid ISO string
      updatedAt: workoutDate, // ✅ Always a valid ISO string
    });
  }

  return workouts;
};

// ✅ Demo plan generator
export const getDemoPlanForUser = (userId: string): Plan | null => {
  const user = demoUsers.find((u) => u.id === userId);
  if (!user) return null;

  const basePlan: Plan = {
    id: `demo-plan-${userId}`,
    name: `תוכנית ${user.name}`,
    description: `תוכנית מותאמת אישית עבור ${user.name}`,
    difficulty: user.experience || "intermediate",
    creator: "Gymovo Demo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: userId,
    isActive: true,
    rating: 4 + Math.random(),
    weeklyGoal:
      user.experience === "beginner"
        ? 3
        : user.experience === "advanced"
        ? 5
        : 4,
    tags: user.goals || ["כושר כללי"],
    targetMuscleGroups: ["חזה", "גב", "רגליים", "כתפיים"],
    durationWeeks: 8,
    days: generatePlanDays(user.experience || "intermediate"),
  };

  return basePlan;
};

// ✅ Helper function to generate plan days based on experience
const generatePlanDays = (experience: string) => {
  const beginnerDays = [
    {
      id: "day-1",
      name: "יום א' - גוף עליון",
      exercises: [
        {
          id: "ex1",
          name: "שכיבות סמיכה",
          muscleGroup: "חזה",
          sets: 3,
          reps: 10,
          weight: 0,
        },
        {
          id: "ex2",
          name: "חתירה",
          muscleGroup: "גב",
          sets: 3,
          reps: 12,
          weight: 20,
        },
        {
          id: "ex3",
          name: "לחיצת כתפיים",
          muscleGroup: "כתפיים",
          sets: 3,
          reps: 10,
          weight: 15,
        },
      ],
      estimatedDuration: 45,
      targetMuscleGroups: ["חזה", "גב", "כתפיים"],
    },
    {
      id: "day-2",
      name: "יום ב' - גוף תחתון",
      exercises: [
        {
          id: "ex1",
          name: "סקוואט",
          muscleGroup: "רגליים",
          sets: 3,
          reps: 12,
          weight: 40,
        },
        {
          id: "ex2",
          name: "לונג'ים",
          muscleGroup: "רגליים",
          sets: 3,
          reps: 10,
          weight: 0,
        },
        {
          id: "ex3",
          name: "הרמת עקבים",
          muscleGroup: "שוקיים",
          sets: 3,
          reps: 15,
          weight: 0,
        },
      ],
      estimatedDuration: 40,
      targetMuscleGroups: ["רגליים"],
    },
  ];

  const intermediateDays = [
    ...beginnerDays,
    {
      id: "day-3",
      name: "יום ג' - זרועות וליבה",
      exercises: [
        {
          id: "ex1",
          name: "סיבוב ביצפס",
          muscleGroup: "יד קדמית",
          sets: 3,
          reps: 12,
          weight: 15,
        },
        {
          id: "ex2",
          name: "פשיטת מרפקים",
          muscleGroup: "יד אחורית",
          sets: 3,
          reps: 12,
          weight: 20,
        },
        {
          id: "ex3",
          name: "פלאנק",
          muscleGroup: "ליבה",
          sets: 3,
          reps: 30,
          weight: 0,
        },
      ],
      estimatedDuration: 35,
      targetMuscleGroups: ["זרועות", "ליבה"],
    },
  ];

  const advancedDays = [
    ...intermediateDays,
    {
      id: "day-4",
      name: "יום ד' - כוח מתקדם",
      exercises: [
        {
          id: "ex1",
          name: "דדליפט",
          muscleGroup: "גב",
          sets: 4,
          reps: 6,
          weight: 120,
        },
        {
          id: "ex2",
          name: "לחיצת חזה",
          muscleGroup: "חזה",
          sets: 4,
          reps: 8,
          weight: 80,
        },
        {
          id: "ex3",
          name: "סקוואט כבד",
          muscleGroup: "רגליים",
          sets: 4,
          reps: 6,
          weight: 100,
        },
      ],
      estimatedDuration: 60,
      targetMuscleGroups: ["גב", "חזה", "רגליים"],
    },
  ];

  switch (experience) {
    case "beginner":
      return beginnerDays;
    case "intermediate":
      return intermediateDays;
    case "advanced":
      return advancedDays;
    default:
      return beginnerDays;
  }
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
      // ✅ Fixed: Safe date validation before creating Date object
      if (!w.date) return false;

      try {
        const workoutDate = new Date(w.date);
        // Check if date is valid
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
