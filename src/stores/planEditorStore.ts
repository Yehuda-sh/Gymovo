// src/stores/planEditorStore.ts - גרסה מתוקנת

import { produce } from "immer";
import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { savePlan, deletePlan } from "../data/storage";
import { Plan, PlanDay, PlanExercise } from "../types/plan";
import { useUserStore } from "./userStore";
import { generateId } from "../utils/idGenerator";

// 📊 ממשק מורחב למצב עורך התוכניות
export interface PlanEditorState {
  // 📋 נתוני תוכנית
  plan: Plan | null;
  originalPlan: Plan | null;
  isLoading: boolean;
  isDirty: boolean;
  error: string | null;

  // 🎯 פעולות תוכנית
  createNewPlan: () => void;
  loadPlanForEdit: (plan: Plan) => void;
  resetEditor: () => void;
  updatePlanDetails: (details: Partial<Plan>) => void;

  // 📅 ניהול ימים
  addDay: (day: PlanDay) => void;
  updateDay: (dayId: string, updatedDay: Partial<PlanDay>) => void;
  removeDay: (dayId: string) => void;
  reorderDays: (reorderedDays: PlanDay[]) => void;
  duplicateDay: (dayId: string) => void;

  // 💪 ניהול תרגילים
  addExerciseToDay: (dayId: string, exercise: PlanExercise) => void;
  updateExerciseInDay: (
    dayId: string,
    exerciseId: string,
    updates: Partial<PlanExercise>
  ) => void;
  removeExerciseFromDay: (dayId: string, exerciseId: string) => void;
  reorderExercisesInDay: (
    dayId: string,
    reorderedExercises: PlanExercise[]
  ) => void;

  // 💾 שמירה וטעינה
  savePlan: () => Promise<boolean>;
  deletePlan: () => Promise<boolean>;
  canSave: () => boolean;
  hasUnsavedChanges: () => boolean;

  // 🔧 פעולות עזר
  validatePlan: () => { isValid: boolean; errors: string[] };
  importFromTemplate: (template: Plan) => void;
  exportAsTemplate: () => Plan;

  // 📊 סטטיסטיקות
  getPlanStats: () => PlanStats;
}

interface PlanStats {
  totalDays: number;
  totalExercises: number;
  totalSets: number;
  estimatedDuration: number;
  muscleGroups: string[];
}

// ⚙️ קבועים
const DEFAULT_SETS_PER_EXERCISE = 3;

// 🔧 פונקציות עזר
const createEmptyPlan = (userId?: string): Plan => {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    name: "",
    description: "",
    days: [],
    createdAt: now,
    updatedAt: now,
    userId: userId || "temp-user-id",
    isActive: true,
    rating: 0,
    creator: "user",
    difficulty: "intermediate",
    weeklyGoal: 3,
    tags: ["user-created"],
    targetMuscleGroups: [],
    metadata: {
      version: "1",
      generatedBy: "user", // במקום source
    },
  };
};

const ensurePlanIntegrity = (plan: Partial<Plan>): Plan => {
  const now = new Date().toISOString();
  const userId = useUserStore.getState().user?.id || "temp-user-id";

  return {
    id: plan.id || generateId(),
    name: plan.name || "",
    description: plan.description || "",
    days: plan.days || [],
    creator: plan.creator || "user",
    difficulty: plan.difficulty || "intermediate",
    createdAt: plan.createdAt || now,
    updatedAt: plan.updatedAt || now,
    userId: plan.userId || userId,
    isActive: plan.isActive ?? true,
    rating: plan.rating || 0,
    weeklyGoal: plan.weeklyGoal || 3,
    tags: plan.tags || ["user-created"],
    targetMuscleGroups: plan.targetMuscleGroups || [],
    durationWeeks: plan.durationWeeks,
    workouts: plan.workouts,
    metadata: plan.metadata || { version: "1", generatedBy: "user" },
  };
};

const createEmptyDay = (order: number): PlanDay => {
  return {
    id: generateId(),
    name: `יום ${order + 1}`,
    order,
    exercises: [],
    targetMuscleGroups: [], // שינוי מ-targetMuscles ל-targetMuscleGroups
    notes: "",
    estimatedDuration: 45,
  };
};

// 🏭 יצירת Store עם Zustand
export const usePlanEditorStore = create<PlanEditorState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // 🏁 מצב התחלתי
      plan: null,
      originalPlan: null,
      isLoading: false,
      isDirty: false,
      error: null,

      // 🆕 יצירת תוכנית חדשה
      createNewPlan: () => {
        const userId = useUserStore.getState().user?.id;
        const newPlan = createEmptyPlan(userId);
        set({
          plan: newPlan,
          originalPlan: newPlan,
          isDirty: false,
          error: null,
        });
      },

      // 📥 טעינת תוכנית לעריכה
      loadPlanForEdit: (planToEdit) => {
        try {
          const copiedPlan = JSON.parse(JSON.stringify(planToEdit));
          const validatedPlan = ensurePlanIntegrity(copiedPlan);
          set({
            plan: validatedPlan,
            originalPlan: validatedPlan,
            isDirty: false,
            error: null,
          });
        } catch (error) {
          console.error("Failed to load plan for edit:", error);
          set({
            error: "שגיאה בטעינת התוכנית",
            plan: null,
            originalPlan: null,
          });
        }
      },

      // 🔄 איפוס העורך
      resetEditor: () =>
        set({
          plan: null,
          originalPlan: null,
          isDirty: false,
          isLoading: false,
          error: null,
        }),

      // ✏️ עדכון פרטי תוכנית
      updatePlanDetails: (details) =>
        set(
          produce((state: PlanEditorState) => {
            if (state.plan) {
              Object.assign(state.plan, details);
              state.plan.updatedAt = new Date().toISOString();
              state.isDirty = true;

              // עדכון קבוצות שרירים אם יש ימים
              if (state.plan.days && state.plan.days.length > 0) {
                const muscleGroups = new Set<string>();
                state.plan.days.forEach((day) => {
                  day.targetMuscleGroups?.forEach((muscle: string) =>
                    muscleGroups.add(muscle)
                  );
                });
                state.plan.targetMuscleGroups = Array.from(muscleGroups);
              }
            }
          })
        ),

      // ➕ הוספת יום אימון
      addDay: (day) =>
        set(
          produce((state: PlanEditorState) => {
            if (state.plan && state.plan.days) {
              const newDay = {
                ...day,
                order: state.plan.days.length,
              };
              state.plan.days.push(newDay);
              state.plan.updatedAt = new Date().toISOString();
              state.isDirty = true;
            }
          })
        ),

      // ✏️ עדכון יום אימון
      updateDay: (dayId, updates) =>
        set(
          produce((state: PlanEditorState) => {
            if (state.plan && state.plan.days) {
              const dayIndex = state.plan.days.findIndex((d) => d.id === dayId);
              if (dayIndex !== -1) {
                Object.assign(state.plan.days[dayIndex], updates);
                state.plan.updatedAt = new Date().toISOString();
                state.isDirty = true;
              }
            }
          })
        ),

      // ❌ מחיקת יום אימון
      removeDay: (dayId) =>
        set(
          produce((state: PlanEditorState) => {
            if (state.plan && state.plan.days) {
              state.plan.days = state.plan.days.filter((d) => d.id !== dayId);
              // עדכון סדר הימים
              state.plan.days.forEach((day, index) => {
                day.order = index;
              });
              state.plan.updatedAt = new Date().toISOString();
              state.isDirty = true;
            }
          })
        ),

      // 🔄 שינוי סדר ימים
      reorderDays: (reorderedDays) =>
        set(
          produce((state: PlanEditorState) => {
            if (state.plan) {
              state.plan.days = reorderedDays;
              // עדכון סדר
              state.plan.days.forEach((day, index) => {
                day.order = index;
              });
              state.plan.updatedAt = new Date().toISOString();
              state.isDirty = true;
            }
          })
        ),

      // 📋 שכפול יום
      duplicateDay: (dayId) =>
        set(
          produce((state: PlanEditorState) => {
            if (state.plan && state.plan.days) {
              const dayToDuplicate = state.plan.days.find(
                (d) => d.id === dayId
              );
              if (dayToDuplicate) {
                const duplicatedDay: PlanDay = {
                  ...JSON.parse(JSON.stringify(dayToDuplicate)),
                  id: generateId(),
                  name: `${dayToDuplicate.name} (עותק)`,
                  order: state.plan.days.length,
                };
                state.plan.days.push(duplicatedDay);
                state.plan.updatedAt = new Date().toISOString();
                state.isDirty = true;
              }
            }
          })
        ),

      // ➕ הוספת תרגיל ליום
      addExerciseToDay: (dayId, exercise) =>
        set(
          produce((state: PlanEditorState) => {
            if (state.plan && state.plan.days) {
              const day = state.plan.days.find((d) => d.id === dayId);
              if (day) {
                const newExercise = {
                  ...exercise,
                  order: day.exercises.length,
                };
                day.exercises.push(newExercise);

                // עדכון קבוצות שרירים של היום
                if (exercise.targetMuscles) {
                  const muscles = new Set(day.targetMuscleGroups || []);
                  exercise.targetMuscles.forEach((m: string) => muscles.add(m));
                  day.targetMuscleGroups = Array.from(muscles);
                }

                // עדכון משך זמן משוער
                day.estimatedDuration = (day.estimatedDuration || 0) + 5;

                state.plan.updatedAt = new Date().toISOString();
                state.isDirty = true;
              }
            }
          })
        ),

      // ✏️ עדכון תרגיל ביום
      updateExerciseInDay: (dayId, exerciseId, updates) =>
        set(
          produce((state: PlanEditorState) => {
            if (state.plan && state.plan.days) {
              const day = state.plan.days.find((d) => d.id === dayId);
              if (day) {
                const exerciseIndex = day.exercises.findIndex(
                  (e) => e.id === exerciseId
                );
                if (exerciseIndex !== -1) {
                  Object.assign(day.exercises[exerciseIndex], updates);
                  state.plan.updatedAt = new Date().toISOString();
                  state.isDirty = true;
                }
              }
            }
          })
        ),

      // ❌ מחיקת תרגיל מיום
      removeExerciseFromDay: (dayId, exerciseId) =>
        set(
          produce((state: PlanEditorState) => {
            if (state.plan && state.plan.days) {
              const day = state.plan.days.find((d) => d.id === dayId);
              if (day) {
                day.exercises = day.exercises.filter(
                  (e) => e.id !== exerciseId
                );
                // עדכון סדר
                day.exercises.forEach((ex, index) => {
                  ex.order = index;
                });
                // עדכון משך זמן
                day.estimatedDuration = Math.max(
                  30,
                  (day.estimatedDuration || 45) - 5
                );

                state.plan.updatedAt = new Date().toISOString();
                state.isDirty = true;
              }
            }
          })
        ),

      // 🔄 שינוי סדר תרגילים ביום
      reorderExercisesInDay: (dayId, reorderedExercises) =>
        set(
          produce((state: PlanEditorState) => {
            if (state.plan && state.plan.days) {
              const day = state.plan.days.find((d) => d.id === dayId);
              if (day) {
                day.exercises = reorderedExercises;
                // עדכון סדר
                day.exercises.forEach((ex, index) => {
                  ex.order = index;
                });
                state.plan.updatedAt = new Date().toISOString();
                state.isDirty = true;
              }
            }
          })
        ),

      // 💾 שמירת תוכנית
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

        set({ isLoading: true, error: null });

        try {
          // ולידציה לפני שמירה
          const validation = get().validatePlan();
          if (!validation.isValid) {
            set({
              error: validation.errors.join(", "),
              isLoading: false,
            });
            return false;
          }

          // שמירה
          const validatedPlan = ensurePlanIntegrity({
            ...plan,
            userId,
            updatedAt: new Date().toISOString(),
          });

          await savePlan(userId, validatedPlan);

          set({
            plan: validatedPlan,
            originalPlan: validatedPlan,
            isLoading: false,
            isDirty: false,
            error: null,
          });

          return true;
        } catch (error) {
          console.error("Failed to save plan:", error);
          set({
            isLoading: false,
            error: "שגיאה בשמירת התוכנית",
          });
          return false;
        }
      },

      // 🗑️ מחיקת תוכנית
      deletePlan: async () => {
        const { plan } = get();
        const userId = useUserStore.getState().user?.id;

        if (!plan?.id || !userId) return false;

        set({ isLoading: true, error: null });

        try {
          await deletePlan(userId, plan.id);
          get().resetEditor();
          return true;
        } catch (error) {
          console.error("Failed to delete plan:", error);
          set({
            isLoading: false,
            error: "שגיאה במחיקת התוכנית",
          });
          return false;
        }
      },

      // ✅ בדיקה אם ניתן לשמור
      canSave: () => {
        const { plan, isDirty } = get();
        return !!(
          plan &&
          plan.name &&
          plan.days &&
          plan.days.length > 0 &&
          isDirty
        );
      },

      // ❓ בדיקה אם יש שינויים לא שמורים
      hasUnsavedChanges: () => {
        return get().isDirty;
      },

      // 🔍 ולידציה של התוכנית
      validatePlan: () => {
        const { plan } = get();
        const errors: string[] = [];

        if (!plan) {
          errors.push("אין תוכנית לבדיקה");
          return { isValid: false, errors };
        }

        if (!plan.name || plan.name.trim() === "") {
          errors.push("שם התוכנית חסר");
        }

        if (!plan.days || plan.days.length === 0) {
          errors.push("התוכנית חייבת לכלול לפחות יום אימון אחד");
        }

        if (plan.days) {
          plan.days.forEach((day, index) => {
            if (!day.name || day.name.trim() === "") {
              errors.push(`שם חסר ליום ${index + 1}`);
            }
            if (!day.exercises || day.exercises.length === 0) {
              errors.push(`אין תרגילים ביום ${day.name || index + 1}`);
            }
          });
        }

        return {
          isValid: errors.length === 0,
          errors,
        };
      },

      // 📥 ייבוא מתבנית
      importFromTemplate: (template) => {
        const userId = useUserStore.getState().user?.id;
        const importedPlan = ensurePlanIntegrity({
          ...template,
          id: generateId(),
          userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          name: `${template.name} (מיובא)`,
          isActive: true,
        });

        set({
          plan: importedPlan,
          originalPlan: importedPlan,
          isDirty: true,
          error: null,
        });
      },

      // 📤 ייצוא כתבנית
      exportAsTemplate: () => {
        const { plan } = get();
        if (!plan) throw new Error("No plan to export");

        const template: Plan = {
          ...plan,
          id: generateId(),
          userId: "template",
          isActive: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        return template;
      },

      // 📊 קבלת סטטיסטיקות התוכנית
      getPlanStats: () => {
        const { plan } = get();

        if (!plan) {
          return {
            totalDays: 0,
            totalExercises: 0,
            totalSets: 0,
            estimatedDuration: 0,
            muscleGroups: [],
          };
        }

        const stats: PlanStats = {
          totalDays: plan.days?.length || 0,
          totalExercises: 0,
          totalSets: 0,
          estimatedDuration: 0,
          muscleGroups: [],
        };

        const muscleSet = new Set<string>();

        if (plan.days) {
          plan.days.forEach((day) => {
            stats.totalExercises += day.exercises.length;
            stats.estimatedDuration += day.estimatedDuration || 45;

            day.exercises.forEach((exercise) => {
              stats.totalSets += exercise.sets || DEFAULT_SETS_PER_EXERCISE;
              exercise.targetMuscles?.forEach((muscle: string) =>
                muscleSet.add(muscle)
              );
            });

            day.targetMuscleGroups?.forEach((muscle: string) =>
              muscleSet.add(muscle)
            );
          });
        }

        stats.muscleGroups = Array.from(muscleSet);

        return stats;
      },
    })),
    {
      name: "plan-editor-store",
    }
  )
);

// 🛠️ Hooks נוחים לשימוש
export const useCurrentPlan = () => usePlanEditorStore((state) => state.plan);
export const useIsDirty = () => usePlanEditorStore((state) => state.isDirty);
export const usePlanStats = () =>
  usePlanEditorStore((state) => state.getPlanStats());

// 📤 ייצוא פונקציות עזר
export { createEmptyPlan, ensurePlanIntegrity, createEmptyDay };
