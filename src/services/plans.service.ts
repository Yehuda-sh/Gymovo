// src/services/plans.service.ts

import { Plan } from "../types/plan";
import {
  loadPlans as loadPlansFromStorage,
  savePlan,
  deletePlan,
} from "../data/storage";

class PlansService {
  // Get all plans for a user
  async getPlans(userId: string): Promise<Plan[]> {
    try {
      const plans = await loadPlansFromStorage(userId);
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
  async createPlan(plan: Plan, userId: string): Promise<boolean> {
    try {
      const newPlan: Plan = {
        ...plan,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return await savePlan(newPlan, userId);
    } catch (error) {
      console.error("Error creating plan:", error);
      throw error;
    }
  }

  // Update an existing plan
  async updatePlan(plan: Plan, userId: string): Promise<boolean> {
    try {
      const updatedPlan: Plan = {
        ...plan,
        updatedAt: new Date().toISOString(),
      };
      return await savePlan(updatedPlan, userId);
    } catch (error) {
      console.error("Error updating plan:", error);
      throw error;
    }
  }

  // Delete a plan
  async deletePlan(planId: string, userId: string): Promise<boolean> {
    try {
      return await deletePlan(planId, userId);
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
  async searchPlans(query: string, userId: string): Promise<Plan[]> {
    const plans = await this.getPlans(userId);
    const searchTerm = query.toLowerCase();

    return plans.filter(
      (plan) =>
        plan.name.toLowerCase().includes(searchTerm) ||
        plan.description?.toLowerCase().includes(searchTerm) ||
        plan.tags?.some((tag) => tag.toLowerCase().includes(searchTerm))
    );
  }

  // Get recommended plans based on user preferences
  async getRecommendedPlans(userId: string): Promise<Plan[]> {
    // This is a placeholder - you can implement recommendation logic based on:
    // - User's fitness level
    // - Previous workouts
    // - Goals
    // - Preferences
    const plans = await this.getPlans(userId);

    // For now, return plans with high ratings or marked as recommended
    return plans.filter(
      (plan) =>
        (plan.rating && plan.rating >= 4) || plan.tags?.includes("recommended")
    );
  }

  // Clone a plan
  async clonePlan(
    planId: string,
    userId: string,
    newName?: string
  ): Promise<Plan | null> {
    const originalPlan = await this.getPlanById(planId, userId);
    if (!originalPlan) return null;

    const clonedPlan: Plan = {
      ...originalPlan,
      id: `plan_${Date.now()}`,
      name: newName || `${originalPlan.name} (העתק)`,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isTemplate: false,
      creator: "user",
    };

    const success = await this.createPlan(clonedPlan, userId);
    return success ? clonedPlan : null;
  }
}

// Export singleton instance
export const plansService = new PlansService();

// Export individual functions for backward compatibility
export const getPlans = (userId: string) => plansService.getPlans(userId);
export const getPlanById = (planId: string, userId: string) =>
  plansService.getPlanById(planId, userId);
export const createPlan = (plan: Plan, userId: string) =>
  plansService.createPlan(plan, userId);
export const updatePlan = (plan: Plan, userId: string) =>
  plansService.updatePlan(plan, userId);
export const deletePlanService = (planId: string, userId: string) =>
  plansService.deletePlan(planId, userId);
