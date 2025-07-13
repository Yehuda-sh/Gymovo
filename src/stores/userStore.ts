// src/stores/userStore.ts - תיקון ושיפור ניהול משתמש אורח

import { produce } from "immer";
import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

interface UserState {
  user: User | null;
  token: string | null;
  status: "authenticated" | "unauthenticated" | "guest" | "loading";
  isInitialized: boolean;

  // פעולות
  initialize: () => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<LoginResult>;
  signup: (data: RegisterData) => Promise<SignupResult>;
  becomeGuest: () => void;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;

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
const storeCreator = (set: any, get: any): UserState => ({
  user: null,
  token: null,
  status: "loading",
  isInitialized: false,

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
        } else {
          // משתמש רשום רגיל
          set({
            user: parsed.state.user,
            token: parsed.state.token,
            status: "authenticated",
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

  // שאר הפונקציות כמו login, signup וכו'...
});

// יצירת Store עם persistence משופר
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
        // בדוק תוקף נתוני אורח בכל טעינה
        state.checkGuestDataExpiry();
        state.initialize();
      }
    },
  })
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
