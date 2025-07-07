// src/stores/planEditorStore.ts - ✅ All TypeScript errors fixed

import { produce } from "immer";
import { create } from "zustand";
import { savePlan } from "../data/storage";
import { Plan, PlanDay } from "../types/plan";
import { useUserStore } from "./userStore";

// הממשק שמגדיר את כל המידע והפעולות בעורך התוכניות
export interface PlanEditorState {
  plan: Plan | null;
  isLoading: boolean;
  isDirty: boolean;

  createNewPlan: () => void;
  loadPlanForEdit: (plan: Plan) => void;
  resetEditor: () => void;
  updatePlanDetails: (details: { name?: string; description?: string }) => void;
  addDay: (day: PlanDay) => void;
  updateDay: (dayId: string, updatedDay: PlanDay) => void;
  removeDay: (dayId: string) => void;
  reorderDays: (reorderedDays: PlanDay[]) => void;
  savePlan: () => Promise<boolean>;
}

// ✅ Helper function to create a complete Plan object
const createEmptyPlan = (userId?: string): Plan => {
  const now = new Date().toISOString();
  return {
    id: `plan_${Date.now()}`,
    name: "",
    description: "",
    days: [],
    // ✅ Required fields that were missing
    createdAt: now,
    updatedAt: now,
    userId: userId || "temp-user-id",
    isActive: true,
    rating: 0,
    creator: "user",
    difficulty: "intermediate",
    weeklyGoal: 3,
    tags: ["user-created"],
  };
};

// ✅ Helper function to ensure Plan has all required fields
const ensurePlanIntegrity = (plan: Partial<Plan>): Plan => {
  const now = new Date().toISOString();
  const userId = useUserStore.getState().user?.id || "temp-user-id";

  return {
    id: plan.id || `plan_${Date.now()}`,
    name: plan.name || "",
    description: plan.description || "",
    days: plan.days || [],
    creator: plan.creator || "user",
    difficulty: plan.difficulty || "intermediate",
    // Required fields with defaults
    createdAt: plan.createdAt || now,
    updatedAt: plan.updatedAt || now,
    userId: plan.userId || userId,
    isActive: plan.isActive ?? true,
    rating: plan.rating || 0,
    weeklyGoal: plan.weeklyGoal || 3,
    tags: plan.tags || ["user-created"],
    // Optional fields
    targetMuscleGroups: plan.targetMuscleGroups,
    durationWeeks: plan.durationWeeks,
    workouts: plan.workouts,
    metadata: plan.metadata,
  };
};

// יצירת ה-store עם Zustand ו-Immer
export const usePlanEditorStore = create<PlanEditorState>((set, get) => ({
  plan: null,
  isLoading: false,
  isDirty: false,

  // ✅ Fixed: מאתחל תוכנית חדשה וריקה עם כל השדות הנדרשים
  createNewPlan: () => {
    const userId = useUserStore.getState().user?.id;
    set({
      plan: createEmptyPlan(userId),
      isDirty: false,
    });
  },

  // ✅ Fixed: טוען תוכנית קיימת לעורך עם וולידציה
  loadPlanForEdit: (planToEdit) => {
    try {
      const copiedPlan = JSON.parse(JSON.stringify(planToEdit));
      const validatedPlan = ensurePlanIntegrity(copiedPlan);
      set({ plan: validatedPlan, isDirty: false });
    } catch (error) {
      console.error("Failed to load plan for edit:", error);
      // Fallback to empty plan
      const userId = useUserStore.getState().user?.id;
      set({ plan: createEmptyPlan(userId), isDirty: false });
    }
  },

  // מאפס את מצב העורך (למשל, ביציאה מהמסך)
  resetEditor: () => set({ plan: null, isDirty: false, isLoading: false }),

  // ✅ Fixed: מעדכן את שם או תיאור התוכנית עם updatedAt
  updatePlanDetails: (details) =>
    set(
      produce((state: PlanEditorState) => {
        if (state.plan) {
          if (details.name !== undefined) state.plan.name = details.name;
          if (details.description !== undefined)
            state.plan.description = details.description;

          // עדכון updatedAt כשמשנים פרטים
          state.plan.updatedAt = new Date().toISOString();
          state.isDirty = true;
        }
      })
    ),

  // מוסיף יום אימון חדש לתוכנית
  addDay: (day) =>
    set(
      produce((state: PlanEditorState) => {
        if (state.plan && state.plan.days) {
          state.plan.days.push(day);
          state.plan.updatedAt = new Date().toISOString(); // ✅ עדכון זמן
          state.isDirty = true;
        }
      })
    ),

  // מעדכן יום אימון ספציפי
  updateDay: (dayId, updatedDay) =>
    set(
      produce((state: PlanEditorState) => {
        if (state.plan && state.plan.days) {
          const dayIndex = state.plan.days.findIndex((d) => d.id === dayId);
          if (dayIndex !== -1) {
            state.plan.days[dayIndex] = updatedDay;
            state.plan.updatedAt = new Date().toISOString(); // ✅ עדכון זמן
            state.isDirty = true;
          }
        }
      })
    ),

  // מוחק יום אימון מהתוכנית
  removeDay: (dayId) =>
    set(
      produce((state: PlanEditorState) => {
        if (state.plan && state.plan.days) {
          state.plan.days = state.plan.days.filter((d) => d.id !== dayId);
          state.plan.updatedAt = new Date().toISOString(); // ✅ עדכון זמן
          state.isDirty = true;
        }
      })
    ),

  // מעדכן את סדר ימי האימון לאחר גרירה
  reorderDays: (reorderedDays) =>
    set(
      produce((state: PlanEditorState) => {
        if (state.plan && state.plan.days) {
          state.plan.days = reorderedDays;
          state.plan.updatedAt = new Date().toISOString(); // ✅ עדכון זמן
          state.isDirty = true;
        }
      })
    ),

  // ✅ Fixed: שומר את התוכנית עם וולידציה מלאה
  savePlan: async () => {
    const { plan } = get();
    const userId = useUserStore.getState().user?.id;

    if (!plan) {
      console.error("No plan to save");
      return false;
    }

    if (!userId) {
      console.error("No user ID available");
      return false;
    }

    set({ isLoading: true });

    try {
      // וודא שהתוכנית תקינה לפני השמירה
      const validatedPlan = ensurePlanIntegrity({
        ...plan,
        userId,
        updatedAt: new Date().toISOString(),
      });

      await savePlan(userId, validatedPlan);

      // עדכן את המצב עם התוכנית השמורה
      set({
        plan: validatedPlan,
        isLoading: false,
        isDirty: false,
      });

      return true;
    } catch (error) {
      console.error("Failed to save plan:", error);
      set({ isLoading: false });
      return false;
    }
  },
}));

// ✅ Export helper functions for external use
export { createEmptyPlan, ensurePlanIntegrity };
