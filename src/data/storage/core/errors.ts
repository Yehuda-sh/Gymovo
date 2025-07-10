// src/data/storage/core/errors.ts
// 🚨 ניהול שגיאות מתקדם לשירותי אחסון

/**
 * 🚨 מחלקת שגיאות מותאמת לStorage
 * מספקת מידע מפורט על כשלים ואפשרויות לטיפול
 */
export class StorageError extends Error {
  constructor(
    message: string,
    public operation: string,
    public key?: string,
    public originalError?: any,
    public isRetryable: boolean = true
  ) {
    super(message);
    this.name = "StorageError";
  }

  /**
   * יוצר representation ידידותי למשתמש של השגיאה
   */
  toUserFriendlyMessage(): string {
    switch (this.operation) {
      case "getPlansByUserId":
        return "לא ניתן לטעון את תוכניות האימון";
      case "savePlan":
        return "לא ניתן לשמור את התוכנית";
      case "getWorkoutHistory":
        return "לא ניתן לטעון את היסטוריית האימונים";
      case "saveWorkoutToHistory":
        return "לא ניתן לשמור את האימון";
      default:
        return "שגיאה בטעינה או שמירה של נתונים";
    }
  }

  /**
   * יוצר object עם פרטי השגיאה לצורכי לוגים
   */
  toLogObject() {
    return {
      name: this.name,
      message: this.message,
      operation: this.operation,
      key: this.key,
      isRetryable: this.isRetryable,
      originalError: this.originalError?.message || this.originalError,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * 🔍 בדיקה אם שגיאה ניתנת לניסיון חוזר
 * מחזיר true אם כדאי לנסות שוב, false אם השגיאה קבועה
 */
export function isRetryable(error: unknown): boolean {
  const err = error as Error;

  // שגיאות רשת וזמן קצוב - ניתנות לחזרה
  if (err.message?.includes("timeout")) return true;
  if (err.message?.includes("network")) return true;
  if (err.message?.includes("Network")) return true;
  if ((err as any).code === "NETWORK_ERROR") return true;

  // שגיאות AsyncStorage ספציפיות
  if (err.message?.includes("AsyncStorage")) return true;
  if (err.message?.includes("Storage")) return true;

  // שגיאות שאינן ניתנות לחזרה
  if (err.message?.includes("quota")) return false; // מקום אחסון מלא
  if (err.message?.includes("Permission")) return false; // הרשאות
  if (err.message?.includes("Invalid data")) return false; // נתונים פגומים

  // ברירת מחדל - נסה שוב (conservative approach)
  return true;
}

/**
 * 🛡️ Wrapper בטוח לפעולות שעלולות לזרוק שגיאות
 * מחזיר [result, error] במקום לזרוק exception
 */
export async function safeExecute<T>(
  operation: () => Promise<T>
): Promise<[T | null, StorageError | null]> {
  try {
    const result = await operation();
    return [result, null];
  } catch (error) {
    if (error instanceof StorageError) {
      return [null, error];
    }

    // המרה לStorageError אם זה שגיאה רגילה
    const storageError = new StorageError(
      `Unexpected error: ${(error as Error).message}`,
      "unknown",
      undefined,
      error
    );
    return [null, storageError];
  }
}

/**
 * 📝 יוצר הודעת שגיאה עשירה למפתחים
 */
export function createDeveloperErrorMessage(
  error: StorageError,
  context?: any
): string {
  return [
    `🚨 Storage Error in ${error.operation}`,
    `Message: ${error.message}`,
    error.key ? `Key: ${error.key}` : null,
    `Retryable: ${error.isRetryable}`,
    context ? `Context: ${JSON.stringify(context, null, 2)}` : null,
    error.originalError ? `Original: ${error.originalError}` : null,
    `Time: ${new Date().toISOString()}`,
  ]
    .filter(Boolean)
    .join("\n");
}
