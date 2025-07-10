// src/data/storage/utilities/index.ts
// 🛠️ כלי עזר ותחזוקה למערכת האחסון

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  withRetry,
  StorageError,
  StorageKeys,
  getUserStorageKeys,
  getStorageStats,
  resetStorageStats,
} from "../core";

/**
 * 📊 מחזיר מידע על שימוש בשטח האחסון
 */
export async function getStorageUsage(): Promise<{
  size: number;
  keys: string[];
}> {
  return withRetry(async () => {
    const keys = await AsyncStorage.getAllKeys();
    let totalSize = 0;

    for (const key of keys) {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        totalSize += value.length;
      }
    }

    return { size: totalSize, keys: [...keys] }; // יצירת עותק mutable
  }, "getStorageUsage");
}

/**
 * 🧹 מחיקת כל נתוני המשתמש
 * מסיר תוכניות, היסטוריה וכל המפתחות הקשורים
 */
export async function clearUserData(userId: string): Promise<boolean> {
  if (!userId?.trim()) {
    throw new StorageError("User ID is required", "clearUserData");
  }

  return withRetry(
    async () => {
      const keysToRemove = [
        StorageKeys.plans(userId),
        StorageKeys.workoutHistory(userId),
      ];

      await Promise.all(
        keysToRemove.map((key) => AsyncStorage.removeItem(key))
      );

      if (__DEV__) {
        console.log(`🧹 Cleared all data for user: ${userId}`);
      }

      return true;
    },
    "clearUserData",
    userId
  );
}

/**
 * 🗑️ מחיקת כל נתוני האפליקציה
 * אפס את כל AsyncStorage כולל הסטטיסטיקות
 */
export async function clearAllData(): Promise<boolean> {
  return withRetry(async () => {
    await AsyncStorage.clear();

    // איפוס סטטיסטיקות
    resetStorageStats();

    if (__DEV__) {
      console.log("🗑️ All AsyncStorage data cleared");
    }

    return true;
  }, "clearAllData");
}

/**
 * 🔍 מחזיר רשימת משתמשים שיש להם נתונים במערכת
 */
export async function findUsersWithData(): Promise<string[]> {
  const { keys } = await getStorageUsage();
  const userIds = new Set<string>();

  keys.forEach((key) => {
    if (key.startsWith("plans_")) {
      userIds.add(key.replace("plans_", ""));
    } else if (key.startsWith("workout_history_")) {
      userIds.add(key.replace("workout_history_", ""));
    }
  });

  return Array.from(userIds);
}

/**
 * 📊 מחזיר סטטיסטיקות מפורטות על כל משתמש
 */
export async function getUsersStorageReport(): Promise<{
  totalUsers: number;
  users: {
    userId: string;
    plansCount: number;
    workoutsCount: number;
    totalSize: number;
  }[];
  totalSize: number;
}> {
  const userIds = await findUsersWithData();
  const users = [];
  let totalSize = 0;

  for (const userId of userIds) {
    const plansKey = StorageKeys.plans(userId);
    const workoutsKey = StorageKeys.workoutHistory(userId);

    const plansData = await AsyncStorage.getItem(plansKey);
    const workoutsData = await AsyncStorage.getItem(workoutsKey);

    let plansCount = 0;
    let workoutsCount = 0;
    let userSize = 0;

    if (plansData) {
      try {
        const plans = JSON.parse(plansData);
        plansCount = Array.isArray(plans) ? plans.length : 0;
        userSize += plansData.length;
      } catch (e) {
        console.warn(`Invalid plans data for user ${userId}`);
      }
    }

    if (workoutsData) {
      try {
        const workouts = JSON.parse(workoutsData);
        workoutsCount = Array.isArray(workouts) ? workouts.length : 0;
        userSize += workoutsData.length;
      } catch (e) {
        console.warn(`Invalid workouts data for user ${userId}`);
      }
    }

    users.push({
      userId,
      plansCount,
      workoutsCount,
      totalSize: userSize,
    });

    totalSize += userSize;
  }

  return {
    totalUsers: userIds.length,
    users: users.sort((a, b) => b.totalSize - a.totalSize),
    totalSize,
  };
}

/**
 * 🧪 אימות שלמות הנתונים
 * בודק אם יש נתונים פגומים או חסרים
 */
export async function validateDataIntegrity(): Promise<{
  isValid: boolean;
  issues: string[];
  recommendations: string[];
}> {
  const issues: string[] = [];
  const recommendations: string[] = [];

  try {
    const userIds = await findUsersWithData();

    for (const userId of userIds) {
      // בדיקת תוכניות
      const plansKey = StorageKeys.plans(userId);
      const plansData = await AsyncStorage.getItem(plansKey);

      if (plansData) {
        try {
          const plans = JSON.parse(plansData);
          if (!Array.isArray(plans)) {
            issues.push(`User ${userId}: plans data is not an array`);
            recommendations.push(`Fix plans data structure for user ${userId}`);
          }
        } catch (e) {
          issues.push(`User ${userId}: corrupted plans data`);
          recommendations.push(
            `Remove or repair plans data for user ${userId}`
          );
        }
      }

      // בדיקת אימונים
      const workoutsKey = StorageKeys.workoutHistory(userId);
      const workoutsData = await AsyncStorage.getItem(workoutsKey);

      if (workoutsData) {
        try {
          const workouts = JSON.parse(workoutsData);
          if (!Array.isArray(workouts)) {
            issues.push(`User ${userId}: workouts data is not an array`);
            recommendations.push(
              `Fix workouts data structure for user ${userId}`
            );
          }
        } catch (e) {
          issues.push(`User ${userId}: corrupted workouts data`);
          recommendations.push(
            `Remove or repair workouts data for user ${userId}`
          );
        }
      }
    }

    // בדיקת שטח אחסון
    const { size } = await getStorageUsage();
    const sizeMB = size / (1024 * 1024);

    if (sizeMB > 5) {
      // מעל 5MB
      issues.push(`Storage usage is high: ${sizeMB.toFixed(2)}MB`);
      recommendations.push(
        "Consider cleaning old data or implementing data compression"
      );
    }

    return {
      isValid: issues.length === 0,
      issues,
      recommendations,
    };
  } catch (error) {
    return {
      isValid: false,
      issues: [
        `Failed to validate data integrity: ${(error as Error).message}`,
      ],
      recommendations: ["Check AsyncStorage permissions and availability"],
    };
  }
}

/**
 * 📈 מחזיר דוח מפורט על מצב המערכת
 */
export async function generateSystemReport(): Promise<string> {
  const storageUsage = await getStorageUsage();
  const usersReport = await getUsersStorageReport();
  const integrity = await validateDataIntegrity();
  const stats = getStorageStats();

  const sizeMB = (storageUsage.size / (1024 * 1024)).toFixed(2);

  return [
    "📊 Gymovo Storage System Report",
    "=".repeat(40),
    `📅 Generated: ${new Date().toISOString()}`,
    "",
    "📊 Storage Usage:",
    `   Total Size: ${sizeMB} MB`,
    `   Total Keys: ${storageUsage.keys.length}`,
    "",
    "👥 Users:",
    `   Total Users: ${usersReport.totalUsers}`,
    `   Active Users: ${
      usersReport.users.filter((u) => u.plansCount > 0 || u.workoutsCount > 0)
        .length
    }`,
    "",
    "📈 Performance Stats:",
    `   Operations: ${stats.operations}`,
    `   Success Rate: ${
      stats.operations > 0
        ? ((stats.successes / stats.operations) * 100).toFixed(1)
        : 0
    }%`,
    `   Avg Response: ${Math.round(stats.avgResponseTime)}ms`,
    "",
    "🔍 Data Integrity:",
    `   Status: ${integrity.isValid ? "✅ Valid" : "⚠️ Issues Found"}`,
    `   Issues: ${integrity.issues.length}`,
    ...(integrity.issues.length > 0
      ? ["   - " + integrity.issues.join("\n   - ")]
      : []),
    "",
    "📋 Top Users by Data Size:",
    ...usersReport.users
      .slice(0, 5)
      .map(
        (user) =>
          `   ${user.userId}: ${(user.totalSize / 1024).toFixed(1)}KB (${
            user.plansCount
          } plans, ${user.workoutsCount} workouts)`
      ),
    "",
    `Report generated by Gymovo Storage v1.0`,
  ].join("\n");
}

/**
 * 🔧 פונקציות development וbאיתור באגים
 */
if (__DEV__) {
  (global as any).__STORAGE_UTILITIES__ = {
    getUsage: getStorageUsage,
    clearUser: clearUserData,
    clearAll: clearAllData,
    findUsers: findUsersWithData,
    getUsersReport: getUsersStorageReport,
    validateIntegrity: validateDataIntegrity,
    generateReport: generateSystemReport,
    getStats: getStorageStats,
    resetStats: resetStorageStats,
  };
}
