// src/data/storage/core/keys.ts
// 🔑 ניהול מפתחות אחסון מרכזי ובטוח

/**
 * 🔑 ניהול מפתחות אחסון מרכזי
 * מספק API עקבי וטיפוסי בטוח למפתחות AsyncStorage
 */
export const StorageKeys = {
  // 📋 תוכניות אימון
  plans: (userId: string) => `plans_${userId}`,

  // 🏋️ היסטוריית אימונים
  workoutHistory: (userId: string) => `workout_history_${userId}`,

  // ⚙️ הגדרות אפליקציה גלובליות
  appSettings: () => "app_settings",

  // 💾 cache זמני
  cache: (key: string) => `cache_${key}`,

  // 📊 סטטיסטיקות (cache)
  statsCache: (userId: string, timeframe: string) =>
    `stats_cache_${userId}_${timeframe}`,

  // 🔍 תוצאות חיפוש (cache)
  searchCache: (userId: string, query: string) =>
    `search_cache_${userId}_${hashString(query)}`,

  // 📤 קבצי יצוא זמניים
  exportTemp: (userId: string, format: string) =>
    `export_temp_${userId}_${format}`,
} as const;

/**
 * 🔐 מחזיר את כל המפתחות הקשורים למשתמש ספציפי
 * שימושי למחיקת נתונים או הגירה
 */
export function getUserStorageKeys(userId: string): string[] {
  return [
    StorageKeys.plans(userId),
    StorageKeys.workoutHistory(userId),
    StorageKeys.statsCache(userId, "*"), // wildcard לכל timeframes
    StorageKeys.searchCache(userId, "*"), // wildcard לכל queries
    StorageKeys.exportTemp(userId, "*"), // wildcard לכל formats
  ];
}

/**
 * 🧹 מחזיר pattern למחיקת cache במסיבות מסוימות
 */
export function getCachePatterns() {
  return {
    // כל ה-cache של stats
    allStats: "stats_cache_*",

    // כל ה-cache של חיפושים
    allSearch: "search_cache_*",

    // קבצי export זמניים ישנים
    oldExports: "export_temp_*",

    // כל cache זמני
    allTemp: "cache_*",
  };
}

/**
 * 🔍 בדיקה אם מפתח שייך למשתמש ספציפי
 */
export function keyBelongsToUser(key: string, userId: string): boolean {
  const userKeys = getUserStorageKeys(userId);
  return userKeys.some((userKey) => {
    // תמיכה בwildcard patterns
    if (userKey.includes("*")) {
      const pattern = userKey.replace("*", "");
      return key.startsWith(pattern);
    }
    return key === userKey;
  });
}

/**
 * 🧮 פונקציית hash פשוטה למחרוזות
 * משמשת ליצירת מפתחות cache ייחודיים
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // המרה ל-32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * ⏰ יוצר מפתח עם timestamp לשמירת גרסאות
 */
export function createVersionedKey(baseKey: string): string {
  const timestamp = Date.now();
  return `${baseKey}_v${timestamp}`;
}

/**
 * 🏷️ מחלץ מידע ממפתח מובנה
 */
export function parseStorageKey(key: string): {
  type: string;
  userId?: string;
  additional?: string;
} {
  // ניתוח מפתחות plans_userId
  if (key.startsWith("plans_")) {
    return {
      type: "plans",
      userId: key.replace("plans_", ""),
    };
  }

  // ניתוח מפתחות workout_history_userId
  if (key.startsWith("workout_history_")) {
    return {
      type: "workoutHistory",
      userId: key.replace("workout_history_", ""),
    };
  }

  // ניתוח מפתחות cache
  if (key.startsWith("cache_")) {
    return {
      type: "cache",
      additional: key.replace("cache_", ""),
    };
  }

  // ניתוח מפתחות stats cache
  if (key.startsWith("stats_cache_")) {
    const parts = key.replace("stats_cache_", "").split("_");
    return {
      type: "statsCache",
      userId: parts[0],
      additional: parts.slice(1).join("_"),
    };
  }

  // ניתוח מפתחות search cache
  if (key.startsWith("search_cache_")) {
    const parts = key.replace("search_cache_", "").split("_");
    return {
      type: "searchCache",
      userId: parts[0],
      additional: parts.slice(1).join("_"),
    };
  }

  // מפתח לא מזוהה
  return {
    type: "unknown",
    additional: key,
  };
}

/**
 * 📝 יוצר רשימה של מפתחות לניקוי לפי גיל
 */
export function getExpiredKeys(
  allKeys: string[],
  maxAgeMs: number = 7 * 24 * 60 * 60 * 1000 // 7 ימים
): string[] {
  const now = Date.now();
  const expiredKeys: string[] = [];

  for (const key of allKeys) {
    const parsed = parseStorageKey(key);

    // ניקוי cache ישן
    if (
      parsed.type === "cache" ||
      parsed.type === "statsCache" ||
      parsed.type === "searchCache"
    ) {
      // אם יש timestamp במפתח, בדוק גיל
      const timestampMatch = key.match(/_v(\d+)$/);
      if (timestampMatch) {
        const keyTimestamp = parseInt(timestampMatch[1]);
        if (now - keyTimestamp > maxAgeMs) {
          expiredKeys.push(key);
        }
      }
    }
  }

  return expiredKeys;
}

/**
 * 🔧 פונקציות development לבדיקת מפתחות
 */
if (__DEV__) {
  (global as any).__STORAGE_KEYS__ = {
    StorageKeys,
    getUserStorageKeys,
    getCachePatterns,
    keyBelongsToUser,
    parseStorageKey,
    getExpiredKeys,
  };
}
