// src/services/cleanDuplicatePlans.ts - כלי לניקוי תוכניות כפולות

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Plan } from "../types/plan";
import { StorageKeys } from "../data/storage";

// ✅ ניתוח תוכניות כפולות
export interface DuplicateAnalysis {
  totalPlans: number;
  uniquePlans: number;
  duplicateGroups: {
    key: string;
    count: number;
    plans: Plan[];
  }[];
  recommendedToKeep: Plan[];
  recommendedToDelete: Plan[];
}

// ✅ יצירת מפתח ייחודי לתוכנית
function createPlanKey(plan: Plan): string {
  const parts = [
    plan.name,
    plan.weeklyGoal?.toString() || "0",
    plan.metadata?.goal || "",
    plan.metadata?.experience || "",
    plan.days?.length?.toString() || "0",
  ];

  return parts.join("|").toLowerCase();
}

// ✅ ניתוח תוכניות כפולות
export async function analyzeDuplicatePlans(
  userId: string
): Promise<DuplicateAnalysis> {
  try {
    // טעינת כל התוכניות
    const plansKey = StorageKeys.plans(userId);
    const plansData = await AsyncStorage.getItem(plansKey);

    if (!plansData) {
      return {
        totalPlans: 0,
        uniquePlans: 0,
        duplicateGroups: [],
        recommendedToKeep: [],
        recommendedToDelete: [],
      };
    }

    const plans: Plan[] = JSON.parse(plansData);

    // קיבוץ לפי מפתח ייחודי
    const planGroups = new Map<string, Plan[]>();

    plans.forEach((plan) => {
      const key = createPlanKey(plan);
      const group = planGroups.get(key) || [];
      group.push(plan);
      planGroups.set(key, group);
    });

    // ניתוח קבוצות
    const duplicateGroups: DuplicateAnalysis["duplicateGroups"] = [];
    const recommendedToKeep: Plan[] = [];
    const recommendedToDelete: Plan[] = [];

    planGroups.forEach((group, key) => {
      if (group.length > 1) {
        // יש כפילויות
        duplicateGroups.push({
          key,
          count: group.length,
          plans: group,
        });

        // שמירת התוכנית החדשה ביותר או עם הכי הרבה נתונים
        const bestPlan = selectBestPlan(group);
        recommendedToKeep.push(bestPlan);

        // המלצה למחיקת השאר
        group.forEach((plan) => {
          if (plan.id !== bestPlan.id) {
            recommendedToDelete.push(plan);
          }
        });
      } else {
        // תוכנית ייחודית
        recommendedToKeep.push(group[0]);
      }
    });

    return {
      totalPlans: plans.length,
      uniquePlans: planGroups.size,
      duplicateGroups: duplicateGroups.sort((a, b) => b.count - a.count),
      recommendedToKeep,
      recommendedToDelete,
    };
  } catch (error) {
    console.error("Error analyzing duplicate plans:", error);
    throw error;
  }
}

// ✅ בחירת התוכנית הטובה ביותר מקבוצה
function selectBestPlan(plans: Plan[]): Plan {
  return plans.reduce((best, current) => {
    // עדיפות לתוכנית עם יותר נתונים
    const bestScore = calculatePlanScore(best);
    const currentScore = calculatePlanScore(current);

    if (currentScore > bestScore) return current;
    if (currentScore < bestScore) return best;

    // אם השוויון זהה - החדשה יותר
    const bestDate = new Date(best.createdAt).getTime();
    const currentDate = new Date(current.createdAt).getTime();

    return currentDate > bestDate ? current : best;
  });
}

// ✅ חישוב ציון איכות לתוכנית
function calculatePlanScore(plan: Plan): number {
  let score = 0;

  // נתונים בסיסיים
  if (plan.name) score += 10;
  if (plan.description) score += 10;
  if (plan.days && plan.days.length > 0) score += 20;
  if (plan.metadata) score += 10;

  // נתונים מתקדמים
  if (plan.tags && plan.tags.length > 0) score += 5;
  if (plan.equipment && plan.equipment.length > 0) score += 5;
  if (plan.weeklySchedule) score += 5;
  if (plan.rating) score += 5;

  // בונוס לתוכניות עם היסטוריה
  if (plan.lastUsedAt) score += 15;
  if (plan.usageCount && plan.usageCount > 0) score += 10;

  return score;
}

// ✅ ניקוי תוכניות כפולות
export async function cleanDuplicatePlans(
  userId: string,
  dryRun: boolean = true
): Promise<{
  success: boolean;
  deletedCount: number;
  keptCount: number;
  freedSpace: number;
  errors?: string[];
}> {
  try {
    // ניתוח ראשוני
    const analysis = await analyzeDuplicatePlans(userId);

    if (analysis.recommendedToDelete.length === 0) {
      return {
        success: true,
        deletedCount: 0,
        keptCount: analysis.totalPlans,
        freedSpace: 0,
      };
    }

    if (dryRun) {
      // רק הדמיה - חישוב מקום שיתפנה
      const freedSpace = JSON.stringify(analysis.recommendedToDelete).length;

      console.log("🔍 ניתוח תוכניות כפולות:");
      console.log(`- סה"כ תוכניות: ${analysis.totalPlans}`);
      console.log(`- תוכניות ייחודיות: ${analysis.uniquePlans}`);
      console.log(`- תוכניות למחיקה: ${analysis.recommendedToDelete.length}`);
      console.log(`- מקום שיתפנה: ${(freedSpace / 1024).toFixed(2)} KB`);

      return {
        success: true,
        deletedCount: analysis.recommendedToDelete.length,
        keptCount: analysis.recommendedToKeep.length,
        freedSpace,
      };
    }

    // ביצוע מחיקה
    const plansKey = StorageKeys.plans(userId);
    const beforeSize = (await AsyncStorage.getItem(plansKey))?.length || 0;

    // שמירת התוכניות שנשארות
    await AsyncStorage.setItem(
      plansKey,
      JSON.stringify(analysis.recommendedToKeep)
    );

    const afterSize = (await AsyncStorage.getItem(plansKey))?.length || 0;
    const freedSpace = beforeSize - afterSize;

    console.log("✅ ניקוי הושלם:");
    console.log(`- נמחקו: ${analysis.recommendedToDelete.length} תוכניות`);
    console.log(`- נשארו: ${analysis.recommendedToKeep.length} תוכניות`);
    console.log(`- התפנו: ${(freedSpace / 1024).toFixed(2)} KB`);

    return {
      success: true,
      deletedCount: analysis.recommendedToDelete.length,
      keptCount: analysis.recommendedToKeep.length,
      freedSpace,
    };
  } catch (error) {
    console.error("Error cleaning duplicate plans:", error);
    return {
      success: false,
      deletedCount: 0,
      keptCount: 0,
      freedSpace: 0,
      errors: [error instanceof Error ? error.message : "Unknown error"],
    };
  }
}

// ✅ הצגת דוח מפורט
export async function generateDuplicateReport(userId: string): Promise<string> {
  const analysis = await analyzeDuplicatePlans(userId);

  let report = "📊 דוח תוכניות כפולות\n";
  report += "=".repeat(30) + "\n\n";

  report += `📈 סיכום כללי:\n`;
  report += `- סה"כ תוכניות: ${analysis.totalPlans}\n`;
  report += `- תוכניות ייחודיות: ${analysis.uniquePlans}\n`;
  report += `- תוכניות כפולות: ${analysis.recommendedToDelete.length}\n\n`;

  if (analysis.duplicateGroups.length > 0) {
    report += `🔍 קבוצות כפולות:\n`;
    analysis.duplicateGroups.forEach((group, index) => {
      report += `\n${index + 1}. "${group.plans[0].name}"\n`;
      report += `   - מספר עותקים: ${group.count}\n`;
      report += `   - תאריכי יצירה: ${group.plans
        .map((p) => new Date(p.createdAt).toLocaleDateString("he-IL"))
        .join(", ")}\n`;
    });
  }

  report += `\n💡 המלצה:\n`;
  report += `למחוק ${analysis.recommendedToDelete.length} תוכניות כפולות\n`;
  report += `ולשמור ${analysis.recommendedToKeep.length} תוכניות ייחודיות\n`;

  return report;
}

// ✅ מחיקת כל התוכניות (לצורך בדיקה)
export async function deleteAllPlans(userId: string): Promise<boolean> {
  try {
    const plansKey = StorageKeys.plans(userId);
    await AsyncStorage.removeItem(plansKey);
    console.log("🗑️ כל התוכניות נמחקו");
    return true;
  } catch (error) {
    console.error("Error deleting all plans:", error);
    return false;
  }
}

// ✅ יצוא פונקציות לשימוש ב-CLI או דיבאג
export const PlanCleaner = {
  analyze: analyzeDuplicatePlans,
  clean: cleanDuplicatePlans,
  report: generateDuplicateReport,
  deleteAll: deleteAllPlans,
};

// דוגמה לשימוש:
// import { PlanCleaner } from './cleanDuplicatePlans';
//
// // ניתוח בלבד
// const analysis = await PlanCleaner.analyze('user123');
//
// // הצגת דוח
// const report = await PlanCleaner.report('user123');
// console.log(report);
//
// // ניקוי (הדמיה)
// const dryRunResult = await PlanCleaner.clean('user123', true);
//
// // ניקוי אמיתי
// const cleanResult = await PlanCleaner.clean('user123', false);
