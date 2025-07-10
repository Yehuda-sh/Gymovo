// src/stores/userStore.ts - תיקון אתחול המצב

import AsyncStorage from "@react-native-async-storage/async-storage";
import { create, StateCreator } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { User } from "../types/user";

type AuthStatus = "loading" | "unauthenticated" | "authenticated" | "guest";

export interface RegisterData {
  email: string;
  password: string;
  age: number;
  name?: string;
}

export interface UserState {
  user: User | null;
  token: string | null;
  status: AuthStatus;
  isInitialized: boolean; // ✅ הוספה: דגל לביצור שההתחלה סיימה
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
  initialize: () => Promise<void>; // ✅ הוספה: פונקציית אתחול
}

const storeCreator: StateCreator<UserState> = (set, get) => ({
  user: null,
  token: null,
  status: "loading",
  isInitialized: false, // ✅ התחלה: לא מאותחל

  setStatus: (status: AuthStatus) => set({ status }),

  // ✅ חדש: פונקציית אתחול
  initialize: async () => {
    try {
      console.log("🔧 Initializing user store...");

      // בדוק אם יש משתמש שמור
      const state = get();

      if (state.user && state.token) {
        // יש משתמש שמור - אמת אותו
        console.log("👤 Found existing user:", state.user.name);
        set({
          status: state.user.isGuest ? "guest" : "authenticated",
          isInitialized: true,
        });
      } else {
        // אין משתמש שמור
        console.log("👤 No existing user found");
        set({
          status: "unauthenticated",
          isInitialized: true,
        });
      }
    } catch (error) {
      console.error("Failed to initialize user store:", error);
      // גם במקרה של שגיאה, סמן כמאותחל
      set({
        status: "unauthenticated",
        isInitialized: true,
      });
    }
  },

  loginAsDemoUser: async (demoUser: User) => {
    const demoToken = `demo_token_${demoUser.id}_${Date.now()}`;

    try {
      console.log(`🎭 Login as demo user: ${demoUser.name} (${demoUser.id})`);

      // ראשית: הגדר את המשתמש מיידית
      set({
        user: demoUser,
        token: demoToken,
        status: "authenticated",
        isInitialized: true, // ✅ וודא שמאותחל
      });

      // שנית: טען נתוני דמו ברקע
      const { getDemoWorkoutHistory, getDemoPlanForUser } = await import(
        "../constants/demoUsers"
      );

      const workoutHistory = getDemoWorkoutHistory(demoUser.id);
      console.log(
        `📊 Found ${workoutHistory.length} demo workouts for ${demoUser.name}`
      );

      // שמור אימונים לזיכרון (רק האחרונים כדי לא להאט)
      if (workoutHistory.length > 0) {
        const { saveWorkoutToHistory } = await import("../data/storage");
        const recentWorkouts = workoutHistory.slice(0, 10);

        for (const workout of recentWorkouts) {
          try {
            await saveWorkoutToHistory(demoUser.id, workout);
          } catch (error) {
            console.warn("Failed to save demo workout:", error);
          }
        }

        console.log(
          `✅ Saved ${recentWorkouts.length} demo workouts to storage`
        );
      }

      // שמור תוכנית דמו אם קיימת
      const userPlan = getDemoPlanForUser(demoUser.id);
      if (userPlan) {
        try {
          const { savePlan } = await import("../data/storage");
          await savePlan(demoUser.id, userPlan);
          console.log(`✅ Saved demo plan: ${userPlan.name}`);
        } catch (error) {
          console.warn("Failed to save demo plan:", error);
        }
      }
    } catch (error) {
      console.error("Failed to setup demo user:", error);
      // גם אם טעינת נתוני הדמו נכשלה, שמור את המשתמש מחובר
    }
  },

  login: async (email: string, password: string) => {
    try {
      // בדוק אם זה משתמש דמו
      const { demoUsers } = await import("../constants/demoUsers");
      const demoUser = demoUsers.find((user) => user.email === email);

      if (demoUser && password === "demo123") {
        await get().loginAsDemoUser(demoUser);
        return { success: true };
      }

      // סימולציה של התחברות אמיתית
      if (email && password.length >= 6) {
        const mockUser: User = {
          id: `user_${Date.now()}`,
          email,
          name: email.split("@")[0],
          age: 25,
          isGuest: false,
        };

        set({
          user: mockUser,
          token: `token_${Date.now()}`,
          status: "authenticated",
          isInitialized: true,
        });

        return { success: true };
      }

      return { success: false, error: "אימייל או סיסמה שגויים" };
    } catch (_error) {
      return { success: false, error: "שגיאה בהתחברות" };
    }
  },

  register: async (data: RegisterData) => {
    try {
      if (data.email && data.password.length >= 6) {
        const newUser: User = {
          id: `user_${Date.now()}`,
          email: data.email,
          name: data.name || data.email.split("@")[0],
          age: data.age,
          isGuest: false,
        };

        set({
          user: newUser,
          token: `token_${Date.now()}`,
          status: "authenticated",
          isInitialized: true,
        });

        return { success: true };
      }

      return { success: false, error: "נתונים לא תקינים" };
    } catch (error) {
      return { success: false, error: "שגיאה ברישום" };
    }
  },

  becomeGuest: () => {
    const guestUser: User = {
      id: `guest_${Date.now()}`,
      email: "guest@gymovo.app",
      name: "משתמש אורח",
      age: 25,
      isGuest: true,
    };

    set({
      user: guestUser,
      token: null,
      status: "guest",
      isInitialized: true,
    });
  },

  logout: () => {
    set({
      user: null,
      token: null,
      status: "unauthenticated",
      isInitialized: true,
    });
  },
});

// יצירת Store עם persistence
export const useUserStore = create<UserState>()(
  persist(storeCreator, {
    name: "gymovo-user-storage",
    storage: createJSONStorage(() => AsyncStorage),
    partialize: (state) => ({
      user: state.user,
      token: state.token,
      status: state.status,
      // לא שומרים isInitialized - זה תמיד מתחיל false
    }),
    // ✅ הוסף onRehydrateStorage לאתחול אחרי טעינה
    onRehydrateStorage: () => (state) => {
      if (state) {
        // אחרי שטען מהזיכרון, קרא לאתחול
        state.initialize();
      }
    },
  })
);
