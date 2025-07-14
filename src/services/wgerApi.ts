// src/services/wgerApi.ts - שירות API משופר עם תמיכה מלאה

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Exercise } from "../types/exercise";
import { Plan } from "../types/plan";

// קבועים
const WGER_API_URL = "https://wger.de/api/v2";
const API_LANGUAGE = 2; // Hebrew
const API_STATUS = 2; // Accepted
const CACHE_DURATION = 1000 * 60 * 30; // 30 דקות
const TOKEN_KEY = "@gymovo_wger_token";

// Endpoints
const ENDPOINTS = {
  // Public endpoints (no auth required)
  exercises: "/exercise/",
  exerciseInfo: "/exerciseinfo/",
  exerciseCategory: "/exercisecategory/",
  equipment: "/equipment/",
  muscle: "/muscle/",

  // Auth endpoints
  token: "/token/",
  tokenRefresh: "/token/refresh/",
  tokenVerify: "/token/verify/",

  // User endpoints (auth required)
  routines: "/routine/",
  templates: "/templates/",
  publicTemplates: "/public-templates/",
  workoutSessions: "/workoutsession/",
  workoutLog: "/workoutlog/",

  // New endpoints from v2.4
  slots: "/slot/",
  slotEntry: "/slot-entry/",
  weightConfig: "/weight-config/",
  repetitionsConfig: "/repetitions-config/",
  setsConfig: "/sets-config/",
  restConfig: "/rest-config/",
} as const;

// Types
interface WgerApiError extends Error {
  statusCode?: number;
  endpoint?: string;
  isNetworkError?: boolean;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface AuthTokens {
  access: string;
  refresh: string;
  expiresAt?: number;
}

interface FetchOptions extends RequestInit {
  authenticated?: boolean;
  retry?: number;
  useCache?: boolean; // שינוי שם כדי למנוע התנגשות עם RequestInit.cache
}

// Cache management
const apiCache = new Map<string, { data: any; timestamp: number }>();

class WgerApiService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private isApiAvailable = true;

  constructor() {
    this.loadTokens();
  }

  // Token management
  private async loadTokens() {
    try {
      const tokens = await AsyncStorage.getItem(TOKEN_KEY);
      if (tokens) {
        const parsed: AuthTokens = JSON.parse(tokens);
        this.accessToken = parsed.access;
        this.refreshToken = parsed.refresh;
      }
    } catch (error) {
      console.error("Failed to load tokens:", error);
    }
  }

  private async saveTokens(tokens: AuthTokens) {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
      this.accessToken = tokens.access;
      this.refreshToken = tokens.refresh;
    } catch (error) {
      console.error("Failed to save tokens:", error);
    }
  }

  // Authentication
  async authenticate(username: string, password: string): Promise<boolean> {
    try {
      const response = await this.fetchApi<{ access: string; refresh: string }>(
        ENDPOINTS.token,
        {
          method: "POST",
          body: JSON.stringify({ username, password }),
          authenticated: false,
        }
      );

      if (response.access && response.refresh) {
        await this.saveTokens({
          access: response.access,
          refresh: response.refresh,
          expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Authentication failed:", error);
      return false;
    }
  }

  async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) return false;

    try {
      const response = await this.fetchApi<{ access: string }>(
        ENDPOINTS.tokenRefresh,
        {
          method: "POST",
          body: JSON.stringify({ refresh: this.refreshToken }),
          authenticated: false,
        }
      );

      if (response.access) {
        this.accessToken = response.access;
        return true;
      }
      return false;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    }
  }

  // Core fetch method with retry and caching
  private async fetchApi<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const {
      authenticated = false,
      retry = 3,
      useCache = true,
      ...fetchOptions
    } = options;

    // Check cache first
    if (useCache && fetchOptions.method === "GET") {
      const cached = this.getCached(endpoint);
      if (cached) return cached;
    }

    // Prepare headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...((fetchOptions.headers as Record<string, string>) || {}),
    };

    if (authenticated && this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    // Fetch with retry
    for (let attempt = 0; attempt < retry; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(`${WGER_API_URL}${endpoint}`, {
          ...fetchOptions,
          headers,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          // Handle 401 - try refresh token
          if (response.status === 401 && authenticated && attempt === 0) {
            const refreshed = await this.refreshAccessToken();
            if (refreshed) continue; // Retry with new token
          }

          throw this.createError(
            `HTTP ${response.status}: ${response.statusText}`,
            response.status,
            endpoint
          );
        }

        const data = await response.json();

        // Cache successful GET requests
        if (useCache && fetchOptions.method === "GET") {
          this.setCache(endpoint, data);
        }

        return data;
      } catch (error) {
        console.log(`🔄 Attempt ${attempt + 1}/${retry} failed:`, error);

        if (attempt === retry - 1) {
          // Last attempt failed
          this.isApiAvailable = false;
          throw error;
        }

        // Wait before retry
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * (attempt + 1))
        );
      }
    }

    throw this.createError("Max retries exceeded", undefined, endpoint);
  }

  // Cache helpers
  private getCached(key: string): any | null {
    const cached = apiCache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log(`📦 Using cached data for ${key}`);
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: any) {
    apiCache.set(key, { data, timestamp: Date.now() });
  }

  private createError(
    message: string,
    statusCode?: number,
    endpoint?: string
  ): WgerApiError {
    const error = new Error(message) as WgerApiError;
    error.statusCode = statusCode;
    error.endpoint = endpoint;
    error.isNetworkError = !statusCode;
    return error;
  }

  // Public API methods

  /**
   * בדיקת חיבור ל-API
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.fetchApi("/", { useCache: false });
      this.isApiAvailable = true;
      return true;
    } catch {
      this.isApiAvailable = false;
      return false;
    }
  }

  /**
   * שליפת כל התרגילים
   */
  async fetchAllExercises(): Promise<Exercise[]> {
    try {
      const response = await this.fetchApi<PaginatedResponse<any>>(
        `${ENDPOINTS.exercises}?language=${API_LANGUAGE}&status=${API_STATUS}&limit=200`
      );

      if (!response.results || response.results.length === 0) {
        return this.getFallbackExercises();
      }

      const exercises: Exercise[] = response.results
        .filter((ex: any) => ex.name && ex.category)
        .map((ex: any) => this.mapExercise(ex));

      console.log(`✅ Fetched ${exercises.length} exercises from API`);
      return exercises;
    } catch (error) {
      console.error("❌ Failed to fetch exercises:", error);
      return this.getFallbackExercises();
    }
  }

  /**
   * שליפת פרטי תרגיל
   */
  async fetchExerciseById(exerciseId: string): Promise<Exercise | null> {
    try {
      const response = await this.fetchApi<any>(
        `${ENDPOINTS.exercises}${exerciseId}/`
      );

      return this.mapExercise(response);
    } catch (error) {
      console.error(`❌ Failed to fetch exercise ${exerciseId}:`, error);

      // Try fallback
      const fallback = this.getFallbackExercises().find(
        (ex) => ex.id === exerciseId
      );
      return fallback || null;
    }
  }

  /**
   * שליפת תוכניות ציבוריות
   */
  async fetchPublicPlans(): Promise<Plan[]> {
    try {
      // First try new endpoints
      const response = await this.fetchApi<PaginatedResponse<any>>(
        `${ENDPOINTS.publicTemplates}?limit=20`
      );

      if (response.results && response.results.length > 0) {
        return response.results.map((plan: any) => this.mapPlan(plan));
      }

      // Fallback to base plans
      return this.getBasePlans();
    } catch (error) {
      console.error("❌ Failed to fetch public plans:", error);
      return this.getBasePlans();
    }
  }

  /**
   * חיפוש תרגילים
   */
  async searchExercises(query: string): Promise<Exercise[]> {
    try {
      const response = await this.fetchApi<PaginatedResponse<any>>(
        `${ENDPOINTS.exercises}search/?term=${encodeURIComponent(query)}`
      );

      return response.results.map((ex: any) => this.mapExercise(ex));
    } catch (error) {
      console.error("❌ Failed to search exercises:", error);

      // Fallback to local search
      const fallback = this.getFallbackExercises();
      return fallback.filter((ex) =>
        ex.name.toLowerCase().includes(query.toLowerCase())
      );
    }
  }

  /**
   * שליפת קטגוריות
   */
  async fetchCategories(): Promise<{ id: number; name: string }[]> {
    try {
      const response = await this.fetchApi<PaginatedResponse<any>>(
        `${ENDPOINTS.exerciseCategory}?language=${API_LANGUAGE}`
      );

      return response.results;
    } catch (error) {
      console.error("❌ Failed to fetch categories:", error);
      return this.getFallbackCategories();
    }
  }

  /**
   * שליפת ציוד
   */
  async fetchEquipment(): Promise<{ id: number; name: string }[]> {
    try {
      const response = await this.fetchApi<PaginatedResponse<any>>(
        `${ENDPOINTS.equipment}?language=${API_LANGUAGE}`
      );

      return response.results;
    } catch (error) {
      console.error("❌ Failed to fetch equipment:", error);
      return this.getFallbackEquipment();
    }
  }

  // Mapping functions
  private mapExercise(data: any): Exercise {
    return {
      id: String(data.id),
      name: data.name,
      description: this.cleanDescription(data.description || ""),
      category: this.mapCategory(data.category),
      equipment: this.mapEquipment(data.equipment),
      targetMuscleGroups: this.mapMuscles(data.muscles || []),
      instructions: this.extractInstructions(data.description),
      difficulty: this.mapDifficulty(data.difficulty),
      imageUrl: data.images?.[0]?.image || undefined,
      videoUrl: data.videos?.[0]?.video || undefined,
    };
  }

  private mapPlan(data: any): Plan {
    return {
      id: `wger-${data.id}`,
      name: data.name,
      description: data.description || "",
      createdAt: data.created || new Date().toISOString(),
      updatedAt: data.last_updated || new Date().toISOString(),
      userId: "public",
      isActive: false,
      rating: data.rating || 0,
      difficulty: this.mapDifficulty(data.difficulty),
      tags: ["public", "wger"],
      weeklyGoal: data.weekly_goal || 3,
      targetMuscleGroups: [],
      durationWeeks: data.duration || 4,
      days: [], // Would need separate API call
    };
  }

  // Helper functions
  private cleanDescription(description: string): string {
    // Remove HTML tags
    return description.replace(/<[^>]*>/g, "").trim();
  }

  private extractInstructions(description: string): string[] {
    const cleaned = this.cleanDescription(description);
    return cleaned
      .split(/\n|\./)
      .filter((line) => line.trim().length > 0)
      .map((line) => line.trim());
  }

  private mapCategory(categoryId: number): string {
    const categoryMap: Record<number, string> = {
      8: "זרועות",
      9: "רגליים",
      10: "ליבה",
      11: "חזה",
      12: "גב",
      13: "כתפיים",
      14: "אירובי",
      15: "גמישות",
    };
    return categoryMap[categoryId] || "אחר";
  }

  private mapEquipment(equipmentIds: number[]): string[] {
    const equipmentMap: Record<number, string> = {
      1: "משקולת",
      2: "מוט",
      3: "מכונה",
      4: "רצועות",
      5: "משקל גוף",
      6: "כדור כוח",
      7: "קטלבל",
      8: "גומיות",
    };
    return equipmentIds.map((id) => equipmentMap[id] || "אחר");
  }

  private mapMuscles(muscleIds: number[]): string[] {
    const muscleMap: Record<number, string> = {
      1: "שריר הזרוע הדו-ראשי",
      2: "דלתא קדמית",
      3: "דלתא צידית",
      4: "חזה",
      5: "שריר הזרוע התלת-ראשי",
      6: "בטן",
      7: "גב תחתון",
      8: "גב עליון",
      9: "ירך קדמית",
      10: "ירך אחורית",
      11: "ישבן",
      12: "סובך",
    };
    return muscleIds.map((id) => muscleMap[id] || "אחר");
  }

  private mapDifficulty(
    value?: number | string
  ): "beginner" | "intermediate" | "advanced" {
    if (typeof value === "number") {
      if (value <= 3) return "beginner";
      if (value <= 7) return "intermediate";
      return "advanced";
    }
    return "intermediate";
  }

  // Fallback data
  private getFallbackExercises(): Exercise[] {
    return [
      {
        id: "fallback-1",
        name: "לחיצת חזה עם משקולות",
        description: "תרגיל בסיסי לחיזוק שרירי החזה",
        category: "חזה",
        equipment: ["משקולת"],
        targetMuscleGroups: ["חזה", "שריר הזרוע התלת-ראשי"],
        instructions: [
          "שכב על ספסל שטוח עם משקולת בכל יד",
          "הורד את המשקולות לצדי החזה",
          "דחוף למעלה תוך יישור הידיים",
        ],
        difficulty: "beginner",
      },
      {
        id: "fallback-2",
        name: "סקוואט",
        description: "תרגיל מורכב לחיזוק הרגליים והישבנים",
        category: "רגליים",
        equipment: ["משקל גוף"],
        targetMuscleGroups: ["ירך קדמית", "ישבן"],
        instructions: [
          "עמוד עם רגליים ברוחב הכתפיים",
          "רד למטה כאילו אתה יושב על כיסא",
          "חזור למעלה תוך דחיפה מהעקבים",
        ],
        difficulty: "beginner",
      },
      {
        id: "fallback-3",
        name: "חתירה בכבל",
        description: "תרגיל לחיזוק שרירי הגב",
        category: "גב",
        equipment: ["מכונה"],
        targetMuscleGroups: ["גב עליון", "גב תחתון", "שריר הזרוע הדו-ראשי"],
        instructions: [
          "שב מול מכונת הכבלים",
          "משוך את הידית לכיוון הבטן",
          "החזר לאט תוך שליטה",
        ],
        difficulty: "intermediate",
      },
    ];
  }

  private getBasePlans(): Plan[] {
    const defaultPlanData = {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: "public",
      isActive: false,
      rating: 0,
      weeklyGoal: 3,
      durationWeeks: 8,
      days: [],
    };

    return [
      {
        ...defaultPlanData,
        id: "base-plan-fullbody",
        name: "Full Body למתחילים",
        description: "תוכנית מאוזנת 3x בשבוע להתחלה מושלמת",
        difficulty: "beginner",
        tags: ["base-plan", "beginner", "full-body"],
        targetMuscleGroups: ["Full Body"],
      },
      {
        ...defaultPlanData,
        id: "base-plan-ppl",
        name: "Push/Pull/Legs",
        description: "תוכנית PPL קלאסית לבניית שריר",
        difficulty: "intermediate",
        tags: ["base-plan", "intermediate", "ppl"],
        targetMuscleGroups: ["Full Body"],
        durationWeeks: 12,
      },
      {
        ...defaultPlanData,
        id: "base-plan-upper-lower",
        name: "Upper/Lower Split",
        description: "תוכנית מפוצלת לגוף עליון ותחתון",
        difficulty: "intermediate",
        tags: ["base-plan", "intermediate", "split"],
        targetMuscleGroups: ["Full Body"],
        weeklyGoal: 4,
      },
    ];
  }

  private getFallbackCategories() {
    return [
      { id: 8, name: "זרועות" },
      { id: 9, name: "רגליים" },
      { id: 10, name: "ליבה" },
      { id: 11, name: "חזה" },
      { id: 12, name: "גב" },
      { id: 13, name: "כתפיים" },
    ];
  }

  private getFallbackEquipment() {
    return [
      { id: 1, name: "משקולת" },
      { id: 2, name: "מוט" },
      { id: 3, name: "מכונה" },
      { id: 5, name: "משקל גוף" },
    ];
  }
}

// Singleton instance
const wgerApiService = new WgerApiService();

// Export simplified API
export const wgerApi = {
  // Connection test
  testConnection: () => wgerApiService.testConnection(),

  // Authentication
  authenticate: (username: string, password: string) =>
    wgerApiService.authenticate(username, password),

  // Exercises
  fetchAllExercises: () => wgerApiService.fetchAllExercises(),
  fetchExerciseById: (id: string) => wgerApiService.fetchExerciseById(id),
  searchExercises: (query: string) => wgerApiService.searchExercises(query),

  // Plans
  fetchPublicPlans: () => wgerApiService.fetchPublicPlans(),

  // Reference data
  fetchCategories: () => wgerApiService.fetchCategories(),
  fetchEquipment: () => wgerApiService.fetchEquipment(),
};

// Legacy exports for backward compatibility
export const fetchAllExercises = wgerApi.fetchAllExercises;
export const fetchExerciseInfoById = wgerApi.fetchExerciseById;
export const fetchPublicPlans = wgerApi.fetchPublicPlans;
export const fetchPublicPlansWithFallback = wgerApi.fetchPublicPlans;

// Export types and helpers
export {
  WgerApiService,
  WgerApiError,
  type PaginatedResponse,
  type AuthTokens,
};
