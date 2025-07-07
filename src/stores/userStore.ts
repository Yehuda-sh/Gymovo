// src/stores/userStore.ts - תיקון לטעינת נתוני דמו

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

const storeCreator: StateCreator<UserState> = (set, get) => ({
  user: null,
  token: null,
  status: "loading",

  setStatus: (status: AuthStatus) => set({ status }),

  // ✅ Fixed: פונקציה מתוקנת לטעינת נתוני דמו
  loginAsDemoUser: async (demoUser: User) => {
    const demoToken = `demo_token_${demoUser.id}_${Date.now()}`;

    try {
      console.log(`🎭 Login as demo user: ${demoUser.name} (${demoUser.id})`);

      // ✅ First: Set user immediately so other components can detect demo user
      set({
        user: demoUser,
        token: demoToken,
        status: "authenticated",
      });

      // ✅ Then: Load demo data in background
      const { getDemoWorkoutHistory, getDemoPlanForUser } = await import(
        "../constants/demoUsers"
      );

      const workoutHistory = getDemoWorkoutHistory(demoUser.id);
      console.log(
        `📊 Found ${workoutHistory.length} demo workouts for ${demoUser.name}`
      );

      // ✅ Save demo workouts to AsyncStorage (only recent ones to avoid performance issues)
      if (workoutHistory.length > 0) {
        const { saveWorkoutToHistory } = await import("../data/storage");
        const recentWorkouts = workoutHistory.slice(0, 10); // Only last 10 workouts

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

      // ✅ Save demo plan if exists
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
      // Even if demo data loading fails, keep user logged in
    }
  },

  login: async (email: string, password: string) => {
    try {
      // ✅ Check if it's a demo user first
      const { demoUsers } = await import("../constants/demoUsers");
      const demoUser = demoUsers.find((user) => user.email === email);

      if (demoUser && password === "demo123") {
        await get().loginAsDemoUser(demoUser);
        return { success: true };
      }

      // Simulate real login
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
        });

        return { success: true };
      }

      return { success: false, error: "אימייל או סיסמה שגויים" };
    } catch (error) {
      return { success: false, error: "שגיאה בהתחברות" };
    }
  },

  register: async (data: RegisterData) => {
    try {
      // Simulate registration
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
    });
  },

  logout: () => {
    set({
      user: null,
      token: null,
      status: "unauthenticated",
    });
  },
});

// ✅ Create store with persistence
export const useUserStore = create<UserState>()(
  persist(storeCreator, {
    name: "gymovo-user-storage",
    storage: createJSONStorage(() => AsyncStorage),
    partialize: (state) => ({
      user: state.user,
      token: state.token,
      status: state.status,
    }),
  })
);
