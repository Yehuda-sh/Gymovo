// src/services/planGenerator.ts - ✅ All errors fixed

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

// ✅ Fixed exercise database with correct spelling
const exerciseDatabase = {
  chest: [
    {
      id: "push_up",
      name: "שכיבות סמיכה",
      muscleGroup: "חזה",
      sets: 3,
      reps: 12,
    },
    {
      id: "chest_press",
      name: "דחיפת חזה",
      muscleGroup: "חזה",
      sets: 3,
      reps: 10,
    },
    {
      id: "chest_flies",
      name: "Chest Flies",
      muscleGroup: "חזה",
      sets: 3,
      reps: 12,
    }, // ✅ Fixed spelling
    {
      id: "incline_press",
      name: "דחיפה בזווית",
      muscleGroup: "חזה",
      sets: 3,
      reps: 10,
    },
    {
      id: "dumbbell_press",
      name: "דחיפת דמבלים",
      muscleGroup: "חזה",
      sets: 3,
      reps: 10,
    },
  ],

  back: [
    { id: "pull_up", name: "Pull-up", muscleGroup: "גב", sets: 3, reps: 8 }, // ✅ Fixed spelling
    {
      id: "bent_over_row",
      name: "חתירה",
      muscleGroup: "גב",
      sets: 3,
      reps: 10,
    },
    {
      id: "lat_pulldown",
      name: "משיכת לאט",
      muscleGroup: "גב",
      sets: 3,
      reps: 12,
    },
    { id: "deadlift", name: "דדליפט", muscleGroup: "גב", sets: 3, reps: 8 },
    {
      id: "cable_row",
      name: "חתירת כבל",
      muscleGroup: "גב",
      sets: 3,
      reps: 12,
    },
  ],

  legs: [
    { id: "squat", name: "סקוואט", muscleGroup: "רגליים", sets: 3, reps: 12 },
    { id: "lunge", name: "לונג'ים", muscleGroup: "רגליים", sets: 3, reps: 10 },
    {
      id: "leg_press",
      name: "דחיפת רגליים",
      muscleGroup: "רגליים",
      sets: 3,
      reps: 12,
    },
    {
      id: "calf_raise",
      name: "הרמת עקבים",
      muscleGroup: "רגליים",
      sets: 3,
      reps: 15,
    },
    {
      id: "leg_curl",
      name: "כיפוף רגליים",
      muscleGroup: "רגליים",
      sets: 3,
      reps: 12,
    },
    {
      id: "leg_extension",
      name: "הארכת רגליים",
      muscleGroup: "רגליים",
      sets: 3,
      reps: 12,
    },
  ],

  shoulders: [
    {
      id: "shoulder_press",
      name: "דחיפת כתפיים",
      muscleGroup: "כתפיים",
      sets: 3,
      reps: 10,
    },
    {
      id: "lateral_raise",
      name: "הרמה צידית",
      muscleGroup: "כתפיים",
      sets: 3,
      reps: 12,
    },
    {
      id: "front_raise",
      name: "הרמה קדמית",
      muscleGroup: "כתפיים",
      sets: 3,
      reps: 12,
    },
    {
      id: "rear_delt_fly",
      name: "זבוב אחורי",
      muscleGroup: "כתפיים",
      sets: 3,
      reps: 12,
    },
    {
      id: "upright_row",
      name: "חתירה זקופה",
      muscleGroup: "כתפיים",
      sets: 3,
      reps: 10,
    },
  ],

  arms: [
    {
      id: "bicep_curl",
      name: "סיבוב ביצפס",
      muscleGroup: "זרועות",
      sets: 3,
      reps: 12,
    },
    {
      id: "tricep_dip",
      name: "דיפס טריצפס",
      muscleGroup: "זרועות",
      sets: 3,
      reps: 10,
    },
    {
      id: "hammer_curl",
      name: "סיבוב פטיש",
      muscleGroup: "זרועות",
      sets: 3,
      reps: 12,
    },
    {
      id: "tricep_extension",
      name: "הארכת טריצפס",
      muscleGroup: "זרועות",
      sets: 3,
      reps: 12,
    },
    {
      id: "close_grip_press",
      name: "דחיפה צרה",
      muscleGroup: "זרועות",
      sets: 3,
      reps: 10,
    },
  ],

  core: [
    { id: "plank", name: "פלאנק", muscleGroup: "ליבה", sets: 3, reps: 30 },
    {
      id: "crunches",
      name: "קראנצ'ים",
      muscleGroup: "ליבה",
      sets: 3,
      reps: 15,
    },
    {
      id: "russian_twist",
      name: "סיבוב רוסי",
      muscleGroup: "ליבה",
      sets: 3,
      reps: 20,
    },
    {
      id: "mountain_climber",
      name: "מטפס הרים",
      muscleGroup: "ליבה",
      sets: 3,
      reps: 20,
    },
    { id: "dead_bug", name: "חרק מת", muscleGroup: "ליבה", sets: 3, reps: 12 },
    {
      id: "bicycle_crunch",
      name: "קראנץ' אופניים",
      muscleGroup: "ליבה",
      sets: 3,
      reps: 20,
    },
  ],
};

// ✅ Helper functions
const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

const generatePlanName = (answers: QuizAnswers): string => {
  const goalNames = {
    strength: "תוכנית לבניית כוח",
    weight_loss: "תוכנית לירידה במשקל",
    endurance: "תוכנית לשיפור סיבולת",
    hypertrophy: "תוכנית לבניית שריר",
  };

  return goalNames[answers.goal] || "תוכנית אימון מותאמת";
};

const generatePlanDescription = (answers: QuizAnswers): string => {
  const experienceText = {
    beginner: "מתחילים",
    intermediate: "בינוניים",
    advanced: "מתקדמים",
  };

  const goalText = {
    strength: "בניית כוח",
    weight_loss: "ירידה במשקל",
    endurance: "שיפור סיבולת",
    hypertrophy: "בניית שריר",
  };

  return `תוכנית אימון מותאמת אישית לרמת ${
    experienceText[answers.experience]
  } עם מטרת ${
    goalText[answers.goal]
  }. נוצרה על בסיס השאלון האישי שלך ומותאמת לציוד הזמין לך.`;
};

const isBodyweightExercise = (exerciseId: string): boolean => {
  const bodyweightExercises = [
    "push_up",
    "pull_up",
    "squat",
    "lunge",
    "plank",
    "crunches",
    "mountain_climber",
    "tricep_dip",
    "russian_twist",
    "dead_bug",
    "bicycle_crunch",
  ];
  return bodyweightExercises.includes(exerciseId);
};

const selectExercisesForGoal = (
  goal: QuizAnswers["goal"],
  experience: QuizAnswers["experience"],
  equipment: string[]
): ExerciseTemplate[] => {
  const allExercises = Object.values(exerciseDatabase).flat();

  // Filter by available equipment
  const availableExercises = allExercises.filter((exercise) => {
    if (equipment.includes("gym") || equipment.includes("full_gym"))
      return true;
    if (
      (equipment.includes("home") || equipment.includes("minimal")) &&
      isBodyweightExercise(exercise.id)
    )
      return true;
    if (
      equipment.includes("dumbbells") &&
      [
        "bicep_curl",
        "hammer_curl",
        "shoulder_press",
        "chest_press",
        "dumbbell_press",
      ].includes(exercise.id)
    )
      return true;
    return false;
  });

  // Select exercises based on goal
  const goalFilteredExercises = availableExercises.filter((exercise) => {
    switch (goal) {
      case "strength":
        return [
          "squat",
          "deadlift",
          "chest_press",
          "pull_up",
          "shoulder_press",
        ].includes(exercise.id);
      case "weight_loss":
        return true; // All exercises are good for weight loss
      case "hypertrophy":
        return exercise.reps >= 8 && exercise.reps <= 15;
      case "endurance":
        return exercise.reps >= 12;
      default:
        return true;
    }
  });

  // Adjust for experience level
  return goalFilteredExercises.map((exercise) => {
    const adjusted = { ...exercise };

    switch (experience) {
      case "beginner":
        adjusted.sets = Math.max(2, exercise.sets - 1);
        adjusted.reps = Math.max(8, exercise.reps - 2);
        break;
      case "advanced":
        adjusted.sets = exercise.sets + 1;
        adjusted.reps = exercise.reps + 2;
        break;
      default: // intermediate
        // Keep as is
        break;
    }

    return adjusted;
  });
};

const createWorkoutDay = (
  dayNumber: number,
  exercises: ExerciseTemplate[],
  answers: QuizAnswers
): PlanDay => {
  const dayNames = [
    "יום עליון",
    "יום תחתון",
    "יום דחיפה",
    "יום משיכה",
    "יום מלא",
    "יום ליבה",
    "יום כוח",
  ];

  const dayExercises: PlanExercise[] = exercises.map((exercise, index) => ({
    id: `${exercise.id}_day${dayNumber}_${index}`,
    name: exercise.name,
    muscleGroup: exercise.muscleGroup,
    sets: exercise.sets,
    reps: exercise.reps,
    weight: exercise.weight,
    restTime: exercise.restTime || (answers.goal === "strength" ? 180 : 90),
  }));

  return {
    id: generateId(),
    name: dayNames[dayNumber - 1] || `יום ${dayNumber}`,
    exercises: dayExercises,
    estimatedDuration: exercises.length * 5 + 15, // Rough estimate
    targetMuscleGroups: [...new Set(exercises.map((e) => e.muscleGroup))],
    difficulty: answers.experience,
  };
};

const createWorkoutSplit = (answers: QuizAnswers): PlanDay[] => {
  const allExercises = selectExercisesForGoal(
    answers.goal,
    answers.experience,
    answers.equipment
  );

  const days: PlanDay[] = [];
  const exercisesPerDay = Math.ceil(allExercises.length / answers.workoutDays);

  // Group exercises by muscle groups for better split
  const exercisesByMuscle = {
    upper: allExercises.filter((e) =>
      ["חזה", "גב", "כתפיים", "זרועות"].includes(e.muscleGroup)
    ),
    lower: allExercises.filter((e) => ["רגליים"].includes(e.muscleGroup)),
    core: allExercises.filter((e) => ["ליבה"].includes(e.muscleGroup)),
  };

  for (let i = 0; i < answers.workoutDays; i++) {
    let dayExercises: ExerciseTemplate[];

    if (answers.workoutDays <= 3) {
      // Full body workouts
      dayExercises = [
        ...exercisesByMuscle.upper.slice(i * 2, (i + 1) * 2),
        ...exercisesByMuscle.lower.slice(i * 1, (i + 1) * 1),
        ...exercisesByMuscle.core.slice(i * 1, (i + 1) * 1),
      ].filter(Boolean);
    } else {
      // Split routine
      if (i % 2 === 0) {
        dayExercises = exercisesByMuscle.upper.slice(0, exercisesPerDay);
      } else {
        dayExercises = [
          ...exercisesByMuscle.lower,
          ...exercisesByMuscle.core,
        ].slice(0, exercisesPerDay);
      }
    }

    if (dayExercises.length > 0) {
      days.push(createWorkoutDay(i + 1, dayExercises, answers));
    }
  }

  return days;
};

// ✅ Main function with all required fields
export const generatePlan = async (
  answers: QuizAnswers,
  userId?: string
): Promise<Plan> => {
  try {
    const planDays = createWorkoutSplit(answers);

    // ✅ Fixed: Include all required Plan fields
    const plan: Plan = {
      id: generateId(),
      name: generatePlanName(answers),
      description: generatePlanDescription(answers),
      creator: "Gymovo AI",
      difficulty: answers.experience,
      days: planDays,
      targetMuscleGroups: [
        ...new Set(planDays.flatMap((day) => day.targetMuscleGroups || [])),
      ],
      durationWeeks: 8, // Default 8-week program
      metadata: {
        goal: answers.goal,
        experience: answers.experience,
        equipment: answers.equipment,
        injuries: answers.injuries,
        generatedAt: new Date().toISOString(),
        version: "1.0",
      },
      // ✅ Required fields that were missing
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: userId || "temp-user-id",
      isActive: true,
      rating: 0,
      weeklyGoal: answers.workoutDays,
      tags: [answers.goal, answers.experience, "AI-generated"],
    };

    return plan;
  } catch (error) {
    console.error("Failed to generate plan:", error);
    throw new Error("שגיאה ביצירת התוכנית. נסה שוב.");
  }
};

// ✅ Additional utility functions
export const validateQuizAnswers = (answers: Partial<QuizAnswers>): boolean => {
  const required: (keyof QuizAnswers)[] = [
    "goal",
    "experience",
    "equipment",
    "workoutDays",
    "timePerSession",
  ];

  return required.every((key) => {
    const value = answers[key];
    if (key === "equipment") {
      return Array.isArray(value) && value.length > 0;
    }
    return value !== undefined && value !== null;
  });
};

export const getRecommendedWorkoutDays = (
  experience: QuizAnswers["experience"],
  goal: QuizAnswers["goal"]
): number => {
  if (experience === "beginner") return 3;
  if (goal === "strength" && experience === "advanced") return 5;
  if (goal === "weight_loss") return 4;
  return 4; // Default
};

export const getEstimatedCaloriesBurn = (
  timePerSession: number,
  goal: QuizAnswers["goal"]
): number => {
  const baseCaloriesPerMinute = {
    strength: 6,
    weight_loss: 8,
    endurance: 7,
    hypertrophy: 6,
  };

  return timePerSession * (baseCaloriesPerMinute[goal] || 7);
};
