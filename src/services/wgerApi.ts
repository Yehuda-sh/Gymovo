// src/services/wgerApi.ts - ✅ All TypeScript and cSpell errors fixed

import { Exercise } from "../types/exercise";
import { Plan, PlanDay, PlanExercise } from "../types/plan";

// ✅ WGER API configuration - cSpell friendly
const WGER_API_URL = "https://wger.de/api/v2";

// --- Types for WGER API Response ---
interface WgerApiPlan {
  id: number;
  name: string;
  description: string;
}

interface WgerApiExerciseInfo {
  id: number;
  name: string;
  description: string;
  category: { name: string };
  images?: { image: string }[];
}

// טיפוסים מעודכנים ונכונים עבור פרטי תוכנית מלאים
interface WgerApiDetailedSet {
  reps: number;
  weight: string;
  exercise: {
    id: number;
    name: string;
  };
}

interface WgerApiDetailedDay {
  exerciseday: { id: number };
  sets: WgerApiDetailedSet[];
}

interface WgerApiPlanDetails {
  id: number;
  name: string;
  description: string;
  day_list: WgerApiDetailedDay[];
}

// ✅ Helper function to generate default Plan fields
const generatePlanDefaults = (source: "wger" | "local" = "wger") => ({
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  userId: source === "wger" ? "public" : "temp-user-id",
  isActive: true,
  rating: 0,
  difficulty: "intermediate" as const,
  tags: source === "wger" ? ["public", "wger"] : ["user-generated"],
});

// ✅ Type guard for Plan validation
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

// ✅ Function to validate and enrich Plan objects
const validateAndEnrichPlan = (plan: Partial<Plan>): Plan => {
  const enrichedPlan: Plan = {
    ...plan,
    id: plan.id || `plan-${Date.now()}`,
    name: plan.name || "תוכנית ללא שם",
    description: plan.description || "תוכנית אימון",
    creator: plan.creator || "unknown",
    days: plan.days || [],
    ...generatePlanDefaults(plan.creator?.includes("wger") ? "wger" : "local"),
  };

  return enrichedPlan;
};

// --- API Functions ---

export const fetchAllExercises = async (): Promise<Exercise[]> => {
  try {
    const response = await fetch(
      `${WGER_API_URL}/exerciseinfo/?language=2&limit=500`
    );
    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    const exercises: Exercise[] = data.results
      .filter((ex: WgerApiExerciseInfo) => ex.name && ex.description)
      .map((ex: WgerApiExerciseInfo) => ({
        id: String(ex.id),
        name: ex.name,
        description: ex.description.replace(/<[^>]*>?/gm, ""),
        // ✅ Exercise uses 'category' field
        category: ex.category.name,
        imageUrl:
          ex.images?.[0]?.image ||
          `https://wger.de/media/exercise-images/8/Abs-roller-1.png`,
      }));
    return exercises;
  } catch (error) {
    console.error("Failed to fetch exercises from WGER API:", error);
    throw error;
  }
};

export const fetchExerciseInfoById = async (
  exerciseId: string
): Promise<Exercise> => {
  try {
    const response = await fetch(`${WGER_API_URL}/exerciseinfo/${exerciseId}/`);
    if (!response.ok)
      throw new Error(`Exercise with id ${exerciseId} not found`);
    const ex: WgerApiExerciseInfo = await response.json();

    const exercise: Exercise = {
      id: String(ex.id),
      name: ex.name,
      description: ex.description.replace(/<[^>]*>?/gm, ""),
      // ✅ Exercise uses 'category' field
      category: ex.category?.name || "General",
      imageUrl:
        ex.images?.[0]?.image ||
        `https://wger.de/media/exercise-images/8/Abs-roller-1.png`,
    };
    return exercise;
  } catch (error) {
    console.error(`Failed to fetch exercise ${exerciseId}:`, error);
    throw error;
  }
};

// ✅ Fixed: Added all required Plan fields
export const fetchPublicPlans = async (): Promise<Plan[]> => {
  try {
    const response = await fetch(
      `${WGER_API_URL}/workout/?language=2&status=2`
    );
    if (!response.ok) throw new Error("Failed to fetch plans");
    const data = await response.json();

    const plans: Plan[] = data.results
      .filter((p: WgerApiPlan) => p.name && p.description)
      .map((p: WgerApiPlan) => {
        const plan: Plan = {
          id: `wger-${p.id}`,
          name: p.name,
          description: p.description.replace(
            /<[^>]*>?/gm,
            "תוכנית אימון ציבורית מ-WGER."
          ),
          creator: "wger.de",
          days: [],
          weeklyGoal: 3, // Default value
          targetMuscleGroups: [],
          // ✅ Required fields that were missing
          ...generatePlanDefaults("wger"),
        };
        return plan;
      });

    // Validate all plans before returning
    return plans.filter(isValidPlan);
  } catch (error) {
    console.error("Failed to fetch public plans:", error);
    throw error;
  }
};

// ✅ Fixed: Added all required Plan fields
export const fetchPlanDetails = async (planId: number): Promise<Plan> => {
  try {
    const response = await fetch(
      `${WGER_API_URL}/workout/${planId}/canonical_representation/`
    );
    if (!response.ok)
      throw new Error(`Failed to fetch details for plan ${planId}`);
    const data: WgerApiPlanDetails = await response.json();

    // --- Improved mapping logic ---
    const days: PlanDay[] = data.day_list.map((dayItem, index) => {
      const exercisesMap = new Map<
        number,
        { name: string; sets: WgerApiDetailedSet[] }
      >();

      // 1. Group all sets by their exercise ID
      dayItem.sets.forEach((set) => {
        const exerciseId = set.exercise.id;
        if (!exercisesMap.has(exerciseId)) {
          exercisesMap.set(exerciseId, { name: set.exercise.name, sets: [] });
        }
        exercisesMap.get(exerciseId)!.sets.push(set);
      });

      // 2. Convert the map to our exercise array
      const exercises: PlanExercise[] = Array.from(exercisesMap.values()).map(
        (exerciseGroup) => ({
          id: String(exerciseGroup.sets[0].exercise.id),
          name: exerciseGroup.name,
          // ✅ PlanExercise uses 'muscleGroup' (not category)
          muscleGroup: "Unknown", // This info is not available in plan details API
          sets: exerciseGroup.sets.length,
          reps: exerciseGroup.sets[0]?.reps || 10, // Take reps from first set as example
          weight: parseFloat(exerciseGroup.sets[0]?.weight) || 0,
          restTime: 90, // Default rest time
        })
      );

      return {
        id: String(dayItem.exerciseday.id),
        name: `יום אימון ${index + 1}`,
        exercises: exercises,
        estimatedDuration: exercises.length * 5 + 15, // Rough estimate
        targetMuscleGroups: [], // Not available in API
        difficulty: "intermediate",
      };
    });

    const detailedPlan: Plan = {
      id: `wger-${data.id}`,
      name: data.name,
      description: data.description.replace(/<[^>]*>?/gm, ""),
      creator: "wger.de",
      days: days,
      weeklyGoal: days.length,
      targetMuscleGroups: [
        ...new Set(days.flatMap((d) => d.targetMuscleGroups || [])),
      ],
      durationWeeks: Math.ceil(days.length / 3), // Estimate based on days
      // ✅ Required fields that were missing
      ...generatePlanDefaults("wger"),
      metadata: {
        generatedAt: new Date().toISOString(),
        version: "1.0",
        tags: ["wger", "public"],
      },
    };

    // Validate before returning
    if (!isValidPlan(detailedPlan)) {
      throw new Error("Invalid plan data received from WGER API");
    }

    return detailedPlan;
  } catch (error) {
    console.error(`Failed to fetch plan details for ${planId}:`, error);
    throw error;
  }
};

// ✅ Additional utility functions for WGER integration
export const searchWgerExercises = async (
  query: string
): Promise<Exercise[]> => {
  try {
    const response = await fetch(
      `${WGER_API_URL}/exerciseinfo/?search=${encodeURIComponent(
        query
      )}&language=2&limit=20`
    );
    if (!response.ok) throw new Error("Search request failed");

    const data = await response.json();
    return data.results
      .filter((ex: WgerApiExerciseInfo) => ex.name && ex.description)
      .map((ex: WgerApiExerciseInfo) => ({
        id: String(ex.id),
        name: ex.name,
        description: ex.description.replace(/<[^>]*>?/gm, ""),
        category: ex.category.name,
        imageUrl:
          ex.images?.[0]?.image ||
          `https://wger.de/media/exercise-images/8/Abs-roller-1.png`,
      }));
  } catch (error) {
    console.error("Failed to search WGER exercises:", error);
    return [];
  }
};

export const getWgerCategories = async () => {
  try {
    const response = await fetch(`${WGER_API_URL}/exercisecategory/`);
    if (!response.ok) throw new Error("Failed to fetch categories");

    const data = await response.json();
    return data.results.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
    }));
  } catch (error) {
    console.error("Failed to fetch WGER categories:", error);
    return [];
  }
};

// ✅ Export helper functions for external use
export { generatePlanDefaults, validateAndEnrichPlan, isValidPlan };
