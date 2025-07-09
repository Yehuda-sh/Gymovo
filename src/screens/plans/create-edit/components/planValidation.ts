// src/screens/plans/create-edit/components/planValidation.ts
// לוגיקת בדיקת נתונים עבור תוכנית אימון

import { Plan } from "../../../../types/plan";

/**
 * Validation functions for plan creation/editing
 */
export class PlanValidation {
  // 🔍 בדיקת שם תוכנית
  static validatePlanName(name: string): string | null {
    if (!name || !name.trim()) {
      return "שם התוכנית הוא שדה חובה";
    }

    if (name.trim().length < 3) {
      return "שם התוכנית חייב להכיל לפחות 3 תווים";
    }

    if (name.trim().length > 50) {
      return "שם התוכנית לא יכול להכיל יותר מ-50 תווים";
    }

    return null;
  }

  // 📝 בדיקת תיאור תוכנית
  static validatePlanDescription(description: string): string | null {
    if (description && description.length > 200) {
      return "תיאור התוכנית לא יכול להכיל יותר מ-200 תווים";
    }

    return null;
  }

  // 📋 בדיקת תוכנית שלמה
  static validatePlan(plan: Plan): string[] {
    const errors: string[] = [];

    // בדיקת שם
    const nameError = this.validatePlanName(plan.name);
    if (nameError) {
      errors.push(nameError);
    }

    // בדיקת תיאור
    const descriptionError = this.validatePlanDescription(
      plan.description || ""
    );
    if (descriptionError) {
      errors.push(descriptionError);
    }

    // בדיקת ימי אימון
    if (!plan.days || plan.days.length === 0) {
      errors.push("חובה להוסיף לפחות יום אימון אחד");
    }

    return errors;
  }

  // ✅ בדיקה אם התוכנית תקינה
  static isPlanValid(plan: Plan): boolean {
    return this.validatePlan(plan).length === 0;
  }
}
