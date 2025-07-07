// src/services/wgerApi.ts - 🔧 תיקון מלא לשגיאות API

import { Exercise } from "../types/exercise";
import { Plan, PlanDay, PlanExercise } from "../types/plan";

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
      .slice(0, 10)
      .map((p: any) => {
        const plan: Plan = {
          id: `wger-${p.id}`,
          name: p.name || "תוכנית ללא שם",
          description:
            p.description?.replace(/<[^>]*>?/gm, "") || "תוכנית אימון ציבורית",
          creator: "wger.de",
          days: [],
          ...generatePlanDefaults("wger"),
        };
        return plan;
      });

    const validPlans = plans.filter(isValidPlan);
    console.log(`✅ Successfully processed ${validPlans.length} plans`);
    return validPlans;
  } catch (error) {
    console.error("❌ Failed to fetch public plans:", error);
    // במקום לזרוק שגיאה, החזר מערך ריק
    return [];
  }
};

// תיקון 5: בדיקת קישוריות
export const checkApiConnection = async (): Promise<boolean> => {
  try {
    const response = await fetchWithRetry(`${WGER_API_URL}/language/`, 1);
    return response.ok;
  } catch (error) {
    console.log("🔌 No connection to WGER API");
    return false;
  }
};

// תיקון 6: פונקציה עם fallback לדמו
export const fetchPublicPlansWithFallback = async (): Promise<Plan[]> => {
  const isConnected = await checkApiConnection();

  if (!isConnected) {
    console.log("📱 Using demo plans instead of API");
    try {
      const { demoPlans } = await import("../constants/demoPlans");
      return demoPlans?.slice(0, 3) || [];
    } catch (error) {
      console.log("⚠️ Demo plans not available either");
      return [];
    }
  }

  return fetchPublicPlans();
};

// שאר הפונקציות עם תיקונים דומים
export const fetchAllExercises = async (): Promise<Exercise[]> => {
  try {
    const response = await fetchWithRetry(
      `${WGER_API_URL}/exerciseinfo/?language=2&limit=100`
    );

    const data = await response.json();

    if (!data.results) {
      return [];
    }

    const exercises: Exercise[] = data.results
      .filter((ex: any) => ex.name && ex.description)
      .map((ex: any) => ({
        id: String(ex.id),
        name: ex.name,
        description: ex.description.replace(/<[^>]*>?/gm, ""),
        category: ex.category?.name || "General",
        imageUrl:
          ex.images?.[0]?.image ||
          `https://wger.de/media/exercise-images/8/Abs-roller-1.png`,
      }));

    return exercises;
  } catch (error) {
    console.error("❌ Failed to fetch exercises:", error);
    return [];
  }
};

export const fetchExerciseInfoById = async (
  exerciseId: string
): Promise<Exercise> => {
  try {
    const response = await fetchWithRetry(
      `${WGER_API_URL}/exerciseinfo/${exerciseId}/`
    );
    const ex = await response.json();

    const exercise: Exercise = {
      id: String(ex.id),
      name: ex.name,
      description: ex.description.replace(/<[^>]*>?/gm, ""),
      category: ex.category?.name || "General",
      imageUrl:
        ex.images?.[0]?.image ||
        `https://wger.de/media/exercise-images/8/Abs-roller-1.png`,
    };
    return exercise;
  } catch (error) {
    console.error(`❌ Failed to fetch exercise ${exerciseId}:`, error);
    throw error;
  }
};

export const searchWgerExercises = async (
  query: string
): Promise<Exercise[]> => {
  try {
    const response = await fetchWithRetry(
      `${WGER_API_URL}/exerciseinfo/?search=${encodeURIComponent(
        query
      )}&language=2&limit=20`
    );

    const data = await response.json();
    return data.results
      .filter((ex: any) => ex.name && ex.description)
      .map((ex: any) => ({
        id: String(ex.id),
        name: ex.name,
        description: ex.description.replace(/<[^>]*>?/gm, ""),
        category: ex.category?.name || "General",
        imageUrl:
          ex.images?.[0]?.image ||
          `https://wger.de/media/exercise-images/8/Abs-roller-1.png`,
      }));
  } catch (error) {
    console.error("❌ Failed to search exercises:", error);
    return [];
  }
};

export const getWgerCategories = async () => {
  try {
    const response = await fetchWithRetry(`${WGER_API_URL}/exercisecategory/`);
    const data = await response.json();
    return data.results.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
    }));
  } catch (error) {
    console.error("❌ Failed to fetch categories:", error);
    return [];
  }
};

// Export helper functions
export { generatePlanDefaults, isValidPlan };
