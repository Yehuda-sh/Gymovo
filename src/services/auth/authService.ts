// src/services/auth/authService.ts
import { supabase } from "../../lib/supabase";
import { Alert } from "react-native";

export const authService = {
  // הרשמה
  async signUp(
    email: string,
    password: string,
    userData: { name: string; age: number }
  ) {
    try {
      // 1. יצירת משתמש
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // 2. יצירת פרופיל
      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          email: data.user.email,
          name: userData.name,
          age: userData.age,
        });

        if (profileError) throw profileError;
      }

      return { success: true, user: data.user };
    } catch (error: any) {
      console.error("SignUp error:", error);
      return {
        success: false,
        error: error.message || "שגיאה בהרשמה",
      };
    }
  },

  // התחברות
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { success: true, user: data.user };
    } catch (error: any) {
      console.error("SignIn error:", error);
      return {
        success: false,
        error: error.message || "שגיאה בהתחברות",
      };
    }
  },

  // התנתקות
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error("SignOut error:", error);
      return { success: false, error: error.message };
    }
  },

  // קבלת משתמש נוכחי
  async getCurrentUser() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  },

  // האזנה לשינויי auth
  onAuthStateChange(callback: (user: any) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user || null);
    });
  },

  // התחברות עם Google
  async signInWithGoogle() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
};
