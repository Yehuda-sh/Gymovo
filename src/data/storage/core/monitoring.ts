// src/data/storage/core/monitoring.ts
// 📊 ניטור וסטטיסטיקות למערכת האחסון

/**
 * 📊 ממשק לסטטיסטיקות storage
 */
export interface StorageStats {
  operations: number;
  successes: number;
  failures: number;
  retries: number;
  avgResponseTime: number;
}

/**
 * 📈 משתנה גלובלי לסטטיסטיקות (רק לפיתוח)
 */
let storageStats: StorageStats = {
  operations: 0,
  successes: 0,
  failures: 0,
  retries: 0,
  avgResponseTime: 0,
};

/**
 * 📊 מחזיר עותק של הסטטיסטיקות הנוכחיות
 */
export function getStorageStats(): StorageStats {
  return { ...storageStats };
}

/**
 * 🔄 מאפס את כל הסטטיסטיקות
 */
export function resetStorageStats(): void {
  storageStats = {
    operations: 0,
    successes: 0,
    failures: 0,
    retries: 0,
    avgResponseTime: 0,
  };
}

/**
 * ➕ מעדכן ערך סטטיסטי ספציפי
 */
export function updateStorageStats(
  metric: keyof StorageStats,
  value: number
): void {
  if (metric === "avgResponseTime") {
    // חישוב ממוצע מתגלגל לזמן תגובה
    const currentSuccesses = storageStats.successes;
    if (currentSuccesses > 0) {
      storageStats.avgResponseTime =
        (storageStats.avgResponseTime * (currentSuccesses - 1) + value) /
        currentSuccesses;
    } else {
      storageStats.avgResponseTime = value;
    }
  } else {
    storageStats[metric] += value;
  }
}

/**
 * 📈 מחזיר סטטיסטיקות מחושבות נוספות
 */
export function getDetailedStats() {
  const stats = getStorageStats();

  return {
    ...stats,
    successRate:
      stats.operations > 0 ? (stats.successes / stats.operations) * 100 : 0,
    failureRate:
      stats.operations > 0 ? (stats.failures / stats.operations) * 100 : 0,
    retryRate:
      stats.operations > 0 ? (stats.retries / stats.operations) * 100 : 0,
    avgResponseTimeMs: Math.round(stats.avgResponseTime),
    isHealthy: stats.operations > 0 && stats.successes / stats.operations > 0.9,
  };
}

/**
 * 📝 יוצר דוח מפורט של הביצועים
 */
export function generatePerformanceReport(): string {
  const detailed = getDetailedStats();

  return [
    "📊 Storage Performance Report",
    "=" * 35,
    `📈 Total Operations: ${detailed.operations}`,
    `✅ Successes: ${detailed.successes} (${detailed.successRate.toFixed(1)}%)`,
    `❌ Failures: ${detailed.failures} (${detailed.failureRate.toFixed(1)}%)`,
    `🔄 Retries: ${detailed.retries} (${detailed.retryRate.toFixed(1)}%)`,
    `⏱️  Avg Response Time: ${detailed.avgResponseTimeMs}ms`,
    `🏥 Health Status: ${detailed.isHealthy ? "✅ Healthy" : "⚠️ Unhealthy"}`,
    "",
    `Generated: ${new Date().toISOString()}`,
  ].join("\n");
}

/**
 * ⚠️ בדיקה אם יש בעיות ביצועים
 */
export function checkPerformanceIssues(): {
  hasIssues: boolean;
  issues: string[];
  recommendations: string[];
} {
  const detailed = getDetailedStats();
  const issues: string[] = [];
  const recommendations: string[] = [];

  // בדיקת success rate נמוך
  if (detailed.successRate < 90 && detailed.operations > 10) {
    issues.push(`Success rate נמוך (${detailed.successRate.toFixed(1)}%)`);
    recommendations.push("בדוק חיבור רשת ושטח אחסון פנוי");
  }

  // בדיקת זמן תגובה גבוה
  if (detailed.avgResponseTimeMs > 2000) {
    issues.push(`זמן תגובה גבוה (${detailed.avgResponseTimeMs}ms)`);
    recommendations.push("שקול להקטין כמות הנתונים או לבדוק ביצועי המכשיר");
  }

  // בדיקת retry rate גבוה
  if (detailed.retryRate > 20 && detailed.operations > 5) {
    issues.push(
      `שיעור נסיונות חוזרים גבוה (${detailed.retryRate.toFixed(1)}%)`
    );
    recommendations.push("בדוק יציבות הרשת ופתור בעיות חומרה אפשריות");
  }

  return {
    hasIssues: issues.length > 0,
    issues,
    recommendations,
  };
}

/**
 * 🧪 פונקציות בדיקה (רק לפיתוח)
 */
if (__DEV__) {
  (global as any).__STORAGE_MONITORING__ = {
    getStats: getStorageStats,
    getDetailed: getDetailedStats,
    reset: resetStorageStats,
    report: generatePerformanceReport,
    checkIssues: checkPerformanceIssues,
  };
}
