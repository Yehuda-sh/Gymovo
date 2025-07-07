// 🧠 מנוע יצירת תוכניות אימון חכם - מתאים תוכניות על בסיס תשובות שאלון
// src/services/planGenerator.ts

import { Plan, PlanDay, PlanExercise } from "../types/plan";

// 📊 טיפוסי נתונים לאלגוריתם
export interface QuizAnswers {
  goal: "hypertrophy" | "strength" | "endurance" | "weight_loss";
  whereToTrain: string[];
  gymMachines?: string[];
  homeEquipment?: string[];
  experience: "beginner" | "intermediate" | "advanced";
  days: number;
  injuries?: string[];
  injuryDetails?: string;
  trainingType: string[];
  preferredTime: string;
  motivation: string[];
}

// 🏋️‍♂️ מאגר תרגילים מלא לפי קטגוריות וציוד
const EXERCISE_DATABASE = {
  // תרגילי חזה
  chest: {
    gym: [
      {
        name: "Bench Press",
        equipment: ["barbell", "bench"],
        difficulty: "intermediate",
        sets: 4,
        reps: 8,
      },
      {
        name: "Incline Dumbbell Press",
        equipment: ["dumbbells", "incline_bench"],
        difficulty: "beginner",
        sets: 3,
        reps: 10,
      },
      {
        name: "Chest Press Machine",
        equipment: ["chest_press"],
        difficulty: "beginner",
        sets: 3,
        reps: 12,
      },
      {
        name: "Cable Flyes",
        equipment: ["cable_machine"],
        difficulty: "intermediate",
        sets: 3,
        reps: 12,
      },
      {
        name: "Dips",
        equipment: ["dip_station"],
        difficulty: "advanced",
        sets: 3,
        reps: 10,
      },
    ],
    home_equipment: [
      {
        name: "Dumbbell Bench Press",
        equipment: ["dumbbells", "bench"],
        difficulty: "beginner",
        sets: 3,
        reps: 10,
      },
      {
        name: "Dumbbell Flyes",
        equipment: ["dumbbells", "bench"],
        difficulty: "intermediate",
        sets: 3,
        reps: 12,
      },
      {
        name: "Resistance Band Chest Press",
        equipment: ["resistance_bands"],
        difficulty: "beginner",
        sets: 3,
        reps: 15,
      },
    ],
    no_equipment: [
      {
        name: "Push-ups",
        equipment: [],
        difficulty: "beginner",
        sets: 3,
        reps: 12,
      },
      {
        name: "Diamond Push-ups",
        equipment: [],
        difficulty: "intermediate",
        sets: 3,
        reps: 8,
      },
      {
        name: "Wide Push-ups",
        equipment: [],
        difficulty: "beginner",
        sets: 3,
        reps: 10,
      },
      {
        name: "Incline Push-ups",
        equipment: [],
        difficulty: "beginner",
        sets: 3,
        reps: 15,
      },
    ],
  },

  // תרגילי גב
  back: {
    gym: [
      {
        name: "Pull-ups",
        equipment: ["pullup_bar"],
        difficulty: "advanced",
        sets: 4,
        reps: 6,
      },
      {
        name: "Lat Pulldown",
        equipment: ["lat_pulldown"],
        difficulty: "beginner",
        sets: 3,
        reps: 10,
      },
      {
        name: "Barbell Rows",
        equipment: ["barbell"],
        difficulty: "intermediate",
        sets: 4,
        reps: 8,
      },
      {
        name: "Cable Rows",
        equipment: ["cable_machine"],
        difficulty: "beginner",
        sets: 3,
        reps: 12,
      },
      {
        name: "T-Bar Row",
        equipment: ["t_bar"],
        difficulty: "intermediate",
        sets: 3,
        reps: 10,
      },
    ],
    home_equipment: [
      {
        name: "Dumbbell Rows",
        equipment: ["dumbbells"],
        difficulty: "beginner",
        sets: 3,
        reps: 10,
      },
      {
        name: "Resistance Band Rows",
        equipment: ["resistance_bands"],
        difficulty: "beginner",
        sets: 3,
        reps: 15,
      },
      {
        name: "TRX Rows",
        equipment: ["trx"],
        difficulty: "intermediate",
        sets: 3,
        reps: 12,
      },
    ],
    no_equipment: [
      {
        name: "Superman",
        equipment: [],
        difficulty: "beginner",
        sets: 3,
        reps: 15,
      },
      {
        name: "Reverse Snow Angels",
        equipment: [],
        difficulty: "beginner",
        sets: 3,
        reps: 12,
      },
      {
        name: "Good Mornings",
        equipment: [],
        difficulty: "intermediate",
        sets: 3,
        reps: 12,
      },
    ],
  },

  // תרגילי רגליים
  legs: {
    gym: [
      {
        name: "Squats",
        equipment: ["barbell", "squat_rack"],
        difficulty: "intermediate",
        sets: 4,
        reps: 8,
      },
      {
        name: "Leg Press",
        equipment: ["leg_press"],
        difficulty: "beginner",
        sets: 3,
        reps: 12,
      },
      {
        name: "Deadlifts",
        equipment: ["barbell"],
        difficulty: "advanced",
        sets: 4,
        reps: 6,
      },
      {
        name: "Leg Extension",
        equipment: ["leg_extension"],
        difficulty: "beginner",
        sets: 3,
        reps: 15,
      },
      {
        name: "Leg Curl",
        equipment: ["leg_curl"],
        difficulty: "beginner",
        sets: 3,
        reps: 12,
      },
    ],
    home_equipment: [
      {
        name: "Goblet Squats",
        equipment: ["dumbbells"],
        difficulty: "beginner",
        sets: 3,
        reps: 12,
      },
      {
        name: "Bulgarian Split Squats",
        equipment: ["dumbbells"],
        difficulty: "intermediate",
        sets: 3,
        reps: 10,
      },
      {
        name: "Resistance Band Squats",
        equipment: ["resistance_bands"],
        difficulty: "beginner",
        sets: 3,
        reps: 15,
      },
    ],
    no_equipment: [
      {
        name: "Bodyweight Squats",
        equipment: [],
        difficulty: "beginner",
        sets: 3,
        reps: 15,
      },
      {
        name: "Lunges",
        equipment: [],
        difficulty: "beginner",
        sets: 3,
        reps: 12,
      },
      {
        name: "Single Leg Squats",
        equipment: [],
        difficulty: "advanced",
        sets: 3,
        reps: 6,
      },
      {
        name: "Wall Sit",
        equipment: [],
        difficulty: "intermediate",
        sets: 3,
        reps: 30,
      },
    ],
  },

  // תרגילי כתפיים
  shoulders: {
    gym: [
      {
        name: "Overhead Press",
        equipment: ["barbell"],
        difficulty: "intermediate",
        sets: 4,
        reps: 8,
      },
      {
        name: "Dumbbell Shoulder Press",
        equipment: ["dumbbells"],
        difficulty: "beginner",
        sets: 3,
        reps: 10,
      },
      {
        name: "Lateral Raises",
        equipment: ["dumbbells"],
        difficulty: "beginner",
        sets: 3,
        reps: 12,
      },
      {
        name: "Shoulder Press Machine",
        equipment: ["shoulder_press"],
        difficulty: "beginner",
        sets: 3,
        reps: 12,
      },
    ],
    home_equipment: [
      {
        name: "Dumbbell Shoulder Press",
        equipment: ["dumbbells"],
        difficulty: "beginner",
        sets: 3,
        reps: 10,
      },
      {
        name: "Resistance Band Shoulder Press",
        equipment: ["resistance_bands"],
        difficulty: "beginner",
        sets: 3,
        reps: 15,
      },
    ],
    no_equipment: [
      {
        name: "Pike Push-ups",
        equipment: [],
        difficulty: "intermediate",
        sets: 3,
        reps: 8,
      },
      {
        name: "Handstand Push-ups",
        equipment: [],
        difficulty: "advanced",
        sets: 3,
        reps: 5,
      },
    ],
  },

  // תרגילי זרועות
  arms: {
    gym: [
      {
        name: "Barbell Curls",
        equipment: ["barbell"],
        difficulty: "beginner",
        sets: 3,
        reps: 10,
      },
      {
        name: "Tricep Dips",
        equipment: ["dip_station"],
        difficulty: "intermediate",
        sets: 3,
        reps: 10,
      },
      {
        name: "Cable Curls",
        equipment: ["cable_machine"],
        difficulty: "beginner",
        sets: 3,
        reps: 12,
      },
    ],
    home_equipment: [
      {
        name: "Dumbbell Curls",
        equipment: ["dumbbells"],
        difficulty: "beginner",
        sets: 3,
        reps: 10,
      },
      {
        name: "Tricep Extensions",
        equipment: ["dumbbells"],
        difficulty: "beginner",
        sets: 3,
        reps: 12,
      },
    ],
    no_equipment: [
      {
        name: "Close-Grip Push-ups",
        equipment: [],
        difficulty: "intermediate",
        sets: 3,
        reps: 8,
      },
      {
        name: "Tricep Dips (Chair)",
        equipment: [],
        difficulty: "beginner",
        sets: 3,
        reps: 10,
      },
    ],
  },

  // תרגילי ליבה
  core: {
    gym: [
      {
        name: "Planks",
        equipment: [],
        difficulty: "beginner",
        sets: 3,
        reps: 45,
      },
      {
        name: "Russian Twists",
        equipment: ["medicine_ball"],
        difficulty: "intermediate",
        sets: 3,
        reps: 20,
      },
      {
        name: "Cable Woodchoppers",
        equipment: ["cable_machine"],
        difficulty: "intermediate",
        sets: 3,
        reps: 12,
      },
    ],
    home_equipment: [
      {
        name: "Fitball Crunches",
        equipment: ["fitball"],
        difficulty: "beginner",
        sets: 3,
        reps: 15,
      },
      {
        name: "Resistance Band Twists",
        equipment: ["resistance_bands"],
        difficulty: "beginner",
        sets: 3,
        reps: 20,
      },
    ],
    no_equipment: [
      {
        name: "Planks",
        equipment: [],
        difficulty: "beginner",
        sets: 3,
        reps: 45,
      },
      {
        name: "Mountain Climbers",
        equipment: [],
        difficulty: "intermediate",
        sets: 3,
        reps: 20,
      },
      {
        name: "Bicycle Crunches",
        equipment: [],
        difficulty: "beginner",
        sets: 3,
        reps: 20,
      },
      {
        name: "Dead Bug",
        equipment: [],
        difficulty: "beginner",
        sets: 3,
        reps: 10,
      },
    ],
  },

  // תרגילי קרדיו
  cardio: {
    gym: [
      {
        name: "Treadmill",
        equipment: ["treadmill"],
        difficulty: "beginner",
        sets: 1,
        reps: 20,
      },
      {
        name: "Rowing Machine",
        equipment: ["rowing_machine"],
        difficulty: "intermediate",
        sets: 1,
        reps: 15,
      },
      {
        name: "Elliptical",
        equipment: ["elliptical"],
        difficulty: "beginner",
        sets: 1,
        reps: 20,
      },
    ],
    home_equipment: [
      {
        name: "Stationary Bike",
        equipment: ["cardio_machine"],
        difficulty: "beginner",
        sets: 1,
        reps: 20,
      },
    ],
    no_equipment: [
      {
        name: "Burpees",
        equipment: [],
        difficulty: "advanced",
        sets: 3,
        reps: 10,
      },
      {
        name: "High Knees",
        equipment: [],
        difficulty: "beginner",
        sets: 3,
        reps: 30,
      },
      {
        name: "Jumping Jacks",
        equipment: [],
        difficulty: "beginner",
        sets: 3,
        reps: 20,
      },
      {
        name: "Running in Place",
        equipment: [],
        difficulty: "beginner",
        sets: 1,
        reps: 300,
      },
    ],
  },
};

// 🎯 תבניות אימון לפי מטרות
const TRAINING_TEMPLATES = {
  hypertrophy: {
    name: "הגדלת מסת שריר",
    description: "תוכנית מותאמת לבניית שריר ועלייה במסה",
    muscleGroups: ["chest", "back", "legs", "shoulders", "arms", "core"],
    setsRange: [3, 4],
    repsRange: [8, 12],
    restTime: 90,
    intensity: "moderate-high",
  },
  strength: {
    name: "חיזוק כוח",
    description: "תוכנית מותאמת לשיפור כוח מקסימלי",
    muscleGroups: ["legs", "back", "chest", "shoulders"],
    setsRange: [4, 5],
    repsRange: [3, 6],
    restTime: 120,
    intensity: "high",
  },
  endurance: {
    name: "סיבולת וחיטוב",
    description: "תוכנית מותאמת לשיפור סיבולת וחיטוב השרירים",
    muscleGroups: ["legs", "core", "cardio", "chest", "back"],
    setsRange: [2, 3],
    repsRange: [15, 20],
    restTime: 60,
    intensity: "moderate",
  },
  weight_loss: {
    name: "ירידה במשקל",
    description: "תוכנית מותאמת לשריפת קלוריות וירידה במשקל",
    muscleGroups: ["cardio", "legs", "core", "chest", "back"],
    setsRange: [3, 4],
    repsRange: [12, 15],
    restTime: 45,
    intensity: "moderate-high",
  },
};

// 🧮 אלגוריתם חישוב עומסים לפי רמת ניסיון
const calculateIntensity = (experience: string, baseReps: number) => {
  const multipliers = {
    beginner: { sets: 0.8, reps: 1.2, weight: 0.7 },
    intermediate: { sets: 1.0, reps: 1.0, weight: 1.0 },
    advanced: { sets: 1.2, reps: 0.8, weight: 1.3 },
  };

  return (
    multipliers[experience as keyof typeof multipliers] ||
    multipliers.intermediate
  );
};

// 🚫 סינון תרגילים לפי פציעות
const filterExercisesByInjuries = (exercises: any[], injuries: string[]) => {
  const injuryRestrictions = {
    back: ["Deadlifts", "Barbell Rows", "Good Mornings"],
    knee: ["Squats", "Leg Press", "Lunges", "Bulgarian Split Squats"],
    shoulder: ["Overhead Press", "Shoulder Press", "Handstand Push-ups"],
    ankle: ["Running", "Jumping Jacks", "Burpees"],
    heart: ["Burpees", "High Intensity"], // תרגילים עתירי עומס
  };

  if (!injuries || injuries.includes("none")) return exercises;

  return exercises.filter((exercise) => {
    return !injuries.some((injury) =>
      injuryRestrictions[injury as keyof typeof injuryRestrictions]?.includes(
        exercise.name
      )
    );
  });
};

// 🏗️ בניית יום אימון
const createWorkoutDay = (
  dayName: string,
  muscleGroups: string[],
  answers: QuizAnswers,
  template: any
): PlanDay => {
  const availableEquipment = [
    ...(answers.gymMachines || []),
    ...(answers.homeEquipment || []),
  ];

  const exercises: PlanExercise[] = [];
  let exerciseId = 1;

  muscleGroups.forEach((muscleGroup) => {
    // בחירת מאגר תרגילים לפי סוג אימון
    let exercisePool = [];

    if (answers.whereToTrain.includes("gym")) {
      exercisePool =
        EXERCISE_DATABASE[muscleGroup as keyof typeof EXERCISE_DATABASE]?.gym ||
        [];
    } else if (answers.whereToTrain.includes("home_equipment")) {
      exercisePool =
        EXERCISE_DATABASE[muscleGroup as keyof typeof EXERCISE_DATABASE]
          ?.home_equipment || [];
    } else {
      exercisePool =
        EXERCISE_DATABASE[muscleGroup as keyof typeof EXERCISE_DATABASE]
          ?.no_equipment || [];
    }

    // סינון לפי ציוד זמין
    const availableExercises = exercisePool.filter((exercise) => {
      if (exercise.equipment.length === 0) return true; // תרגילי משקל גוף
      return exercise.equipment.some((eq) => availableEquipment.includes(eq));
    });

    // סינון לפי פציעות
    const safeExercises = filterExercisesByInjuries(
      availableExercises,
      answers.injuries || []
    );

    // סינון לפי רמת ניסיון
    const suitableExercises = safeExercises.filter((exercise) => {
      if (answers.experience === "beginner")
        return exercise.difficulty !== "advanced";
      if (answers.experience === "advanced")
        return exercise.difficulty !== "beginner";
      return true;
    });

    // בחירת תרגיל אקראי מהרשימה המתאימה
    if (suitableExercises.length > 0) {
      const selectedExercise =
        suitableExercises[Math.floor(Math.random() * suitableExercises.length)];
      const intensity = calculateIntensity(
        answers.experience,
        selectedExercise.reps
      );

      exercises.push({
        id: exerciseId.toString(),
        name: selectedExercise.name,
        muscleGroup: muscleGroup,
        sets: Math.round(selectedExercise.sets * intensity.sets),
        reps: Math.round(selectedExercise.reps * intensity.reps),
        weight: 0, // יוגדר על ידי המשתמש
        notes: `זמן מנוחה מומלץ: ${template.restTime} שניות`,
      });

      exerciseId++;
    }
  });

  return {
    id: dayName.toLowerCase().replace(/\s+/g, "_"),
    name: dayName,
    exercises: exercises,
  };
};

// 🗓️ בניית תוכנית שבועית
const createWeeklySchedule = (
  answers: QuizAnswers,
  template: any
): PlanDay[] => {
  const days: PlanDay[] = [];
  const muscleGroups = template.muscleGroups;

  // חלוקת קבוצות שרירים לפי מספר ימי אימון
  if (answers.days === 3) {
    days.push(
      createWorkoutDay(
        "יום א' - חזה ותלת ראשי",
        ["chest", "arms", "core"],
        answers,
        template
      ),
      createWorkoutDay(
        "יום ב' - גב ודו ראשי",
        ["back", "arms", "core"],
        answers,
        template
      ),
      createWorkoutDay(
        "יום ג' - רגליים וכתפיים",
        ["legs", "shoulders", "core"],
        answers,
        template
      )
    );
  } else if (answers.days === 4) {
    days.push(
      createWorkoutDay(
        "יום א' - חזה ותלת ראשי",
        ["chest", "arms"],
        answers,
        template
      ),
      createWorkoutDay(
        "יום ב' - גב ודו ראשי",
        ["back", "arms"],
        answers,
        template
      ),
      createWorkoutDay("יום ג' - רגליים", ["legs", "core"], answers, template),
      createWorkoutDay(
        "יום ד' - כתפיים וליבה",
        ["shoulders", "core"],
        answers,
        template
      )
    );
  } else {
    // 5-6 ימים
    days.push(
      createWorkoutDay("יום א' - חזה", ["chest", "core"], answers, template),
      createWorkoutDay("יום ב' - גב", ["back", "core"], answers, template),
      createWorkoutDay("יום ג' - רגליים", ["legs"], answers, template),
      createWorkoutDay(
        "יום ד' - כתפיים",
        ["shoulders", "core"],
        answers,
        template
      ),
      createWorkoutDay("יום ה' - זרועות", ["arms", "core"], answers, template)
    );
  }

  // הוספת קרדיו לתוכניות ירידה במשקל או סיבולת
  if (answers.goal === "weight_loss" || answers.goal === "endurance") {
    days.push(
      createWorkoutDay("יום קרדיו", ["cardio", "core"], answers, template)
    );
  }

  return days;
};

// 🎯 הפונקציה הראשית ליצירת תוכנית
export const generatePersonalizedPlan = (answers: QuizAnswers): Plan => {
  console.log("🎯 יוצר תוכנית מותאמת אישית...", answers);

  // בחירת תבנית לפי מטרה
  const template = TRAINING_TEMPLATES[answers.goal];

  // יצירת ימי אימון
  const workoutDays = createWeeklySchedule(answers, template);

  // בניית שם תוכנית מותאם
  const planName = `${template.name} - ${answers.days} ימים`;

  // יצירת תיאור מותאם
  const equipmentText = answers.whereToTrain.includes("gym")
    ? "חדר כושר"
    : answers.whereToTrain.includes("home_equipment")
    ? "ציוד ביתי"
    : "משקל גוף";

  const experienceText = {
    beginner: "מתחילים",
    intermediate: "בינוניים",
    advanced: "מתקדמים",
  }[answers.experience];

  const description =
    `תוכנית ${template.description.toLowerCase()} מותאמת ל${experienceText} עם ${equipmentText}. ` +
    `${workoutDays.length} ימי אימון בשבוע עם התאמה לפציעות ומגבלות.`;

  const plan: Plan = {
    id: `generated_${Date.now()}`,
    name: planName,
    description: description,
    creator: "Gymovo AI",
    days: workoutDays,
    metadata: {
      goal: answers.goal,
      experience: answers.experience,
      equipment: answers.whereToTrain,
      injuries: answers.injuries,
      generatedAt: new Date().toISOString(),
    },
  };

  console.log("✅ תוכנית נוצרה בהצלחה:", plan);
  return plan;
};

// 📊 פונקציות עזר נוספות
export const validateAnswers = (answers: QuizAnswers): boolean => {
  const requiredFields = ["goal", "whereToTrain", "experience", "days"];
  return requiredFields.every(
    (field) => answers[field as keyof QuizAnswers] !== undefined
  );
};

export const getPlanDifficulty = (answers: QuizAnswers): string => {
  const factors = {
    experience: { beginner: 1, intermediate: 2, advanced: 3 },
    goal: { weight_loss: 2, endurance: 2, hypertrophy: 3, strength: 3 },
    days: { 3: 1, 4: 2, 5: 3 },
  };

  const score =
    factors.experience[answers.experience] +
    factors.goal[answers.goal] +
    factors.days[answers.days as keyof typeof factors.days];

  if (score <= 4) return "קל";
  if (score <= 6) return "בינוני";
  return "מאתגר";
};
