// src/stores/userStore.ts - גרסה משופרת עם ניהול משתמשי אורח

import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { produce } from "immer";
import { User, UserStats } from "../types/user";
import { generateId } from "../utils/idGenerator";

// 📊 ממשק מלא למצב המשתמש
export interface UserState {
  // 👤 נתוני משתמש
  user: User | null;
  isLoading: boolean;
  error: string | null;

  // 🎯 פעולות משתמש
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  loadUser: (userId: string) => Promise<void>;
  logout: () => void;
  deleteAccount: () => Promise<void>;

  // 🔐 אותנטיקציה
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    email: string,
    password: string,
    name: string,
    age?: number
  ) => Promise<{ success: boolean; error?: string }>;

  // 👻 ניהול משתמשי אורח
  createGuestUser: () => void;
  becomeGuest: () => void;
  convertGuestToUser: (
    email: string,
    password: string,
    name: string
  ) => Promise<void>;
  isGuestUser: () => boolean;
  getGuestExpiryDate: () => Date | null;

  // 🎭 משתמשי דמו
  loginAsDemoUser: (demoUser: User) => Promise<void>;

  // 📈 סטטיסטיקות
  updateStats: (updates: Partial<UserStats>) => void;
  incrementStat: (stat: keyof UserStats, value: number) => void;
  addFavoriteExercise: (exerciseId: string) => void;
  removeFavoriteExercise: (exerciseId: string) => void;

  // 🔄 פעולות עזר
  resetError: () => void;
  clearAll: () => void;
}

// ⏰ קבועים
const GUEST_DATA_EXPIRY_DAYS = 30; // נתוני אורח נשמרים ל-30 יום
const USER_STORAGE_KEY = "gymovo_user_";

// קבוע ברירת מחדל לסטטיסטיקות משתמש
export const DEFAULT_USER_STATS: UserStats = {
  totalWorkouts: 0,
  totalTime: 0,
  totalVolume: 0,
  favoriteExercises: [],
  workoutsCount: 0,
  streakDays: 0,
  longestStreak: 0,
  weeklyAverage: 0,
  achievementsUnlocked: 0,
  personalRecordsCount: 0,
  plansCompleted: 0,
  challengesCompleted: 0,
};

// 🔧 פונקציות עזר
const createGuestUserData = (): User => {
  const now = new Date();
  const expiryDate = new Date(now);
  expiryDate.setDate(expiryDate.getDate() + GUEST_DATA_EXPIRY_DAYS);

  return {
    id: `guest_${generateId()}`,
    email: "",
    name: "אורח",
    isGuest: true,
    guestCreatedAt: now.toISOString(),
    guestDataExpiry: expiryDate.toISOString(),
    createdAt: now.toISOString(),
    stats: { ...DEFAULT_USER_STATS },
  };
};

const isGuestExpired = (user: User): boolean => {
  if (!user.isGuest || !user.guestDataExpiry) return false;
  return new Date() > new Date(user.guestDataExpiry);
};

// פונקציות אחסון מקומיות
const saveUserToStorage = async (userId: string, user: User): Promise<void> => {
  try {
    const key = `${USER_STORAGE_KEY}${userId}`;
    await AsyncStorage.setItem(key, JSON.stringify(user));
  } catch (error) {
    console.error("Failed to save user:", error);
    throw error;
  }
};

const getUserFromStorage = async (userId: string): Promise<User | null> => {
  try {
    const key = `${USER_STORAGE_KEY}${userId}`;
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Failed to get user:", error);
    return null;
  }
};

const deleteUserFromStorage = async (userId: string): Promise<void> => {
  try {
    const key = `${USER_STORAGE_KEY}${userId}`;
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error("Failed to delete user:", error);
    throw error;
  }
};

// 🏭 יצירת Store עם Zustand
export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        // 🏁 מצב התחלתי
        user: null,
        isLoading: false,
        error: null,

        // 👤 הגדרת משתמש
        setUser: (user: User) => {
          set({ user, error: null });
          // שמירה ל-storage
          if (user.id) {
            saveUserToStorage(user.id, user).catch(console.error);
          }
        },

        // ✏️ עדכון משתמש
        updateUser: (updates: Partial<User>) => {
          set(
            produce((state: UserState) => {
              if (state.user) {
                Object.assign(state.user, updates);
                // שמירה ל-storage
                if (state.user.id) {
                  saveUserToStorage(state.user.id, state.user).catch(
                    console.error
                  );
                }
              }
            })
          );
        },

        // 📥 טעינת משתמש
        loadUser: async (userId: string) => {
          set({ isLoading: true, error: null });

          try {
            const userData = await getUserFromStorage(userId);
            if (userData) {
              // בדוק אם משתמש אורח פג תוקף
              if (userData.isGuest && isGuestExpired(userData)) {
                console.log("Guest user expired, creating new guest");
                get().createGuestUser();
              } else {
                set({ user: userData, isLoading: false });
              }
            } else {
              set({
                user: null,
                isLoading: false,
                error: "משתמש לא נמצא",
              });
            }
          } catch (error) {
            console.error("Failed to load user:", error);
            set({
              user: null,
              isLoading: false,
              error: "שגיאה בטעינת המשתמש",
            });
          }
        },

        // 🔐 התחברות
        login: async (email: string, password: string) => {
          try {
            set({ isLoading: true, error: null });

            // TODO: החלף בקריאה לשרת אמיתי
            // const response = await authAPI.login(email, password);

            // כרגע - מימוש מוק לבדיקה
            if (email && password.length >= 6) {
              const loggedInUser: User = {
                id: `user_${generateId()}`,
                email: email.toLowerCase().trim(),
                name: email.split("@")[0],
                isGuest: false,
                createdAt: new Date().toISOString(),
                stats: { ...DEFAULT_USER_STATS },
              };

              // שמור את המשתמש
              await saveUserToStorage(loggedInUser.id, loggedInUser);

              set({
                user: loggedInUser,
                isLoading: false,
                error: null,
              });

              return { success: true };
            }

            set({
              isLoading: false,
              error: "אימייל או סיסמה לא תקינים",
            });

            return {
              success: false,
              error: "אימייל או סיסמה לא תקינים",
            };
          } catch (error) {
            console.error("Login error:", error);
            set({
              isLoading: false,
              error: "שגיאה בהתחברות",
            });

            return {
              success: false,
              error: "שגיאה בהתחברות",
            };
          }
        },

        // 🔐 הרשמה
        register: async (
          email: string,
          password: string,
          name: string,
          age?: number
        ) => {
          try {
            set({ isLoading: true, error: null });

            // TODO: החלף בקריאה לשרת אמיתי
            // const response = await authAPI.register(email, password, name, age);

            // בדיקות בסיסיות
            if (!email || !email.includes("@")) {
              throw new Error("כתובת אימייל לא תקינה");
            }

            if (!password || password.length < 6) {
              throw new Error("הסיסמה חייבת להכיל לפחות 6 תווים");
            }

            if (!name || name.length < 2) {
              throw new Error("השם חייב להכיל לפחות 2 תווים");
            }

            // יצירת משתמש חדש
            const newUser: User = {
              id: `user_${generateId()}`,
              email: email.toLowerCase().trim(),
              name: name.trim(),
              age,
              isGuest: false,
              createdAt: new Date().toISOString(),
              stats: { ...DEFAULT_USER_STATS },
            };

            // שמור את המשתמש
            await saveUserToStorage(newUser.id, newUser);

            set({
              user: newUser,
              isLoading: false,
              error: null,
            });

            return { success: true };
          } catch (error: any) {
            console.error("Register error:", error);
            const errorMessage = error.message || "שגיאה בהרשמה";

            set({
              isLoading: false,
              error: errorMessage,
            });

            return {
              success: false,
              error: errorMessage,
            };
          }
        },

        // 🚪 התנתקות
        logout: () => {
          const currentUser = get().user;

          // אם זה משתמש אורח, מחק את הנתונים
          if (currentUser?.isGuest && currentUser.id) {
            deleteUserFromStorage(currentUser.id).catch(console.error);
          }

          set({
            user: null,
            error: null,
          });
        },

        // 🗑️ מחיקת חשבון
        deleteAccount: async () => {
          const currentUser = get().user;
          if (!currentUser?.id) return;

          try {
            await deleteUserFromStorage(currentUser.id);
            set({ user: null, error: null });
          } catch (error) {
            console.error("Failed to delete account:", error);
            throw error;
          }
        },

        // 👻 יצירת משתמש אורח
        createGuestUser: () => {
          const guestUser = createGuestUserData();
          set({ user: guestUser, error: null });

          // שמירה ל-storage
          saveUserToStorage(guestUser.id, guestUser).catch(console.error);

          console.log(`👻 Created guest user: ${guestUser.id}`);
        },

        // 👻 הפוך למשתמש אורח (alias ל-createGuestUser)
        becomeGuest: () => {
          get().createGuestUser();
        },

        // 🎭 התחברות כמשתמש דמו
        loginAsDemoUser: async (demoUser: User) => {
          try {
            set({ isLoading: true, error: null });

            // ודא שזה משתמש דמו
            if (!demoUser.id.startsWith("demo_")) {
              throw new Error("Not a valid demo user");
            }

            // הגדר את המשתמש הדמו
            const demoUserWithStats: User = {
              ...demoUser,
              stats: demoUser.stats
                ? { ...DEFAULT_USER_STATS, ...demoUser.stats }
                : { ...DEFAULT_USER_STATS },
            };

            // שמור את המשתמש
            await saveUserToStorage(demoUserWithStats.id, demoUserWithStats);

            set({
              user: demoUserWithStats,
              isLoading: false,
              error: null,
            });

            console.log(
              `🎭 Logged in as demo user: ${demoUser.name} (${demoUser.id})`
            );

            // טען נתוני דמו ברקע אם זמינים
            if (__DEV__) {
              try {
                const { getDemoWorkoutHistory } = await import(
                  "../constants/demoUsers"
                );
                const workoutHistory = getDemoWorkoutHistory(demoUser.id);
                console.log(
                  `📊 Found ${workoutHistory.length} demo workouts for ${demoUser.name}`
                );
              } catch (error) {
                console.log("Demo workout history not available");
              }
            }
          } catch (error) {
            console.error("Failed to login as demo user:", error);
            set({
              isLoading: false,
              error: "שגיאה בהתחברות כמשתמש דמו",
            });
            throw error;
          }
        },

        // 🔄 המרת אורח למשתמש רשום
        convertGuestToUser: async (
          email: string,
          password: string,
          name: string
        ) => {
          const currentUser = get().user;
          if (!currentUser?.isGuest) {
            throw new Error("Current user is not a guest");
          }

          try {
            set({ isLoading: true, error: null });

            // יצירת משתמש חדש עם שמירת הנתונים הקיימים
            const registeredUser: User = {
              ...currentUser,
              id: `user_${generateId()}`, // ID חדש למשתמש רשום
              email,
              name,
              isGuest: false,
              guestCreatedAt: undefined,
              guestDataExpiry: undefined,
              createdAt: new Date().toISOString(),
            };

            // מחיקת משתמש האורח הישן
            await deleteUserFromStorage(currentUser.id);

            // שמירת המשתמש החדש
            await saveUserToStorage(registeredUser.id, registeredUser);

            set({
              user: registeredUser,
              isLoading: false,
              error: null,
            });

            console.log(
              `✅ Converted guest ${currentUser.id} to user ${registeredUser.id}`
            );
          } catch (error) {
            console.error("Failed to convert guest to user:", error);
            set({
              isLoading: false,
              error: "שגיאה בהמרת האורח למשתמש",
            });
            throw error;
          }
        },

        // ❓ בדיקה אם משתמש אורח
        isGuestUser: () => {
          return get().user?.isGuest || false;
        },

        // 📅 קבלת תאריך תפוגה של אורח
        getGuestExpiryDate: () => {
          const user = get().user;
          if (!user?.isGuest || !user.guestDataExpiry) return null;
          return new Date(user.guestDataExpiry);
        },

        // 📊 עדכון סטטיסטיקות
        updateStats: (updates: Partial<UserStats>) => {
          set(
            produce((state: UserState) => {
              if (state.user) {
                if (!state.user.stats) {
                  state.user.stats = { ...DEFAULT_USER_STATS };
                }
                Object.assign(state.user.stats, updates);

                // שמירה ל-storage
                if (state.user.id) {
                  saveUserToStorage(state.user.id, state.user).catch(
                    console.error
                  );
                }
              }
            })
          );
        },

        // ➕ הגדלת סטטיסטיקה
        incrementStat: (stat: keyof UserStats, value: number) => {
          set(
            produce((state: UserState) => {
              if (state.user?.stats) {
                if (stat === "favoriteExercises") return; // לא ניתן להגדיל מערך

                const currentValue = state.user.stats[stat] as number;
                (state.user.stats[stat] as number) = currentValue + value;

                // שמירה ל-storage
                if (state.user.id) {
                  saveUserToStorage(state.user.id, state.user).catch(
                    console.error
                  );
                }
              }
            })
          );
        },

        // ⭐ הוספת תרגיל מועדף
        addFavoriteExercise: (exerciseId: string) => {
          set(
            produce((state: UserState) => {
              if (
                state.user?.stats &&
                !state.user.stats.favoriteExercises.includes(exerciseId)
              ) {
                state.user.stats.favoriteExercises.push(exerciseId);

                // שמור רק את 10 המועדפים האחרונים
                if (state.user.stats.favoriteExercises.length > 10) {
                  state.user.stats.favoriteExercises.shift();
                }

                // שמירה ל-storage
                if (state.user.id) {
                  saveUserToStorage(state.user.id, state.user).catch(
                    console.error
                  );
                }
              }
            })
          );
        },

        // ❌ הסרת תרגיל מועדף
        removeFavoriteExercise: (exerciseId: string) => {
          set(
            produce((state: UserState) => {
              if (state.user?.stats) {
                state.user.stats.favoriteExercises =
                  state.user.stats.favoriteExercises.filter(
                    (id) => id !== exerciseId
                  );

                // שמירה ל-storage
                if (state.user.id) {
                  saveUserToStorage(state.user.id, state.user).catch(
                    console.error
                  );
                }
              }
            })
          );
        },

        // 🔄 איפוס שגיאה
        resetError: () => {
          set({ error: null });
        },

        // 🧹 ניקוי כל הנתונים
        clearAll: () => {
          set({
            user: null,
            isLoading: false,
            error: null,
          });
        },
      }),
      {
        name: "user-storage",
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({
          user: state.user,
        }),
        onRehydrateStorage: () => (state) => {
          // בדיקה אם משתמש אורח פג תוקף אחרי טעינה מ-storage
          if (state?.user?.isGuest && state.user.guestDataExpiry) {
            if (isGuestExpired(state.user)) {
              console.log("Guest user expired on rehydration, clearing");
              state.user = null;
            }
          }
        },
      }
    ),
    {
      name: "user-store",
    }
  )
);

// 🔧 Hooks נוחים לשימוש
export const useCurrentUser = () => useUserStore((state) => state.user);
export const useIsGuest = () => useUserStore((state) => state.isGuestUser());
export const useUserStats = () => useUserStore((state) => state.user?.stats);

// 🛠️ פונקציות עזר גלובליות
export const initializeUser = async () => {
  const store = useUserStore.getState();

  // אם יש משתמש ב-storage, הוא ייטען אוטומטית
  // אחרת, צור משתמש אורח
  if (!store.user) {
    store.createGuestUser();
  }
};

// 📊 פונקציה לעדכון סטטיסטיקות אחרי אימון
export const updateUserStatsAfterWorkout = (workoutData: {
  duration: number;
  volume: number;
  exercises: string[];
}) => {
  const store = useUserStore.getState();

  // עדכון סטטיסטיקות
  store.incrementStat("totalWorkouts", 1);
  store.incrementStat("totalTime", workoutData.duration);
  store.incrementStat("totalVolume", workoutData.volume);

  // עדכון תרגילים מועדפים
  workoutData.exercises.forEach((exerciseId) => {
    store.addFavoriteExercise(exerciseId);
  });
};
