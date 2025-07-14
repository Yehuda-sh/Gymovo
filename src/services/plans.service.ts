// src/services/plans.service.ts
// שירות ניהול תוכניות אימון - מתוקן

import { Plan } from "../types/plan";
import {
  getPlansByUserId,
  savePlan as savePlanToStorage,
  deletePlan as deletePlanFromStorage,
} from "../data/storage";

class PlansService {
  // Get all plans for a user
  async getPlans(userId: string): Promise<Plan[]> {
    try {
      const plans = await getPlansByUserId(userId);
      return plans || [];
    } catch (error) {
      console.error("Error loading plans:", error);
      throw error;
    }
  }

  // Get a single plan by ID
  async getPlanById(planId: string, userId: string): Promise<Plan | null> {
    const plans = await this.getPlans(userId);
    return plans.find((plan) => plan.id === planId) || null;
  }

  // Create a new plan
  async createPlan(plan: Plan, userId: string): Promise<Plan> {
    try {
      const newPlan: Plan = {
        ...plan,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return await savePlanToStorage(userId, newPlan);
    } catch (error) {
      console.error("Error creating plan:", error);
      throw error;
    }
  }

  // Update an existing plan
  async updatePlan(plan: Plan, userId: string): Promise<Plan> {
    try {
      const updatedPlan: Plan = {
        ...plan,
        updatedAt: new Date().toISOString(),
      };
      return await savePlanToStorage(userId, updatedPlan);
    } catch (error) {
      console.error("Error updating plan:", error);
      throw error;
    }
  }

  // Delete a plan
  async deletePlan(planId: string, userId: string): Promise<boolean> {
    try {
      return await deletePlanFromStorage(userId, planId);
    } catch (error) {
      console.error("Error deleting plan:", error);
      throw error;
    }
  }

  // Get active plans
  async getActivePlans(userId: string): Promise<Plan[]> {
    const plans = await this.getPlans(userId);
    return plans.filter((plan) => plan.isActive !== false);
  }

  // Get plans by category
  async getPlansByCategory(category: string, userId: string): Promise<Plan[]> {
    const plans = await this.getPlans(userId);
    return plans.filter((plan) => plan.category === category);
  }

  // Get plans by difficulty
  async getPlansByDifficulty(
    difficulty: string,
    userId: string
  ): Promise<Plan[]> {
    const plans = await this.getPlans(userId);
    return plans.filter((plan) => plan.difficulty === difficulty);
  }

  // Search plans
  async searchPlans(userId: string, query: string): Promise<Plan[]> {
    const plans = await this.getPlans(userId);
    const lowerQuery = query.toLowerCase();

    return plans.filter((plan) => {
      return (
        plan.name.toLowerCase().includes(lowerQuery) ||
        plan.description?.toLowerCase().includes(lowerQuery) ||
        plan.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
    });
  }

  // Toggle plan active status
  async togglePlanActive(planId: string, userId: string): Promise<Plan | null> {
    const plan = await this.getPlanById(planId, userId);
    if (!plan) return null;

    const updatedPlan = {
      ...plan,
      isActive: !plan.isActive,
      updatedAt: new Date().toISOString(),
    };

    await this.updatePlan(updatedPlan, userId);
    return updatedPlan;
  }

  // Duplicate a plan
  async duplicatePlan(planId: string, userId: string): Promise<Plan | null> {
    const plan = await this.getPlanById(planId, userId);
    if (!plan) return null;

    const duplicatedPlan: Plan = {
      ...plan,
      id: `plan_${Date.now()}`, // Generate new ID
      name: `${plan.name} (עותק)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return await this.createPlan(duplicatedPlan, userId);
  }

  // Get plan statistics
  async getPlanStatistics(userId: string): Promise<{
    total: number;
    active: number;
    byDifficulty: Record<string, number>;
    byCategory: Record<string, number>;
  }> {
    const plans = await this.getPlans(userId);

    const stats = {
      total: plans.length,
      active: plans.filter((p) => p.isActive !== false).length,
      byDifficulty: {} as Record<string, number>,
      byCategory: {} as Record<string, number>,
    };

    plans.forEach((plan) => {
      // Count by difficulty
      if (plan.difficulty) {
        stats.byDifficulty[plan.difficulty] =
          (stats.byDifficulty[plan.difficulty] || 0) + 1;
      }

      // Count by category
      if (plan.category) {
        stats.byCategory[plan.category] =
          (stats.byCategory[plan.category] || 0) + 1;
      }
    });

    return stats;
  }
}

// יצירת instance יחיד (Singleton)
export const plansService = new PlansService();

// ייצוא ברירת מחדל
export default plansService;
