// src/stores/userStore.ts - גרסה מעודכנת עם פונקציות חסרות

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
  isInitialized: boolean;

  // פונקציות עדכון
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setStatus: (status: AuthStatus) => void;

  // פונקציות auth
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    data: RegisterData
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  becomeGuest: () => void;
  loginAsDemoUser: (demoUser: User) => Promise<void>;
  initialize: () => Promise<void>;
}

const storeCreator: StateCreator<UserState> = (set, get) => ({
  user: null,
  token: null,
  status: "loading",
  isInitialized: false,

  // פונקציות עדכון פשוטות
  setUser: (user: User) => set({ user }),
  setToken: (token: string) => set({ token }),
  setStatus: (status: AuthStatus) => set({ status }),

  // פונקציית אתחול
  initialize: async () => {
    try {
      console.log("🔧 Initializing user store...");

      const state = get();

      if (state.user && state.token) {
        console.log("👤 Found existing user:", state.user.name);
        set({
          status: state.user.isGuest ? "guest" : "authenticated",
          isInitialized: true,
        });
      } else {
        console.log("👤 No existing user found");
        set({
          status: "unauthenticated",
          isInitialized: true,
        });
      }
    } catch (error) {
      console.error("Failed to initialize user store:", error);
      set({
        status: "unauthenticated",
        isInitialized: true,
      });
    }
  },

  // התחברות
  login: async (email: string, password: string) => {
    try {
      // בגרסה האמיתית, כאן תהיה קריאה ל-API
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

      return { success: false, error: "אימייל או סיסמה לא תקינים" };
    } catch (error) {
      return { success: false, error: "שגיאה בהתחברות" };
    }
  },

  // הרשמה
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

  // כניסה כאורח
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

  // התחברות כמשתמש דמו
  loginAsDemoUser: async (demoUser: User) => {
    const demoToken = `demo_token_${demoUser.id}_${Date.now()}`;

    try {
      console.log(`🎭 Login as demo user: ${demoUser.name} (${demoUser.id})`);

      set({
        user: demoUser,
        token: demoToken,
        status: "authenticated",
        isInitialized: true,
      });

      // טען נתוני דמו ברקע
      const { getDemoWorkoutHistory } = await import("../constants/demoUsers");
      const workoutHistory = getDemoWorkoutHistory(demoUser.id);
      console.log(
        `📊 Found ${workoutHistory.length} demo workouts for ${demoUser.name}`
      );

      return;
    } catch (error) {
      console.error("Failed to login as demo user:", error);
      throw error;
    }
  },

  // התנתקות
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
    }),
    onRehydrateStorage: () => (state) => {
      if (state) {
        state.initialize();
      }
    },
  })
);
