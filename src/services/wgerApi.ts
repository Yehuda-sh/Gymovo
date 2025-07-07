// src/services/wgerApi.ts - תיקון מלא שגיאות TypeScript
import { Exercise } from "../types/exercise";
import { Plan, PlanDay, PlanExercise } from "../types/plan";

const WGER_API_URL = "https://wger.de/api/v2";

// --- Types for wger API Response ---
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
        // ✅ Exercise משתמש ב-category
        category: ex.category.name,
        imageUrl:
          ex.images?.[0]?.image ||
          `https://wger.de/media/exercise-images/8/Abs-roller-1.png`,
      }));
    return exercises;
  } catch (error) {
    console.error("Failed to fetch exercises from wger API:", error);
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
      // ✅ Exercise משתמש ב-category
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

export const fetchPublicPlans = async (): Promise<Plan[]> => {
  try {
    const response = await fetch(
      `${WGER_API_URL}/workout/?language=2&status=2`
    );
    if (!response.ok) throw new Error("Failed to fetch plans");
    const data = await response.json();

    const plans: Plan[] = data.results
      .filter((p: WgerApiPlan) => p.name && p.description)
      .map((p: WgerApiPlan) => ({
        id: `wger-${p.id}`,
        name: p.name,
        description: p.description.replace(
          /<[^>]*>?/gm,
          "תוכנית אימון ציבורית."
        ),
        creator: "wger.de",
        days: [],
      }));
    return plans;
  } catch (error) {
    console.error("Failed to fetch public plans:", error);
    throw error;
  }
};

export const fetchPlanDetails = async (planId: number): Promise<Plan> => {
  try {
    const response = await fetch(
      `${WGER_API_URL}/workout/${planId}/canonical_representation/`
    );
    if (!response.ok)
      throw new Error(`Failed to fetch details for plan ${planId}`);
    const data: WgerApiPlanDetails = await response.json();

    // --- לוגיקת מיפוי מתוקנת ---
    const days: PlanDay[] = data.day_list.map((dayItem, index) => {
      const exercisesMap = new Map<
        number,
        { name: string; sets: WgerApiDetailedSet[] }
      >();

      // 1. קבץ את כל הסטים לפי מזהה התרגיל שלהם
      dayItem.sets.forEach((set) => {
        const exerciseId = set.exercise.id;
        if (!exercisesMap.has(exerciseId)) {
          exercisesMap.set(exerciseId, { name: set.exercise.name, sets: [] });
        }
        exercisesMap.get(exerciseId)!.sets.push(set);
      });

      // 2. המר את המפה למערך התרגילים שלנו
      const exercises: PlanExercise[] = Array.from(exercisesMap.values()).map(
        (e_group) => ({
          id: String(e_group.sets[0].exercise.id),
          name: e_group.name,
          // ✅ PlanExercise משתמש ב-muscleGroup (לא category)
          muscleGroup: "Unknown", // המידע הזה לא קיים ב-API של פרטי תוכנית
          sets: e_group.sets.length,
          reps: e_group.sets[0]?.reps || 10, // ניקח חזרות מהסט הראשון כדוגמה
        })
      );

      return {
        id: String(dayItem.exerciseday.id),
        name: `יום אימון ${index + 1}`,
        exercises: exercises,
      };
    });

    const detailedPlan: Plan = {
      id: `wger-${data.id}`,
      name: data.name,
      description: data.description.replace(/<[^>]*>?/gm, ""),
      creator: "wger.de",
      days: days,
    };

    return detailedPlan;
  } catch (error) {
    console.error(`Failed to fetch plan details for ${planId}:`, error);
    throw error;
  }
};
