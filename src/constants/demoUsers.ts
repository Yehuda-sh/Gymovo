// src/constants/demoUsers.ts - גרסה עם היסטוריית אימונים מלאה

import { Plan } from "../types/plan";
import { User } from "../types/user";
import { Workout } from "../types/workout";

// 🎯 משתמשי דמו מגוונים ומקצועיים
export const demoUsers: User[] = [
  {
    id: "demo-user-avi",
    email: "avi@gymovo.app",
    name: "אבי כהן",
    age: 28,
    experience: "intermediate",
    goals: ["muscle_gain", "strength"],
    joinedAt: "2024-10-01T00:00:00Z",
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

// 🏋️ פונקציה ליצירת אימון רנדומלי מציאותי
const createRandomWorkout = (
  date: Date,
  userId: string,
  index: number
): Workout => {
  const workoutTemplates = [
    {
      name: "אימון חזה וכתפיים",
      targetMuscles: ["חזה", "כתפיים", "יד אחורית"],
      exercises: [
        {
          name: "לחיצת חזה במוט",
          category: "חזה",
          sets: 4,
          baseReps: 8,
          baseWeight: 80,
        },
        {
          name: "לחיצת כתפיים עם משקולות",
          category: "כתפיים",
          sets: 3,
          baseReps: 10,
          baseWeight: 25,
        },
        {
          name: "פתיחות עם משקולות",
          category: "חזה",
          sets: 3,
          baseReps: 12,
          baseWeight: 15,
        },
        {
          name: "הרמות צד",
          category: "כתפיים",
          sets: 3,
          baseReps: 15,
          baseWeight: 10,
        },
        {
          name: "דיפס",
          category: "יד אחורית",
          sets: 3,
          baseReps: 12,
          baseWeight: 0,
        },
      ],
      baseDuration: 55,
      baseCalories: 380,
    },
    {
      name: "אימון גב ויד קדמית",
      targetMuscles: ["גב", "יד קדמית"],
      exercises: [
        { name: "משיכות", category: "גב", sets: 4, baseReps: 6, baseWeight: 0 },
        {
          name: "חתירה עם מוט",
          category: "גב",
          sets: 4,
          baseReps: 8,
          baseWeight: 70,
        },
        {
          name: "משיכת פולי עליון",
          category: "גב",
          sets: 3,
          baseReps: 10,
          baseWeight: 60,
        },
        {
          name: "כפיפת מרפקים",
          category: "יד קדמית",
          sets: 3,
          baseReps: 12,
          baseWeight: 20,
        },
        {
          name: "כפיפת מרפקים פטיש",
          category: "יד קדמית",
          sets: 3,
          baseReps: 15,
          baseWeight: 15,
        },
      ],
      baseDuration: 50,
      baseCalories: 340,
    },
    {
      name: "אימון רגליים",
      targetMuscles: ["רגליים", "שוקיים"],
      exercises: [
        {
          name: "סקוואט",
          category: "רגליים",
          sets: 4,
          baseReps: 10,
          baseWeight: 100,
        },
        {
          name: "דדליפט רומני",
          category: "רגליים",
          sets: 3,
          baseReps: 8,
          baseWeight: 90,
        },
        {
          name: "לחיצת רגליים",
          category: "רגליים",
          sets: 3,
          baseReps: 12,
          baseWeight: 150,
        },
        {
          name: "פשיטת ברכיים",
          category: "רגליים",
          sets: 3,
          baseReps: 15,
          baseWeight: 50,
        },
        {
          name: "הרמות עקב",
          category: "שוקיים",
          sets: 4,
          baseReps: 20,
          baseWeight: 0,
        },
      ],
      baseDuration: 65,
      baseCalories: 420,
    },
    {
      name: "אימון יד אחורית וליבה",
      targetMuscles: ["יד אחורית", "ליבה"],
      exercises: [
        {
          name: "דיפס במקביל",
          category: "יד אחורית",
          sets: 3,
          baseReps: 12,
          baseWeight: 0,
        },
        {
          name: "פשיטת מרפקים בפולי",
          category: "יד אחורית",
          sets: 3,
          baseReps: 15,
          baseWeight: 30,
        },
        {
          name: "פלאנק",
          category: "ליבה",
          sets: 3,
          baseReps: 45,
          baseWeight: 0,
        },
        {
          name: "כפיפות בטן",
          category: "ליבה",
          sets: 3,
          baseReps: 25,
          baseWeight: 0,
        },
        {
          name: "רוסיאן טוויסט",
          category: "ליבה",
          sets: 3,
          baseReps: 30,
          baseWeight: 0,
        },
      ],
      baseDuration: 40,
      baseCalories: 280,
    },
    {
      name: "אימון קרדיו HIIT",
      targetMuscles: ["קרדיו", "ליבה"],
      exercises: [
        {
          name: "ריצה במקום",
          category: "קרדיו",
          sets: 5,
          baseReps: 30,
          baseWeight: 0,
        },
        {
          name: "ברפיז",
          category: "קרדיו",
          sets: 4,
          baseReps: 10,
          baseWeight: 0,
        },
        {
          name: "קפיצות גקס",
          category: "קרדיו",
          sets: 4,
          baseReps: 20,
          baseWeight: 0,
        },
        {
          name: "מאונטיין קליימברס",
          category: "קרדיו",
          sets: 4,
          baseReps: 30,
          baseWeight: 0,
        },
        {
          name: "קפיצות סקוואט",
          category: "קרדיו",
          sets: 3,
          baseReps: 15,
          baseWeight: 0,
        },
      ],
      baseDuration: 35,
      baseCalories: 450,
    },
    {
      name: "אימון גוף מלא",
      targetMuscles: ["גב", "חזה", "רגליים", "ליבה"],
      exercises: [
        {
          name: "דדליפט",
          category: "גב",
          sets: 4,
          baseReps: 6,
          baseWeight: 120,
        },
        {
          name: "לחיצת חזה עם משקולות",
          category: "חזה",
          sets: 3,
          baseReps: 10,
          baseWeight: 30,
        },
        {
          name: "סקוואט גובלט",
          category: "רגליים",
          sets: 3,
          baseReps: 12,
          baseWeight: 25,
        },
        {
          name: "שכיבות סמיכה",
          category: "חזה",
          sets: 2,
          baseReps: 15,
          baseWeight: 0,
        },
        {
          name: "פלאנק",
          category: "ליבה",
          sets: 3,
          baseReps: 40,
          baseWeight: 0,
        },
      ],
      baseDuration: 45,
      baseCalories: 370,
    },
  ];

  // בחר template רנדומלי
  const template = workoutTemplates[index % workoutTemplates.length];

  // יצירת וריאציה בהתאם למשתמש
  const userExperience =
    demoUsers.find((u) => u.id === userId)?.experience || "beginner";
  const experienceMultiplier =
    userExperience === "beginner"
      ? 0.8
      : userExperience === "advanced"
      ? 1.3
      : 1.0;

  // יצירת התרגילים עם וריאציה מציאותית
  const exercises = template.exercises.map((ex, idx) => {
    const variance = 0.8 + Math.random() * 0.4; // וריאציה של ±20%
    const progressFactor = 1 + index * 0.02; // התקדמות קלה עם הזמן

    const actualSets = Math.max(2, Math.round(ex.sets * variance));
    const actualWeight =
      ex.baseWeight === 0
        ? 0
        : Math.round(
            ex.baseWeight * experienceMultiplier * variance * progressFactor
          );

    return {
      id: `ex_${idx}_${index}`,
      name: ex.name,
      category: ex.category,
      sets: Array.from({ length: actualSets }, (_, setIdx) => {
        const setVariance = 0.9 + Math.random() * 0.2;
        return {
          id: `set_${setIdx}`,
          reps: Math.round(ex.baseReps * setVariance),
          weight: actualWeight,
          status: "completed" as const,
          rest: setIdx < actualSets - 1 ? 60 + Math.random() * 30 : undefined,
        };
      }),
    };
  });

  // חישוב נתונים מציאותיים
  const totalVolume = exercises.reduce(
    (total, ex) =>
      total +
      ex.sets.reduce(
        (exTotal, set) => exTotal + (set.weight || 0) * (set.reps || 0),
        0
      ),
    0
  );

  const durationVariance = 0.8 + Math.random() * 0.4;
  const actualDuration = Math.round(template.baseDuration * durationVariance);
  const actualCalories = Math.round(
    template.baseCalories * experienceMultiplier * durationVariance
  );

  return {
    id: `workout_${userId}_${index}_${date.getTime()}`,
    name: template.name,
    date: date.toISOString(),
    exercises,
    duration: actualDuration,
    calories: actualCalories,
    targetMuscles: template.targetMuscles,
    completedAt: new Date(
      date.getTime() + actualDuration * 60000
    ).toISOString(),
    rating: Math.floor(3 + Math.random() * 3), // דירוג 3-5
    results: {
      totalSets: exercises.reduce((total, ex) => total + ex.sets.length, 0),
      completedSets: exercises.reduce((total, ex) => total + ex.sets.length, 0),
      totalWeight: totalVolume,
      averageRest: 75,
    },
    workoutType: template.name.includes("קרדיו")
      ? ("cardio" as const)
      : ("strength" as const),
  };
};

// 🏋️ יצירת היסטוריה מציאותית לחודש האחרון
const generateWorkoutHistory = (userId: string): Workout[] => {
  const workouts: Workout[] = [];
  const now = new Date();
  const user = demoUsers.find((u) => u.id === userId);

  // קביעת תדירות בהתאם לרמת הניסיון
  let workoutsPerWeek = 3;
  if (user?.experience === "beginner") workoutsPerWeek = 2;
  if (user?.experience === "advanced") workoutsPerWeek = 5;

  // יצירת 30 יום אחורה
  for (let day = 30; day >= 0; day--) {
    const currentDate = new Date(now);
    currentDate.setDate(now.getDate() - day);

    // סיכוי לאימון (לא כל יום)
    const dayOfWeek = currentDate.getDay();
    let workoutChance = 0.4; // 40% סיכוי בסיסי

    // יותר סיכוי בימי חול
    if (dayOfWeek >= 1 && dayOfWeek <= 5) workoutChance = 0.6;

    // פחות סיכוי בסופי שבוע
    if (dayOfWeek === 0 || dayOfWeek === 6) workoutChance = 0.3;

    // התאמה לפי תדירות המשתמש
    workoutChance *= workoutsPerWeek / 3;

    if (Math.random() < workoutChance) {
      workouts.push(createRandomWorkout(currentDate, userId, workouts.length));
    }
  }

  return workouts.sort(
    (a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime()
  );
};

// 🏋️ היסטוריית אימונים לכל משתמש דמו
export const demoWorkoutHistory: { [userId: string]: Workout[] } = {
  "demo-user-avi": generateWorkoutHistory("demo-user-avi"),
  "demo-user-maya": generateWorkoutHistory("demo-user-maya"),
  "demo-user-yoni": generateWorkoutHistory("demo-user-yoni"),
  "demo-user-noa": generateWorkoutHistory("demo-user-noa"),
};

// 🏋️ תוכניות דמו (שמור על הקיימות)
export const demoPlan_Beginner: Plan = {
  id: "demo-plan-beginner",
  name: "תוכנית מתחילים - 3 ימים",
  description: "תוכנית מושלמת למתחילים עם התמקדות ביסודות",
  creator: "Gymovo",
  days: [
    {
      id: "demo-day-1",
      name: "יום א׳ - אימון עליון",
      exercises: [
        {
          id: "pushups",
          name: "שכיבות סמיכה",
          muscleGroup: "חזה",
          sets: 3,
          reps: 8,
        },
        {
          id: "planks",
          name: "פלאנק",
          muscleGroup: "ליבה",
          sets: 3,
          reps: 30,
        },
      ],
    },
    {
      id: "demo-day-2",
      name: "יום ב׳ - אימון תחתון",
      exercises: [
        {
          id: "squats",
          name: "סקוואט",
          muscleGroup: "רגליים",
          sets: 3,
          reps: 10,
        },
        {
          id: "calf-raises",
          name: "הרמות עקב",
          muscleGroup: "שוקיים",
          sets: 3,
          reps: 15,
        },
      ],
    },
  ],
  rating: 4,
};

export const demoPlan_Advanced: Plan = {
  id: "demo-plan-advanced",
  name: "תוכנית מתקדמים - 5 ימים",
  description: "תוכנית אינטנסיבית למתאמנים מנוסים",
  creator: "Gymovo",
  days: [
    {
      id: "adv-day-1",
      name: "יום א׳ - חזה וכתפיים",
      exercises: [
        {
          id: "bench-press",
          name: "לחיצת חזה במוט",
          muscleGroup: "חזה",
          sets: 4,
          reps: 8,
        },
        {
          id: "shoulder-press",
          name: "לחיצת כתפיים",
          muscleGroup: "כתפיים",
          sets: 4,
          reps: 10,
        },
      ],
    },
  ],
  rating: 5,
};

// 🎯 פונקציות עזר מעודכנות
export const getDemoUserById = (userId: string): User | undefined => {
  return demoUsers.find((user) => user.id === userId);
};

export const getDemoPlanForUser = (userId: string): Plan | undefined => {
  const userProfile = getDemoUserById(userId);
  if (!userProfile) return undefined;

  switch (userProfile.experience) {
    case "beginner":
      return demoPlan_Beginner;
    case "advanced":
      return demoPlan_Advanced;
    default:
      return demoPlan_Beginner;
  }
};

// 🏋️ פונקציה לקבלת היסטוריית אימונים למשתמש ספציפי
export const getDemoWorkoutHistory = (userId: string): Workout[] => {
  return demoWorkoutHistory[userId] || [];
};

// 📊 פונקציות סטטיסטיקה לדמו
export const getDemoUserStats = (userId: string) => {
  const workouts = getDemoWorkoutHistory(userId);

  if (workouts.length === 0) {
    return {
      totalWorkouts: 0,
      totalDuration: 0,
      totalVolume: 0,
      averageRating: 0,
      streak: 0,
      thisWeekWorkouts: 0,
      lastWorkout: null,
    };
  }

  const totalDuration = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
  const totalVolume = workouts.reduce(
    (sum, w) => sum + (w.results?.totalWeight || 0),
    0
  );
  const averageRating =
    workouts.reduce((sum, w) => sum + (w.rating || 0), 0) / workouts.length;

  // חישוב streak (ימים רצופים)
  let streak = 0;
  const sortedWorkouts = workouts.sort(
    (a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime()
  );

  const today = new Date();
  for (let i = 0; i < sortedWorkouts.length; i++) {
    const workoutDate = new Date(sortedWorkouts[i].date!);
    const daysDiff = Math.floor(
      (today.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff <= i + 1) {
      streak++;
    } else {
      break;
    }
  }

  // אימונים השבוע
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const thisWeekWorkouts = workouts.filter(
    (w) => new Date(w.date!) > weekAgo
  ).length;

  return {
    totalWorkouts: workouts.length,
    totalDuration,
    totalVolume: Math.round(totalVolume),
    averageRating: Math.round(averageRating * 10) / 10,
    streak,
    thisWeekWorkouts,
    lastWorkout: sortedWorkouts[0] || null,
  };
};

// 🔧 פונקציית עזר לאיפוס נתוני דמו
export const resetDemoData = async (userId: string): Promise<boolean> => {
  try {
    const isDemoUser = demoUsers.some((user) => user.id === userId);
    if (!isDemoUser) return false;

    console.log(`🔄 Resetting demo data for user: ${userId}`);
    return true;
  } catch (error) {
    console.error("Failed to reset demo data:", error);
    return false;
  }
};

// 📱 נתוני מטא מעודכנים
export const demoMeta = {
  version: "1.2.0",
  lastUpdated: new Date().toISOString(),
  totalUsers: demoUsers.length,
  totalPlans: 2,
  totalWorkouts: Object.values(demoWorkoutHistory).reduce(
    (sum, workouts) => sum + workouts.length,
    0
  ),
  features: [
    "realistic-workout-history",
    "user-progression-simulation",
    "varied-workout-types",
    "experience-based-difficulty",
  ],
};
