// src/services/wgerApi.ts - שירות API מעודכן

import { Exercise } from "../types/exercise";
import { Plan } from "../types/plan";

const WGER_API_URL = "https://wger.de/api/v2";

// הוספת fetch עם retry ו-timeout
const fetchWithRetry = async (url: string, retries = 3): Promise<Response> => {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return response;
      }

      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      console.log(`🔄 Attempt ${i + 1}/${retries} failed:`, error);

      if (i === retries - 1) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }

  throw new Error("Max retries exceeded");
};

// שיפור generatePlanDefaults
const generatePlanDefaults = (source: "wger" | "local" = "wger") => ({
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  userId: source === "wger" ? "public" : "temp-user-id",
  isActive: true,
  rating: 0,
  difficulty: "intermediate" as const,
  tags: source === "wger" ? ["public", "wger"] : ["user-generated"],
  weeklyGoal: 3,
  targetMuscleGroups: ["Full Body"] as string[],
  durationWeeks: 4,
});

// Type guard משופר
const isValidPlan = (plan: any): plan is Plan => {
  return (
    plan &&
    typeof plan.id === "string" &&
    typeof plan.name === "string" &&
    typeof plan.createdAt === "string" &&
    typeof plan.updatedAt === "string" &&
    typeof plan.userId === "string"
  );
};

// תוכניות בסיס - 3 בלבד, זמינות לכל המשתמשים
const getBasePlans = (): Plan[] => {
  return [
    {
      ...generatePlanDefaults("local"),
      id: "base-plan-fullbody",
      name: "Full Body למתחילים",
      description: "תוכנית מאוזנת 3x בשבוע להתחלה מושלמת",
      creator: "Gymovo Team",
      difficulty: "beginner",
      days: [],
      targetMuscleGroups: ["Full Body"],
      durationWeeks: 8,
      tags: ["base-plan", "beginner", "full-body"],
    },
    {
      ...generatePlanDefaults("local"),
      id: "base-plan-ppl",
      name: "Push/Pull/Legs",
      description: "תוכנית PPL קלאסית לבניית שריר",
      creator: "Gymovo Team",
      difficulty: "intermediate",
      days: [],
      targetMuscleGroups: ["Full Body"],
      durationWeeks: 12,
      tags: ["base-plan", "intermediate", "ppl"],
    },
    {
      ...generatePlanDefaults("local"),
      id: "base-plan-strength",
      name: "StrongLifts 5x5",
      description: "תוכנית כוח עם תרגילים מורכבים",
      creator: "Gymovo Team",
      difficulty: "intermediate",
      days: [],
      targetMuscleGroups: ["Full Body"],
      durationWeeks: 16,
      tags: ["base-plan", "strength", "5x5"],
    },
  ];
};

// fetchPublicPlans - מחזיר תוכניות בסיס
export const fetchPublicPlans = async (): Promise<Plan[]> => {
  console.log("🔍 Loading base workout plans");
  return getBasePlans();

  /* קוד מקורי - מוסתר כרגע בגלל בעיות API
  try {
    const response = await fetchWithRetry(
      `${WGER_API_URL}/workout/?language=2&status=2&limit=15`
    );

    const data = await response.json();
    console.log(`📦 Received ${data.results?.length || 0} plans from API`);

    if (!data.results || !Array.isArray(data.results)) {
      console.warn("⚠️ Unexpected format from API");
      return getBasePlans();
    }

    const plans: Plan[] = data.results
      .filter((p: any) => p.name && p.description)
      .map((plan: any) => ({
        id: `wger-plan-${plan.id}`,
        name: plan.name,
        description: plan.description || "תוכנית מומלצת מ-WGER",
        ...generatePlanDefaults("wger"),
        days: [],
      }));

    plans.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    console.log(`✅ Successfully parsed ${plans.length} plans`);
    return plans;
  } catch (error) {
    console.error("❌ Failed to fetch public plans:", error);
    return getBasePlans();
  }
  */
};

// פונקציה חדשה: fetchPublicPlansWithFallback
export const fetchPublicPlansWithFallback = async (): Promise<Plan[]> => {
  // מחזיר ישירות תוכניות בסיס
  return getBasePlans();
};

// Helper functions for mapping
const mapCategory = (categoryId: number | undefined): string => {
  const categoryMap: Record<number, string> = {
    8: "זרועות",
    9: "רגליים",
    10: "ליבה",
    11: "חזה",
    12: "גב",
    13: "כתפיים",
    14: "ישבן",
    15: "כללי",
  };
  return categoryMap[categoryId || 15] || "כללי";
};

const mapEquipment = (equipmentIds: number[] | undefined): string[] => {
  if (!equipmentIds || equipmentIds.length === 0) return ["Bodyweight"];

  const equipmentMap: Record<number, string> = {
    1: "Barbell",
    2: "SZ-Bar",
    3: "Dumbbell",
    4: "Gym mat",
    5: "Swiss Ball",
    6: "Pull-up bar",
    7: "Bodyweight",
    8: "Bench",
    9: "Incline bench",
    10: "Kettlebell",
  };

  return equipmentIds.map((id) => equipmentMap[id]).filter(Boolean) as string[];
};

const getMuscleGroup = (muscleId: number): string => {
  const muscleMap: Record<number, string> = {
    1: "זרועות",
    2: "כתפיים",
    3: "זרועות",
    4: "חזה",
    5: "גב",
    6: "ליבה",
    7: "רגליים",
    8: "רגליים",
    9: "גב",
    10: "רגליים",
    11: "רגליים",
    12: "גב",
    13: "כתפיים",
    14: "זרועות",
    15: "ליבה",
  };
  return muscleMap[muscleId] || "כללי";
};

const cleanInstructions = (description: string): string => {
  return description
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .trim();
};

// תרגילי fallback בעברית
const getFallbackExercises = (): Exercise[] => [
  {
    id: "fallback-1",
    name: "לחיצת חזה",
    description: "תרגיל בסיסי לחיזוק שרירי החזה",
    category: "חזה",
    equipment: ["Barbell", "Bench"],
    targetMuscleGroups: ["חזה", "זרועות", "כתפיים"],
    instructions: [
      "שכב על הספסל כשהמוט מעל החזה.",
      "הורד את המוט לאט לכיוון החזה.",
      "דחוף חזרה למצב ההתחלה.",
    ],
    difficulty: "beginner",
  },
  {
    id: "fallback-2",
    name: "סקוואט",
    description: "תרגיל מצוין לחיזוק הרגליים",
    category: "רגליים",
    equipment: ["Barbell"],
    targetMuscleGroups: ["רגליים", "ישבן"],
    instructions: [
      "הנח את המוט על הכתפיים.",
      "רד למטה תוך כיפוף הברכיים עד 90 מעלות וחזור למעלה.",
    ],
    difficulty: "beginner",
  },
  {
    id: "fallback-3",
    name: "מתח רחב",
    description: "תרגיל מעולה לחיזוק הגב",
    category: "גב",
    equipment: ["Pull-up bar"],
    targetMuscleGroups: ["גב"],
    instructions: [
      "אחוז במוט באחיזה רחבה ומשוך את הגוף למעלה עד שהסנטר מעל המוט.",
    ],
    difficulty: "advanced",
  },
  {
    id: "fallback-4",
    name: "לחיצת כתפיים",
    description: "תרגיל לפיתוח כתפיים חזקות",
    category: "כתפיים",
    equipment: ["Dumbbell"],
    targetMuscleGroups: ["כתפיים"],
    instructions: ["החזק משקולות בגובה הכתפיים ולחץ למעלה עד יישור הידיים."],
    difficulty: "intermediate",
  },
  {
    id: "fallback-5",
    name: "כפיפות בטן",
    description: "תרגיל קלאסי לחיזוק שרירי הבטן",
    category: "ליבה",
    equipment: ["Bodyweight"],
    targetMuscleGroups: ["ליבה"],
    instructions: [
      "שכב על הגב עם ברכיים כפופות. הרם את פלג הגוף העליון לכיוון הברכיים.",
    ],
    difficulty: "beginner",
  },
];

// fetchAllExercises - משתמש רק בתרגילי fallback
export const fetchAllExercises = async (): Promise<Exercise[]> => {
  console.log("🏋️ Using fallback exercises (API temporarily disabled)");
  return getFallbackExercises();

  /* קוד מקורי - להפעלה כשה-API יחזור לעבוד
  try {
    const response = await fetchWithRetry(
      `${WGER_API_URL}/exercise/?language=2&status=2&limit=200`
    );

    const data = await response.json();
    console.log(`📊 Received ${data.results?.length || 0} exercises`);

    if (!data.results || !Array.isArray(data.results)) {
      console.warn("⚠️ Unexpected format from API");
      return getFallbackExercises();
    }

    const exercises: Exercise[] = data.results
      .filter((ex: any) => ex.name && ex.category)
      .map((ex: any) => ({
        id: String(ex.id),
        name: ex.name,
        description: ex.description || "",
        category: mapCategory(ex.category),
        equipment: mapEquipment(ex.equipment),
        targetMuscleGroups:
          ex.muscles?.map((m: number) => getMuscleGroup(m)) || [],
        instructions: ex.description
          ? [cleanInstructions(ex.description)]
          : [],
        difficulty: "intermediate" as const,
      }));

    if (exercises.length < 50) {
      exercises.push(...getFallbackExercises());
    }

    console.log(`✅ Total exercises: ${exercises.length}`);
    return exercises;
  } catch (error) {
    console.error("❌ Failed to fetch exercises:", error);
    return getFallbackExercises();
  }
  */
};

// fetchExerciseInfoById - מחזיר null כי אין API
export const fetchExerciseInfoById = async (
  exerciseId: string
): Promise<Exercise | null> => {
  console.log(`🔍 Exercise API disabled, returning null for ID: ${exerciseId}`);

  // מנסה למצוא בתרגילי fallback
  const fallbackExercises = getFallbackExercises();
  const found = fallbackExercises.find((ex) => ex.id === exerciseId);

  return found || null;
};

// ייצוא נוסף של פונקציות עזר
export {
  generatePlanDefaults,
  isValidPlan,
  mapCategory,
  mapEquipment,
  getMuscleGroup,
};
