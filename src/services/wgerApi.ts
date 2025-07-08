// src/services/wgerApi.ts - שירות API מלא ומתוקן

import { Exercise } from "../types/exercise";
import { Plan } from "../types/plan";

const WGER_API_URL = "https://wger.de/api/v2";

// תיקון 1: הוספת fetch עם retry ו-timeout
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

// תיקון 2: שיפור generatePlanDefaults
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

// תיקון 3: Type guard משופר
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

// תיקון 4: fetchPublicPlans עם טיפול מלא בשגיאות
export const fetchPublicPlans = async (): Promise<Plan[]> => {
  console.log("🔍 Starting to fetch public plans...");

  try {
    const response = await fetchWithRetry(
      `${WGER_API_URL}/workout/?language=2&status=2&limit=15`
    );

    const data = await response.json();
    console.log(`📦 Received ${data.results?.length || 0} plans from API`);

    if (!data.results || !Array.isArray(data.results)) {
      console.warn("⚠️ Unexpected format from API");
      return [];
    }

    const plans: Plan[] = data.results
      .filter((p: any) => p.name && p.description)
      .map((plan: any) => ({
        id: `wger-plan-${plan.id}`,
        name: plan.name,
        description: plan.description || "תוכנית מומלצת מ-WGER",
        ...generatePlanDefaults("wger"),
        days: [], // יתמלא בהמשך
      }));

    // מיון לפי תאריך יצירה (חדש ראשון)
    plans.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    console.log(`✅ Successfully parsed ${plans.length} plans`);
    return plans;
  } catch (error) {
    console.error("❌ Failed to fetch public plans:", error);
    return [];
  }
};

// תיקון 5: fetchAllExercises משופר
export const fetchAllExercises = async (): Promise<Exercise[]> => {
  console.log("🏋️ Fetching all exercises...");

  try {
    const response = await fetchWithRetry(
      `${WGER_API_URL}/exercise/?language=2&status=2&limit=200`
    );

    const data = await response.json();
    console.log(`📊 Received ${data.results?.length || 0} exercises`);

    if (!data.results || !Array.isArray(data.results)) {
      console.warn("⚠️ Unexpected format from API");
      return [];
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
        instructions: ex.description ? [cleanInstructions(ex.description)] : [],
        difficulty: "intermediate" as const,
      }));

    // הוספת תרגילים נוספים אם צריך
    if (exercises.length < 50) {
      exercises.push(...getFallbackExercises());
    }

    console.log(`✅ Total exercises: ${exercises.length}`);
    return exercises;
  } catch (error) {
    console.error("❌ Failed to fetch exercises:", error);
    return getFallbackExercises();
  }
};

// תיקון 6: fetchExerciseInfoById משופר
export const fetchExerciseInfoById = async (
  exerciseId: string
): Promise<Exercise | null> => {
  console.log(`🔍 Fetching exercise info for ID: ${exerciseId}`);

  try {
    const numericId = exerciseId.replace(/\D/g, "");
    const response = await fetchWithRetry(
      `${WGER_API_URL}/exerciseinfo/${numericId}/?language=2`
    );

    const data = await response.json();

    if (!data || !data.name) {
      console.warn(`⚠️ No data found for exercise ${exerciseId}`);
      return null;
    }

    const exercise: Exercise = {
      id: String(data.id),
      name: data.name,
      description: data.description || "",
      category: mapCategory(data.category?.id),
      equipment: mapEquipment(data.equipment),
      targetMuscleGroups:
        data.muscles?.map((m: number) => getMuscleGroup(m)) || [],
      instructions: data.description
        ? [cleanInstructions(data.description)]
        : [],
      difficulty: "intermediate" as const,
    };

    console.log(`✅ Found exercise: ${exercise.name}`);
    return exercise;
  } catch (error) {
    console.error(`❌ Failed to fetch exercise ${exerciseId}:`, error);
    return null;
  }
};

// פונקציות עזר
const getMuscleGroup = (muscleId: number): string => {
  const muscleMap: Record<number, string> = {
    1: "biceps",
    2: "shoulders",
    3: "triceps",
    4: "chest",
    5: "lats",
    6: "abs",
    7: "calves",
    8: "glutes",
    9: "traps",
    10: "quadriceps",
    11: "hamstrings",
    12: "back",
    13: "delts",
    14: "forearms",
    15: "obliques",
  };
  return muscleMap[muscleId] || "other";
};

const mapCategory = (categoryId: number): string => {
  const categories: Record<number, string> = {
    8: "Arms",
    9: "Legs",
    10: "Abs",
    11: "Chest",
    12: "Back",
    13: "Shoulders",
    14: "Calves",
    15: "Cardio",
  };
  return categories[categoryId] || "Other";
};

const mapEquipment = (equipmentList: any[]): string[] => {
  if (!Array.isArray(equipmentList)) return ["Bodyweight"];

  const equipmentMap: Record<number, string> = {
    1: "Barbell",
    2: "SZ-Bar",
    3: "Dumbbell",
    4: "Gym mat",
    5: "Swiss Ball",
    6: "Pull-up bar",
    7: "None",
    8: "Bench",
    9: "Incline bench",
    10: "Kettlebell",
  };

  return equipmentList
    .map((eq) => equipmentMap[eq.id] || eq.name)
    .filter(Boolean);
};

const cleanInstructions = (text: string): string => {
  if (!text) return "";

  // הסרת תגי HTML
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
};

// Fallback exercises אם ה-API נכשל
const getFallbackExercises = (): Exercise[] => [
  {
    id: "1",
    name: "לחיצת חזה - משקולת",
    description: "תרגיל בסיסי לחיזוק שרירי החזה",
    category: "Chest",
    equipment: ["Dumbbell", "Bench"],
    targetMuscleGroups: ["chest", "triceps", "shoulders"],
    instructions: [
      "שכב על ספסל עם משקולות בידיים. הורד באיטיות עד גובה החזה ולחץ חזרה למעלה.",
    ],
    difficulty: "intermediate",
  },
  {
    id: "2",
    name: "סקוואט",
    description: "תרגיל מרכזי לרגליים וישבן",
    category: "Legs",
    equipment: ["Bodyweight"],
    targetMuscleGroups: ["quadriceps", "hamstrings", "glutes"],
    instructions: [
      "עמוד עם רגליים ברוחב הכתפיים. רד למטה תוך כיפוף הברכיים עד 90 מעלות וחזור למעלה.",
    ],
    difficulty: "beginner",
  },
  {
    id: "3",
    name: "מתח - רחב",
    description: "תרגיל מעולה לחיזוק הגב",
    category: "Back",
    equipment: ["Pull-up bar"],
    targetMuscleGroups: ["lats", "biceps", "back"],
    instructions: [
      "אחוז במוט באחיזה רחבה ומשוך את הגוף למעלה עד שהסנטר מעל המוט.",
    ],
    difficulty: "advanced",
  },
  {
    id: "4",
    name: "לחיצת כתפיים",
    description: "תרגיל לפיתוח כתפיים חזקות",
    category: "Shoulders",
    equipment: ["Dumbbell"],
    targetMuscleGroups: ["shoulders", "triceps"],
    instructions: ["החזק משקולות בגובה הכתפיים ולחץ למעלה עד יישור הידיים."],
    difficulty: "intermediate",
  },
  {
    id: "5",
    name: "כפיפות בטן",
    description: "תרגיל קלאסי לחיזוק שרירי הבטן",
    category: "Abs",
    equipment: ["Bodyweight"],
    targetMuscleGroups: ["abs"],
    instructions: [
      "שכב על הגב עם ברכיים כפופות. הרם את פלג הגוף העליון לכיוון הברכיים.",
    ],
    difficulty: "beginner",
  },
];

// ייצוא נוסף של פונקציות עזר
export {
  generatePlanDefaults,
  isValidPlan,
  mapCategory,
  mapEquipment,
  getMuscleGroup,
};
