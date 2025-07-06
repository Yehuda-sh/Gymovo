// src/stores/userStore.ts

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
  loginAsDemoUser: (demoUser: User) => void;
}

// פונקציית הבסיס ליצירת ה-store
const storeCreator: StateCreator<UserState> = (set) => ({
  user: null,
  token: null,
  status: "loading",

  setStatus: (status: AuthStatus) => set({ status }),

  loginAsDemoUser: (demoUser: User) => {
    const demoToken = `${demoUser.email}_token_${Date.now()}`;
    set({ user: demoUser, token: demoToken, status: "authenticated" });
  },

  login: async (email: string, password: string) => {
    // לוגיקת התחברות (כרגע מדומה)
    if (email && password.length >= 6) {
      const token = `${email}_token_${Date.now()}`;
      const demoUser: User = {
        id: "demo-user-123",
        email,
        age: 25,
        name: email.split("@")[0],
      };
      set({ user: demoUser, token, status: "authenticated" });
      return { success: true };
    }
    return { success: false, error: "שגיאה בפרטי ההתחברות" };
  },

  register: async (data: RegisterData) => {
    // לוגיקת הרשמה (כרגע מדומה)
    const { email, password, age, name } = data;
    if (!email.includes("@") || password.length < 6) {
      return { success: false, error: "מייל לא תקין או סיסמה קצרה מדי" };
    }
    if (age < 16) {
      return { success: false, error: "ההרשמה מותרת מגיל 16 ומעלה" };
    }
    const token = `${email}_token_${Date.now()}`;
    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      age,
      name: name || email.split("@")[0],
    };
    set({ user: newUser, token, status: "authenticated" });
    return { success: true };
  },

  logout: () => {
    set({ user: null, token: null, status: "unauthenticated" });
  },

  becomeGuest: () => {
    const guestToken = `guest_token_${Date.now()}`;
    set({ user: null, token: guestToken, status: "guest" });
  },
});

// יצירת ה-store עם יכולת שמירה (persist)
export const useUserStore = create<UserState>()(
  persist(storeCreator, {
    name: "gymovo-user-storage",
    storage: createJSONStorage(() => AsyncStorage),
    // הגדרה מה בדיוק לשמור בזיכרון המכשיר
    partialize: (state: UserState) => {
      // שומרים טוקן רק אם המשתמש מאומת
      if (state.status === "authenticated" && state.token) {
        return { token: state.token };
      }
      return {};
    },
    // פונקציה שרצה כשהאפליקציה נטענת והמידע מהאחסון חוזר
    onRehydrateStorage: () => (state, error) => {
      if (error) {
        console.log("failed to rehydrate", error);
        state?.setStatus("unauthenticated");
        return;
      }
      if (state?.token) {
        // אם מצאנו טוקן, נשחזר את פרטי המשתמש
        const email = state.token.split("_token_")[0];
        state.user = {
          id: "rehydrated-user",
          email,
          age: 25,
          name: email.split("@")[0],
        };
        state.setStatus("authenticated");
      } else {
        // אם אין טוקן, המשתמש לא מחובר
        state?.setStatus("unauthenticated");
      }
    },
  })
);
