// src/services/planGenerator.ts - ✅ תיקון מלא לבעיית הכפילויות

import { Plan, PlanDay, PlanExercise } from "../types/plan";

// ✅ Type-safe interfaces
export interface QuizAnswers {
  goal: "strength" | "weight_loss" | "endurance" | "hypertrophy";
  experience: "beginner" | "intermediate" | "advanced";
  equipment: string[];
  injuries?: string[];
  workoutDays: number;
  timePerSession: number;
}

interface ExerciseTemplate {
  id: string;
  name: string;
  muscleGroup: string;
  sets: number;
  reps: number;
  weight?: number;
  restTime?: number;
}

// ✅ מאגר תרגילים מורחב ומסודר
const exerciseDatabase = {
  chest: [
    {
      id: "bench_press",
      name: "לחיצת חזה במוט",
      muscleGroup: "חזה",
      sets: 4,
      reps: 8,
    },
    {
      id: "incline_press",
      name: "לחיצה בשיפוע חיובי",
      muscleGroup: "חזה",
      sets: 3,
      reps: 10,
    },
    {
      id: "dumbbell_press",
      name: "לחיצת דמבלים",
      muscleGroup: "חזה",
      sets: 3,
      reps: 10,
    },
    {
      id: "chest_flies",
      name: "פתיחת חזה",
      muscleGroup: "חזה",
      sets: 3,
      reps: 12,
    },
    {
      id: "push_up",
      name: "שכיבות סמיכה",
      muscleGroup: "חזה",
      sets: 3,
      reps: 15,
    },
    {
      id: "cable_crossover",
      name: "כבלים מצליבים",
      muscleGroup: "חזה",
      sets: 3,
      reps: 12,
    },
    {
      id: "decline_press",
      name: "לחיצה בשיפוע שלילי",
      muscleGroup: "חזה",
      sets: 3,
      reps: 10,
    },
    { id: "dips", name: "מקבילים", muscleGroup: "חזה", sets: 3, reps: 10 },
  ],

  back: [
    { id: "pull_up", name: "מתח", muscleGroup: "גב", sets: 4, reps: 8 },
    {
      id: "bent_over_row",
      name: "חתירה עם מוט",
      muscleGroup: "גב",
      sets: 4,
      reps: 10,
    },
    {
      id: "lat_pulldown",
      name: "משיכת לאט",
      muscleGroup: "גב",
      sets: 3,
      reps: 12,
    },
    { id: "deadlift", name: "דדליפט", muscleGroup: "גב", sets: 4, reps: 6 },
    {
      id: "cable_row",
      name: "חתירת כבל",
      muscleGroup: "גב",
      sets: 3,
      reps: 12,
    },
    { id: "t_bar_row", name: "חתירת T", muscleGroup: "גב", sets: 3, reps: 10 },
    {
      id: "shrugs",
      name: "כיווצי כתפיים",
      muscleGroup: "גב",
      sets: 3,
      reps: 15,
    },
    {
      id: "face_pulls",
      name: "משיכות לפנים",
      muscleGroup: "גב",
      sets: 3,
      reps: 15,
    },
  ],

  legs: [
    { id: "squat", name: "סקוואט", muscleGroup: "רגליים", sets: 4, reps: 8 },
    {
      id: "leg_press",
      name: "לחיצת רגליים",
      muscleGroup: "רגליים",
      sets: 4,
      reps: 12,
    },
    { id: "lunge", name: "לאנג'ים", muscleGroup: "רגליים", sets: 3, reps: 10 },
    {
      id: "romanian_deadlift",
      name: "דדליפט רומני",
      muscleGroup: "רגליים",
      sets: 3,
      reps: 10,
    },
    {
      id: "leg_curl",
      name: "כפיפת ברכיים",
      muscleGroup: "רגליים",
      sets: 3,
      reps: 12,
    },
    {
      id: "leg_extension",
      name: "פשיטת ברכיים",
      muscleGroup: "רגליים",
      sets: 3,
      reps: 12,
    },
    {
      id: "calf_raise",
      name: "הרמות עקבים",
      muscleGroup: "רגליים",
      sets: 4,
      reps: 20,
    },
    {
      id: "bulgarian_split",
      name: "בולגרי ספליט",
      muscleGroup: "רגליים",
      sets: 3,
      reps: 10,
    },
  ],

  shoulders: [
    {
      id: "shoulder_press",
      name: "לחיצת כתפיים",
      muscleGroup: "כתפיים",
      sets: 4,
      reps: 8,
    },
    {
      id: "lateral_raise",
      name: "הרמות צד",
      muscleGroup: "כתפיים",
      sets: 3,
      reps: 12,
    },
    {
      id: "front_raise",
      name: "הרמות קדמיות",
      muscleGroup: "כתפיים",
      sets: 3,
      reps: 12,
    },
    {
      id: "rear_delt_fly",
      name: "פתיחה אחורית",
      muscleGroup: "כתפיים",
      sets: 3,
      reps: 15,
    },
    {
      id: "arnold_press",
      name: "לחיצת ארנולד",
      muscleGroup: "כתפיים",
      sets: 3,
      reps: 10,
    },
    {
      id: "upright_row",
      name: "חתירה זקופה",
      muscleGroup: "כתפיים",
      sets: 3,
      reps: 12,
    },
  ],

  arms: [
    {
      id: "bicep_curl",
      name: "כפיפת מרפקים",
      muscleGroup: "יד קדמית",
      sets: 3,
      reps: 12,
    },
    {
      id: "hammer_curl",
      name: "פטיש",
      muscleGroup: "יד קדמית",
      sets: 3,
      reps: 12,
    },
    {
      id: "tricep_pushdown",
      name: "פשיטת מרפקים",
      muscleGroup: "יד אחורית",
      sets: 3,
      reps: 12,
    },
    {
      id: "preacher_curl",
      name: "כפיפה בספסל מטיף",
      muscleGroup: "יד קדמית",
      sets: 3,
      reps: 10,
    },
    {
      id: "overhead_extension",
      name: "פשיטה מעל הראש",
      muscleGroup: "יד אחורית",
      sets: 3,
      reps: 12,
    },
    {
      id: "cable_curl",
      name: "כפיפת כבל",
      muscleGroup: "יד קדמית",
      sets: 3,
      reps: 15,
    },
    {
      id: "close_grip_press",
      name: "לחיצה אחיזה צרה",
      muscleGroup: "יד אחורית",
      sets: 3,
      reps: 10,
    },
  ],

  core: [
    { id: "plank", name: "פלאנק", muscleGroup: "ליבה", sets: 3, reps: 60 },
    {
      id: "crunches",
      name: "כפיפות בטן",
      muscleGroup: "ליבה",
      sets: 3,
      reps: 20,
    },
    {
      id: "russian_twist",
      name: "סיבוב רוסי",
      muscleGroup: "ליבה",
      sets: 3,
      reps: 20,
    },
    {
      id: "leg_raise",
      name: "הרמות רגליים",
      muscleGroup: "ליבה",
      sets: 3,
      reps: 15,
    },
    {
      id: "dead_bug",
      name: "חיפושית מתה",
      muscleGroup: "ליבה",
      sets: 3,
      reps: 10,
    },
    {
      id: "bicycle_crunch",
      name: "אופניים",
      muscleGroup: "ליבה",
      sets: 3,
      reps: 20,
    },
    {
      id: "cable_crunch",
      name: "כפיפות כבל",
      muscleGroup: "ליבה",
      sets: 3,
      reps: 15,
    },
  ],
};

// ✅ תבניות אימון לכל מספר ימי אימון
const WORKOUT_TEMPLATES = {
  2: {
    name: "Upper/Lower Split",
    days: [
      {
        name: "יום עליון",
        muscleGroups: ["chest", "back", "shoulders", "arms"],
      },
      { name: "יום תחתון", muscleGroups: ["legs", "core"] },
    ],
  },
  3: {
    name: "Push/Pull/Legs",
    days: [
      { name: "Push - דחיפה", muscleGroups: ["chest", "shoulders", "arms"] },
      { name: "Pull - משיכה", muscleGroups: ["back", "arms"] },
      { name: "Legs - רגליים", muscleGroups: ["legs", "core"] },
    ],
  },
  4: {
    name: "Upper/Lower x2",
    days: [
      { name: "עליון א'", muscleGroups: ["chest", "back"] },
      { name: "תחתון א'", muscleGroups: ["legs"] },
      { name: "עליון ב'", muscleGroups: ["shoulders", "arms"] },
      { name: "תחתון ב' + ליבה", muscleGroups: ["legs", "core"] },
    ],
  },
  5: {
    name: "Push/Pull/Legs/Upper/Lower",
    days: [
      { name: "Push - דחיפה", muscleGroups: ["chest", "shoulders"] },
      { name: "Pull - משיכה", muscleGroups: ["back"] },
      { name: "Legs - רגליים", muscleGroups: ["legs"] },
      { name: "Upper - עליון", muscleGroups: ["chest", "back", "shoulders"] },
      { name: "Arms & Core", muscleGroups: ["arms", "core"] },
    ],
  },
  6: {
    name: "Push/Pull/Legs x2",
    days: [
      { name: "Push א'", muscleGroups: ["chest", "shoulders"] },
      { name: "Pull א'", muscleGroups: ["back"] },
      { name: "Legs א'", muscleGroups: ["legs"] },
      { name: "Push ב'", muscleGroups: ["chest", "arms"] },
      { name: "Pull ב'", muscleGroups: ["back", "arms"] },
      { name: "Legs ב' + ליבה", muscleGroups: ["legs", "core"] },
    ],
  },
  7: {
    name: "מפוצל מלא",
    days: [
      { name: "חזה", muscleGroups: ["chest"] },
      { name: "גב", muscleGroups: ["back"] },
      { name: "רגליים", muscleGroups: ["legs"] },
      { name: "כתפיים", muscleGroups: ["shoulders"] },
      { name: "ידיים", muscleGroups: ["arms"] },
      { name: "רגליים ב'", muscleGroups: ["legs"] },
      { name: "ליבה ותיקונים", muscleGroups: ["core", "shoulders"] },
    ],
  },
};

// ✅ פונקציית ערבוב מערך (Fisher-Yates shuffle)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ✅ בחירת תרגילים לפי קבוצת שרירים
function selectExercisesForMuscleGroups(
  muscleGroups: string[],
  answers: QuizAnswers,
  exercisesPerGroup: number = 3
): ExerciseTemplate[] {
  const selectedExercises: ExerciseTemplate[] = [];

  muscleGroups.forEach((group) => {
    const groupExercises =
      exerciseDatabase[group as keyof typeof exerciseDatabase] || [];
    const filteredExercises = filterExercisesByEquipment(
      groupExercises,
      answers.equipment
    );
    const shuffled = shuffleArray(filteredExercises);
    const selected = shuffled.slice(0, exercisesPerGroup);

    // התאמה לרמת ניסיון
    const adjusted = selected.map((ex) =>
      adjustExerciseForExperience(ex, answers.experience)
    );
    selectedExercises.push(...adjusted);
  });

  // ערבוב סדר התרגילים ביום
  return shuffleArray(selectedExercises);
}

// ✅ סינון תרגילים לפי ציוד זמין
function filterExercisesByEquipment(
  exercises: ExerciseTemplate[],
  equipment: string[]
): ExerciseTemplate[] {
  const bodyweightExercises = [
    "push_up",
    "pull_up",
    "dips",
    "plank",
    "crunches",
    "lunge",
  ];

  return exercises.filter((exercise) => {
    // אם יש חדר כושר מלא - כל התרגילים זמינים
    if (equipment.includes("gym") || equipment.includes("full_gym"))
      return true;

    // אם יש רק ציוד ביתי
    if (equipment.includes("home") || equipment.includes("minimal")) {
      return bodyweightExercises.includes(exercise.id);
    }

    // אם יש משקולות
    if (equipment.includes("dumbbells")) {
      return (
        exercise.name.includes("דמבל") || exercise.name.includes("משקולות")
      );
    }

    return false;
  });
}

// ✅ התאמת תרגיל לרמת ניסיון
function adjustExerciseForExperience(
  exercise: ExerciseTemplate,
  experience: QuizAnswers["experience"]
): ExerciseTemplate {
  const adjusted = { ...exercise };

  switch (experience) {
    case "beginner":
      adjusted.sets = Math.max(2, exercise.sets - 1);
      adjusted.reps = Math.max(8, exercise.reps - 2);
      break;
    case "advanced":
      adjusted.sets = Math.min(5, exercise.sets + 1);
      adjusted.reps = exercise.reps + 2;
      break;
    default: // intermediate
      // שומרים כמו שהוא
      break;
  }

  return adjusted;
}

// ✅ יצירת יום אימון
function createWorkoutDay(
  dayTemplate: { name: string; muscleGroups: string[] },
  exercises: ExerciseTemplate[],
  dayNumber: number,
  answers: QuizAnswers
): PlanDay {
  const planExercises: PlanExercise[] = exercises.map((exercise, index) => ({
    id: `${exercise.id}_day${dayNumber}_${Date.now()}_${index}`,
    name: exercise.name,
    muscleGroup: exercise.muscleGroup,
    sets: exercise.sets,
    reps: exercise.reps,
    weight: exercise.weight,
    restTime: getRestTimeForGoal(answers.goal),
    order: index + 1,
  }));

  return {
    id: `day_${dayNumber}_${Date.now()}`,
    name: dayTemplate.name,
    description: `אימון מותאם ל${dayTemplate.muscleGroups.join(", ")}`,
    exercises: planExercises,
    targetMuscleGroups: dayTemplate.muscleGroups,
    difficulty: answers.experience,
    order: dayNumber,
    estimatedDuration: calculateDayDuration(
      planExercises.length,
      answers.timePerSession
    ),
  };
}

// ✅ חישוב זמן מנוחה לפי יעד
function getRestTimeForGoal(goal: QuizAnswers["goal"]): number {
  switch (goal) {
    case "strength":
      return 180; // 3 דקות
    case "hypertrophy":
      return 90; // 1.5 דקות
    case "endurance":
      return 45; // 45 שניות
    case "weight_loss":
      return 60; // דקה
    default:
      return 90;
  }
}

// ✅ חישוב משך יום אימון
function calculateDayDuration(
  exerciseCount: number,
  targetTime: number
): number {
  const estimatedMinutes = exerciseCount * 5; // 5 דקות לתרגיל בממוצע
  return Math.min(estimatedMinutes, targetTime);
}

// ✅ יצירת מזהה ייחודי
function generateUniqueId(): string {
  return `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ✅ יצירת hash ייחודי לתשובות השאלון
function createAnswersHash(answers: QuizAnswers): string {
  const key = [
    answers.goal,
    answers.experience,
    answers.workoutDays,
    answers.equipment.sort().join(","),
    answers.injuries?.sort().join(",") || "",
    answers.timePerSession,
  ].join("|");

  return key;
}

// ✅ יצירת תוכנית אימון מהשאלון
export function generatePlanFromQuiz(
  answers: QuizAnswers,
  userId?: string
): Plan {
  // בחירת תבנית לפי מספר ימי אימון
  const template =
    WORKOUT_TEMPLATES[answers.workoutDays as keyof typeof WORKOUT_TEMPLATES] ||
    WORKOUT_TEMPLATES[3];

  // יצירת ימי אימון
  const days: PlanDay[] = template.days.map((dayTemplate, index) => {
    const exercises = selectExercisesForMuscleGroups(
      dayTemplate.muscleGroups,
      answers,
      Math.floor(8 / dayTemplate.muscleGroups.length) // 8 תרגילים ליום בממוצע
    );

    return createWorkoutDay(dayTemplate, exercises, index + 1, answers);
  });

  // יצירת hash מהתשובות לזיהוי תוכניות זהות
  const answersHash = createAnswersHash(answers);

  // יצירת התוכנית
  const plan: Plan = {
    id: generateUniqueId(),
    name: generatePlanName(answers),
    description: generatePlanDescription(answers),
    userId: userId || "current_user", // יוחלף במזהה משתמש אמיתי
    creator: "Gymovo AI",
    creatorType: "ai",

    // מאפייני תוכנית
    difficulty: answers.experience,
    mainGoal: answers.goal,
    durationWeeks: 8, // ברירת מחדל
    weeklyGoal: answers.workoutDays,
    days,

    // תיוג וקטגוריות
    tags: [
      "AI-generated",
      answers.goal,
      answers.experience,
      ...answers.equipment,
      `quiz-hash:${answersHash}`,
    ],
    equipment: answers.equipment,
    location: answers.equipment.includes("gym") ? "gym" : "home",

    // חותמות זמן
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),

    // מטא דאטה
    metadata: {
      generatedAt: new Date().toISOString(),
      generatedBy: "AI",
      goal: answers.goal,
      experience: answers.experience,
      equipment: answers.equipment,
      injuries: answers.injuries,
      preferences: {
        timePerSession: answers.timePerSession,
      },
    },

    // סטטוס
    isActive: true,
    isTemplate: false,
    rating: 5,
  };

  return plan;
}

// ✅ יצירת שם תוכנית
function generatePlanName(answers: QuizAnswers): string {
  const goalNames = {
    strength: "תוכנית כוח",
    hypertrophy: "תוכנית נפח שריר",
    weight_loss: "תוכנית הרזיה",
    endurance: "תוכנית סיבולת",
  };

  const experienceNames = {
    beginner: "למתחילים",
    intermediate: "למתקדמים",
    advanced: "למקצוענים",
  };

  const template =
    WORKOUT_TEMPLATES[answers.workoutDays as keyof typeof WORKOUT_TEMPLATES];

  return `${goalNames[answers.goal]} ${experienceNames[answers.experience]} - ${
    template?.name || `${answers.workoutDays} ימים`
  }`;
}

// ✅ יצירת תיאור תוכנית
function generatePlanDescription(answers: QuizAnswers): string {
  const template =
    WORKOUT_TEMPLATES[answers.workoutDays as keyof typeof WORKOUT_TEMPLATES];

  return `תוכנית ${template?.name || "מותאמת אישית"} ל-${
    answers.workoutDays
  } ימי אימון בשבוע. 
התוכנית מיועדת ל${
    answers.goal === "strength"
      ? "פיתוח כוח"
      : answers.goal === "hypertrophy"
      ? "בניית מסת שריר"
      : answers.goal === "weight_loss"
      ? "ירידה במשקל"
      : "שיפור סיבולת"
  } 
ומותאמת ל${
    answers.experience === "beginner"
      ? "מתחילים"
      : answers.experience === "intermediate"
      ? "מתאמנים מתקדמים"
      : "מתאמנים מנוסים"
  }. 
כל אימון מתוכנן לכ-${answers.timePerSession} דקות.`;
}

// ✅ מניעת כפילויות - בדיקה אם תוכנית דומה כבר קיימת
export function isPlanDuplicate(newPlan: Plan, existingPlans: Plan[]): boolean {
  return existingPlans.some((existingPlan) => {
    // בדיקת hash זהה בתגיות
    const newHash = newPlan.tags?.find((tag) => tag.startsWith("quiz-hash:"));
    const existingHash = existingPlan.tags?.find((tag) =>
      tag.startsWith("quiz-hash:")
    );

    if (newHash && existingHash && newHash === existingHash) {
      return true;
    }

    // בדיקת שם זהה ומספר ימים זהה
    if (
      existingPlan.name === newPlan.name &&
      existingPlan.days?.length === newPlan.days?.length
    ) {
      return true;
    }

    // בדיקת מטא-דאטה זהה
    if (existingPlan.metadata && newPlan.metadata) {
      const sameMeta =
        existingPlan.metadata.goal === newPlan.metadata.goal &&
        existingPlan.metadata.experience === newPlan.metadata.experience &&
        existingPlan.weeklyGoal === newPlan.weeklyGoal;

      if (sameMeta) return true;
    }

    return false;
  });
}

// ✅ מחזיר תוכנית קיימת אם יש כזו עם אותן תשובות
export function findExistingPlanByAnswers(
  answers: QuizAnswers,
  existingPlans: Plan[]
): Plan | null {
  const answersHash = createAnswersHash(answers);
  const hashTag = `quiz-hash:${answersHash}`;

  return (
    existingPlans.find(
      (plan) =>
        plan.tags?.includes("AI-generated") && plan.tags?.includes(hashTag)
    ) || null
  );
}

// ✅ Export של פונקציות עזר לבדיקות
export const testHelpers = {
  shuffleArray,
  selectExercisesForMuscleGroups,
  filterExercisesByEquipment,
  adjustExerciseForExperience,
};
