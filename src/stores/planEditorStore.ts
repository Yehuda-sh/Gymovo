// src/stores/planEditorStore.ts

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

// יצירת ה-store עם Zustand ו-Immer
export const usePlanEditorStore = create<PlanEditorState>((set, get) => ({
  plan: null,
  isLoading: false,
  isDirty: false,

  // מאתחל תוכנית חדשה וריקה במצב העריכה
  createNewPlan: () => {
    set({
      plan: {
        id: `plan_${Date.now()}`,
        name: "",
        description: "",
        days: [],
      },
      isDirty: false,
    });
  },

  // טוען תוכנית קיימת לעורך (מבצע העתקה עמוקה)
  loadPlanForEdit: (planToEdit) => {
    set({ plan: JSON.parse(JSON.stringify(planToEdit)), isDirty: false });
  },

  // מאפס את מצב העורך (למשל, ביציאה מהמסך)
  resetEditor: () => set({ plan: null, isDirty: false }),

  // מעדכן את שם או תיאור התוכנית
  updatePlanDetails: (details) =>
    set(
      produce((state: PlanEditorState) => {
        if (state.plan) {
          if (details.name !== undefined) state.plan.name = details.name;
          if (details.description !== undefined)
            state.plan.description = details.description;
          state.isDirty = true;
        }
      })
    ),

  // מוסיף יום אימון חדש לתוכנית
  addDay: (day) =>
    set(
      produce((state: PlanEditorState) => {
        if (state.plan) {
          state.plan.days.push(day);
          state.isDirty = true;
        }
      })
    ),

  // מעדכן יום אימון ספציפי
  updateDay: (dayId, updatedDay) =>
    set(
      produce((state: PlanEditorState) => {
        if (state.plan) {
          const dayIndex = state.plan.days.findIndex((d) => d.id === dayId);
          if (dayIndex !== -1) {
            state.plan.days[dayIndex] = updatedDay;
            state.isDirty = true;
          }
        }
      })
    ),

  // מוחק יום אימון מהתוכנית
  removeDay: (dayId) =>
    set(
      produce((state: PlanEditorState) => {
        if (state.plan) {
          state.plan.days = state.plan.days.filter((d) => d.id !== dayId);
          state.isDirty = true;
        }
      })
    ),

  // מעדכן את סדר ימי האימון לאחר גרירה
  reorderDays: (reorderedDays) =>
    set(
      produce((state: PlanEditorState) => {
        if (state.plan) {
          state.plan.days = reorderedDays;
          state.isDirty = true;
        }
      })
    ),

  // שומר את התוכנית (חדשה או קיימת) לאחסון המקומי
  savePlan: async () => {
    const { plan } = get();
    const userId = useUserStore.getState().user?.id;
    if (!plan || !userId) return false;

    set({ isLoading: true });
    try {
      await savePlan(userId, plan);
      set({ isLoading: false, isDirty: false });
      return true;
    } catch (error) {
      console.error("Failed to save plan:", error);
      set({ isLoading: false });
      return false;
    }
  },
}));
