// src/stores/userStore.ts - גרסה מלאה עם תמיכה בנתוני דמו

import AsyncStorage from "@react-native-async-storage/async-storage";
import { create, StateCreator } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { User } from "../types/user";

// סוגי הסטטוס האפשריים של המשתמש
type AuthStatus = "loading" | "unauthenticated" | "authenticated" | "guest";

// טיפוס הנתונים הנדרשים להרשמה
export interface RegisterData {
  email: string;
  password: string;
  age: number;
  name?: string;
}

// הממשק שמגדיר את כל המידע והפעולות ב-store
export interface UserState {
  user: User | null;
  token: string | null;
  status: AuthStatus;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    data: RegisterData
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  becomeGuest: () => void;
  setStatus: (status: AuthStatus) => void;
  loginAsDemoUser: (demoUser: User) => Promise<void>;
}

// פונקציית הבסיס ליצירת ה-store
const storeCreator: StateCreator<UserState> = (set, get) => ({
  user: null,
  token: null,
  status: "loading",

  setStatus: (status: AuthStatus) => set({ status }),

  // 🏋️ פונקציה מעודכנת לטעינת נתוני דמו
  loginAsDemoUser: async (demoUser: User) => {
    const demoToken = `${demoUser.email}_token_${Date.now()}`;

    // טען את ההיסטוריה של המשתמש
    try {
      console.log(`🎭 Loading demo data for ${demoUser.name}...`);

      // טען את פונקציות הדמו באופן דינמי
      const { getDemoWorkoutHistory, getDemoPlanForUser } = await import(
        "../constants/demoUsers"
      );
      const workoutHistory = getDemoWorkoutHistory(demoUser.id);
      const userPlan = getDemoPlanForUser(demoUser.id);

      // שמור את נתוני הדמו ב-AsyncStorage כאילו הם נתונים אמיתיים
      if (workoutHistory.length > 0) {
        const { saveWorkoutToHistory } = await import("../data/storage");

        // שמור כל אימון בנפרד (רק 15 אימונים אחרונים כדי לא להעמיס)
        const recentWorkouts = workoutHistory.slice(0, 15);
        for (const workout of recentWorkouts) {
          try {
            await saveWorkoutToHistory(demoUser.id, workout);
          } catch (error) {
            console.warn("Failed to save demo workout:", error);
          }
        }

        console.log(`✅ Saved ${recentWorkouts.length} demo workouts`);
      }

      // שמור תוכנית אם יש
      if (userPlan) {
        const { savePlan } = await import("../data/storage");
        try {
          await savePlan(demoUser.id, userPlan);
          console.log(`✅ Saved demo plan: ${userPlan.name}`);
        } catch (error) {
          console.warn("Failed to save demo plan:", error);
        }
      }

      console.log(`🎉 Demo data loaded successfully for ${demoUser.name}`);
    } catch (error) {
      console.error("Failed to load demo data:", error);
    }

    // הגדר את המשתמש
    set({ user: demoUser, token: demoToken, status: "authenticated" });
  },

  login: async (email: string, password: string) => {
    try {
      set({ status: "loading" });

      // לוגיקת התחברות (כרגע מדומה)
      if (email && password.length >= 6) {
        const token = `${email}_token_${Date.now()}`;
        const demoUser: User = {
          id: "demo-user-123",
          email,
          age: 25,
          name: email.split("@")[0],
          experience: "intermediate",
          goals: ["general_fitness"],
          joinedAt: new Date().toISOString(),
        };

        set({ user: demoUser, token, status: "authenticated" });
        return { success: true };
      }

      set({ status: "unauthenticated" });
      return { success: false, error: "שגיאה בפרטי ההתחברות" };
    } catch (error) {
      set({ status: "unauthenticated" });
      return { success: false, error: "אירעה שגיאה בהתחברות" };
    }
  },

  register: async (data: RegisterData) => {
    try {
      set({ status: "loading" });

      const { email, password, age, name } = data;

      // ולידציה
      if (!email.includes("@") || password.length < 6) {
        set({ status: "unauthenticated" });
        return { success: false, error: "מייל לא תקין או סיסמה קצרה מדי" };
      }

      if (age < 16) {
        set({ status: "unauthenticated" });
        return { success: false, error: "ההרשמה מותרת מגיל 16 ומעלה" };
      }

      // יצירת משתמש חדש
      const token = `${email}_token_${Date.now()}`;
      const newUser: User = {
        id: `user_${Date.now()}`,
        email,
        age,
        name: name || email.split("@")[0],
        experience: "beginner", // ברירת מחדל למשתמש חדש
        goals: ["general_fitness"],
        joinedAt: new Date().toISOString(),
      };

      set({ user: newUser, token, status: "authenticated" });
      return { success: true };
    } catch (error) {
      set({ status: "unauthenticated" });
      return { success: false, error: "אירעה שגיאה בהרשמה" };
    }
  },

  logout: async () => {
    try {
      // ניקוי נתונים מקומיים אם נדרש
      const currentUser = get().user;
      if (currentUser && currentUser.id.startsWith("demo-user-")) {
        // זה משתמש דמו - אפשר לנקות את הנתונים שלו
        console.log(`🧹 Cleaning demo data for ${currentUser.name}`);
      }

      set({ user: null, token: null, status: "unauthenticated" });
    } catch (error) {
      console.error("Error during logout:", error);
      // גם במקרה של שגיאה, נבצע logout
      set({ user: null, token: null, status: "unauthenticated" });
    }
  },

  becomeGuest: () => {
    const guestToken = `guest_token_${Date.now()}`;
    set({ user: null, token: guestToken, status: "guest" });
  },
});

// יצירת ה-store עם יכולת שמירה (persist)
export const useUserStore = create<UserState>()(
  persist(storeCreator, {
    name: "gymovo-user-store",
    storage: createJSONStorage(() => AsyncStorage),
    partialize: (state) => ({
      user: state.user,
      token: state.token,
      status: state.status === "loading" ? "unauthenticated" : state.status,
    }),
    // ❌ השבתת rehydration עד שהאפליקציה מוכנה
    skipHydration: false,
    onRehydrateStorage: () => (state) => {
      // אם המצב הוא loading, שנה ל-unauthenticated
      if (state?.status === "loading") {
        state.setStatus("unauthenticated");
      }
      console.log("🔄 User store rehydrated:", state?.user?.name || "No user");
    },
  })
);

// 🔧 פונקציות עזר לעבודה עם המשתמש
export const isAuthenticatedUser = (user: User | null): boolean => {
  return user !== null;
};

export const isDemoUser = (user: User | null): boolean => {
  return user?.id.startsWith("demo-user-") || false;
};

export const getUserDisplayName = (user: User | null): string => {
  if (!user) return "אורח";
  return user.name || user.email.split("@")[0] || "משתמש";
};

export const getUserExperienceLevel = (user: User | null): string => {
  if (!user?.experience) return "מתחיל";

  const levels = {
    beginner: "מתחיל",
    intermediate: "בינוני",
    advanced: "מתקדם",
  };

  return levels[user.experience] || "מתחיל";
};
