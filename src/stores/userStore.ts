// src/stores/userStore.ts - גרסה משופרת עם ניהול משתמשי אורח

import { produce } from "immer";
import { create, StateCreator } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types/user";
import { generateId } from "../utils/idGenerator";

// טיפוסים מעודכנים
export interface User {
  id: string;
  email: string;
  name: string;
  age?: number;
  isGuest: boolean;
  createdAt?: string;
  stats?: UserStats;
  // מידע נוסף למשתמשי אורח
  guestCreatedAt?: string;
  guestDataExpiry?: string; // תאריך פקיעה לנתוני אורח
}

interface UserStats {
  totalWorkouts: number;
  totalTime: number;
  totalVolume: number;
  favoriteExercises: string[];
}

export interface RegisterData {
  email: string;
  password: string;
  age: number;
  name?: string;
}

type AuthStatus = "loading" | "unauthenticated" | "authenticated" | "guest";

interface LoginResult {
  success: boolean;
  error?: string;
}

interface SignupResult {
  success: boolean;
  error?: string;
}

interface ConversionResult {
  success: boolean;
  error?: string;
}

export interface UserState {
  user: User | null;
  token: string | null;
  status: AuthStatus;
  isInitialized: boolean;

  // פונקציות עדכון בסיסיות
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setStatus: (status: AuthStatus) => void;

  // פונקציות auth
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<LoginResult>;
  register: (data: RegisterData) => Promise<SignupResult>;
  becomeGuest: () => void;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  loginAsDemoUser: (demoUser: User) => Promise<void>;

  // ניהול מעבר ממשתמש אורח למשתמש רשום
  convertGuestToUser: (
    email: string,
    password: string
  ) => Promise<ConversionResult>;
  checkGuestDataExpiry: () => void;

  // פעולות עזר
  getGuestId: () => string;
  isGuestExpired: () => boolean;
}

// יוצר מזהה ייחודי למשתמש אורח
const createGuestId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `guest_${timestamp}_${random}`;
};

// בודק אם נתוני האורח פגו (אחרי 30 יום כברירת מחדל)
const isGuestDataExpired = (expiryDate?: string): boolean => {
  if (!expiryDate) return false;
  return new Date(expiryDate) < new Date();
};

// יצירת Store מתוקן
const storeCreator: StateCreator<UserState> = (set, get) => ({
  user: null,
  token: null,
  status: "loading",
  isInitialized: false,

  // פונקציות עדכון בסיסיות
  setUser: (user: User) => set({ user }),
  setToken: (token: string) => set({ token }),
  setStatus: (status: AuthStatus) => set({ status }),

  // אתחול - בודק אם יש משתמש אורח שמור
  initialize: async () => {
    try {
      set({ status: "loading" });

      // בדוק אם יש נתוני משתמש שמורים
      const savedUserData = await AsyncStorage.getItem("gymovo-user-storage");

      if (savedUserData) {
        const parsed = JSON.parse(savedUserData);

        // אם זה משתמש אורח, בדוק תוקף
        if (parsed.state?.user?.isGuest) {
          const user = parsed.state.user;

          if (isGuestDataExpired(user.guestDataExpiry)) {
            // נתוני האורח פגו - אפס
            console.log("🕐 Guest data expired, clearing...");
            await AsyncStorage.removeItem("gymovo-user-storage");
            set({
              user: null,
              token: null,
              status: "unauthenticated",
              isInitialized: true,
            });
          } else {
            // נתוני האורח תקפים
            set({
              user: user,
              token: null,
              status: "guest",
              isInitialized: true,
            });
          }
        } else if (parsed.state?.user && parsed.state?.token) {
          // משתמש רשום רגיל
          set({
            user: parsed.state.user,
            token: parsed.state.token,
            status: "authenticated",
            isInitialized: true,
          });
        } else {
          // נתונים לא תקינים
          set({
            status: "unauthenticated",
            isInitialized: true,
          });
        }
      } else {
        // אין נתונים שמורים
        set({
          status: "unauthenticated",
          isInitialized: true,
        });
      }
    } catch (error) {
      console.error("Failed to initialize user:", error);
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

  // כניסה כאורח משופרת
  becomeGuest: () => {
    const guestId = createGuestId();
    const now = new Date();

    // יצירת תאריך פקיעה - 30 יום מהיום
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    const guestUser: User = {
      id: guestId,
      email: `${guestId}@gymovo.app`,
      name: "משתמש אורח",
      age: 25,
      isGuest: true,
      createdAt: now.toISOString(),
      guestCreatedAt: now.toISOString(),
      guestDataExpiry: expiryDate.toISOString(),
      stats: {
        totalWorkouts: 0,
        totalTime: 0,
        totalVolume: 0,
        favoriteExercises: [],
      },
    };

    set({
      user: guestUser,
      token: null,
      status: "guest",
      isInitialized: true,
    });

    console.log(`🎭 Created guest user: ${guestId}`);
    console.log(
      `📅 Guest data will expire on: ${expiryDate.toLocaleDateString("he-IL")}`
    );
  },

  // המרת משתמש אורח למשתמש רשום
  convertGuestToUser: async (email: string, password: string) => {
    const currentUser = get().user;

    if (!currentUser?.isGuest) {
      return {
        success: false,
        error: "לא נמצא משתמש אורח להמרה",
      };
    }

    try {
      // כאן תהיה קריאה ל-API/Supabase להמרת המשתמש
      // לצורך הדוגמה, נעשה המרה מקומית

      const convertedUser: User = {
        ...currentUser,
        email,
        name: email.split("@")[0],
        isGuest: false,
        guestCreatedAt: undefined,
        guestDataExpiry: undefined,
      };

      set({
        user: convertedUser,
        token: `token_${Date.now()}`, // בפועל יגיע מהשרת
        status: "authenticated",
      });

      // שמור את כל נתוני האימונים של האורח
      console.log("✅ Guest user successfully converted to registered user");
      console.log("📊 All workout data has been preserved");

      return { success: true };
    } catch (error) {
      console.error("Failed to convert guest user:", error);
      return {
        success: false,
        error: "שגיאה בהמרת משתמש אורח",
      };
    }
  },

  // בדיקת תוקף נתוני אורח
  checkGuestDataExpiry: () => {
    const user = get().user;

    if (user?.isGuest && isGuestDataExpired(user.guestDataExpiry)) {
      console.log("⚠️ Guest data has expired");
      get().logout();
    }
  },

  // פעולות עזר
  getGuestId: () => {
    const user = get().user;
    return user?.isGuest ? user.id : "";
  },

  isGuestExpired: () => {
    const user = get().user;
    return user?.isGuest ? isGuestDataExpired(user.guestDataExpiry) : false;
  },

  // עדכון פרטי משתמש
  updateUser: (updates: Partial<User>) => {
    set(
      produce((state: UserState) => {
        if (state.user) {
          Object.assign(state.user, updates);
        }
      })
    );
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

  // התנתקות משופרת
  logout: async () => {
    const user = get().user;

    if (user?.isGuest) {
      // למשתמש אורח - אזהרה על איבוד נתונים
      console.log("⚠️ Guest user logging out - all data will be lost!");
    }

    set({
      user: null,
      token: null,
      status: "unauthenticated",
      isInitialized: true,
    });
  },
});

// יצירת Store עם persistence משופר
export const useUserStore = create<UserState>()(
  devtools(
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
          // בדוק תוקף נתוני אורח בכל טעינה
          setTimeout(() => {
            state.checkGuestDataExpiry();
            state.initialize();
          }, 0);
        }
      },
    }),
    {
      name: "user-store",
    }
  )
);

// Hook לניהול משתמש אורח
export const useGuestUser = () => {
  const { user, status, becomeGuest, convertGuestToUser, isGuestExpired } =
    useUserStore();

  const isGuest = user?.isGuest ?? false;
  const daysUntilExpiry = user?.guestDataExpiry
    ? Math.ceil(
        (new Date(user.guestDataExpiry).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  return {
    isGuest,
    guestId: user?.id,
    daysUntilExpiry,
    isExpired: isGuestExpired(),
    becomeGuest,
    convertGuestToUser,
  };
};
