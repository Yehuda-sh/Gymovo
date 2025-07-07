// src/services/userPreferences.ts - שירות ניהול העדפות

import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserPreferences, defaultPreferences } from "../types/settings";

const PREFERENCES_KEY = "user_preferences";

export class UserPreferencesService {
  private static instance: UserPreferencesService;
  private preferences: UserPreferences = defaultPreferences;
  private listeners: ((prefs: UserPreferences) => void)[] = [];

  static getInstance(): UserPreferencesService {
    if (!UserPreferencesService.instance) {
      UserPreferencesService.instance = new UserPreferencesService();
    }
    return UserPreferencesService.instance;
  }

  // 📖 טעינת העדפות
  async load(): Promise<UserPreferences> {
    try {
      const stored = await AsyncStorage.getItem(PREFERENCES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // מיזוג עם ברירות מחדל (למקרה של שדות חדשים)
        this.preferences = this.mergeWithDefaults(parsed);
      } else {
        this.preferences = defaultPreferences;
      }

      if (__DEV__) {
        console.log("👤 User preferences loaded:", this.preferences);
      }

      return this.preferences;
    } catch (error) {
      console.error("Failed to load user preferences:", error);
      this.preferences = defaultPreferences;
      return this.preferences;
    }
  }

  // 💾 שמירת העדפות
  async save(newPreferences: Partial<UserPreferences>): Promise<void> {
    try {
      this.preferences = { ...this.preferences, ...newPreferences };
      await AsyncStorage.setItem(
        PREFERENCES_KEY,
        JSON.stringify(this.preferences)
      );

      // עדכון כל המאזינים
      this.listeners.forEach((listener) => listener(this.preferences));

      if (__DEV__) {
        console.log("💾 User preferences saved:", newPreferences);
      }
    } catch (error) {
      console.error("Failed to save user preferences:", error);
      throw error;
    }
  }

  // 📄 קבלת העדפות נוכחיות
  get(): UserPreferences {
    return this.preferences;
  }

  // 🎯 עדכון שדה ספציפי
  async updateField<K extends keyof UserPreferences>(
    section: K,
    field: keyof UserPreferences[K],
    value: any
  ): Promise<void> {
    const updatedSection = {
      ...(this.preferences[section] as object),
      [field]: value,
    };

    await this.save({ [section]: updatedSection } as Partial<UserPreferences>);
  }

  // 👂 הוספת מאזין לשינויים
  addListener(listener: (prefs: UserPreferences) => void): () => void {
    this.listeners.push(listener);

    // החזרת פונקציה לביטול המאזין
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // 🔄 איפוס להגדרות ברירת מחדל
  async reset(): Promise<void> {
    await AsyncStorage.removeItem(PREFERENCES_KEY);
    this.preferences = defaultPreferences;
    this.listeners.forEach((listener) => listener(this.preferences));
  }

  // 🛠️ מיזוג עם ברירות מחדל
  private mergeWithDefaults(stored: any): UserPreferences {
    const merged = { ...defaultPreferences };

    // מיזוג עמוק של כל הסקשנים
    Object.keys(defaultPreferences).forEach((section) => {
      if (stored[section] && typeof stored[section] === "object") {
        merged[section as keyof UserPreferences] = {
          ...(defaultPreferences[section as keyof UserPreferences] as object),
          ...stored[section],
        } as any;
      }
    });

    return merged;
  }
}
