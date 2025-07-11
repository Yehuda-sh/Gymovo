// src/screens/plans/create-edit/hooks/usePlanData.ts
// Hook לניהול נתוני תוכנית אימון וטיפול באירועים

import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

import { usePlans } from "../../../../hooks/usePlans";
import { usePlanEditorStore } from "../../../../stores/planEditorStore";
import { Plan, PlanDay } from "../../../../types/plan";
import { PlanValidation } from "../components/planValidation";

/**
 * Hook to manage plan data, validation, and operations
 */
export const usePlanData = (planId?: string) => {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const {
    plan,
    createNewPlan, // הוספנו את זה!
    updatePlanDetails,
    savePlan,
    isLoading,
    addDay,
    loadPlanForEdit,
    resetEditor,
    reorderDays,
  } = usePlanEditorStore();

  const { plans: allUserPlans, refetch: refetchPlans } = usePlans();

  // 🔄 אפקט לטעינת תוכנית קיימת או יצירת חדשה
  useFocusEffect(
    useCallback(() => {
      if (planId && allUserPlans) {
        // טעינת תוכנית קיימת
        const planToEdit = allUserPlans.find((p: Plan) => p.id === planId);
        if (planToEdit) {
          loadPlanForEdit(planToEdit);
        }
      } else if (!planId) {
        // יצירת תוכנית חדשה - זה מה שהיה חסר!
        createNewPlan();
      }

      // ניקוי בעת יציאה מהמסך
      return () => {
        resetEditor();
      };
    }, [planId, allUserPlans, loadPlanForEdit, createNewPlan, resetEditor])
  );

  // 💾 שמירת תוכנית
  const handleSave = async () => {
    if (!plan) {
      Alert.alert("שגיאה", "אין תוכנית לשמירה");
      return false;
    }

    // בדיקת תקינות
    const errors = PlanValidation.validatePlan(plan);
    setValidationErrors(errors);

    if (errors.length > 0) {
      Alert.alert("שגיאות בטופס", errors.join("\n"));
      return false;
    }

    const success = await savePlan();
    if (success) {
      refetchPlans();
      return true;
    } else {
      Alert.alert("שגיאה", "שמירת התוכנית נכשלה.");
      return false;
    }
  };

  // ➕ הוספת יום אימון חדש
  const handleAddNewDay = useCallback(() => {
    if (!plan) return;

    const newDayId = `day_${Date.now()}`;
    const currentDaysCount = plan.days?.length || 0;
    const newDay: PlanDay = {
      id: newDayId,
      name: `יום אימון ${currentDaysCount + 1}`,
      exercises: [],
    };

    addDay(newDay);
    return newDayId;
  }, [plan, addDay]);

  // 📝 עדכון פרטי תוכנית
  const handleUpdateDetails = useCallback(
    (details: Partial<Plan>) => {
      updatePlanDetails(details);

      // ניקוי שגיאות validation בעת עדכון
      if (validationErrors.length > 0) {
        setValidationErrors([]);
      }
    },
    [updatePlanDetails, validationErrors.length]
  );

  // 🔄 סידור מחדש של ימי אימון
  const handleReorderDays = useCallback(
    (data: PlanDay[]) => {
      reorderDays(data);
    },
    [reorderDays]
  );

  return {
    plan,
    isLoading,
    validationErrors,
    handleSave,
    handleAddNewDay,
    handleUpdateDetails,
    handleReorderDays,
  };
};
