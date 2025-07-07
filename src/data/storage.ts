// src/data/storage.ts - גרסה משודרגת

// 🆕 מחלקת שגיאות מותאמת
export class StorageError extends Error {
  constructor(
    message: string,
    public operation: string,
    public originalError?: any
  ) {
    super(message);
    this.name = "StorageError";
  }
}

// 🆕 Retry mechanism עם exponential backoff
const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;

      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
      console.warn(
        `Storage retry ${attempt + 1}/${maxRetries} after ${delay}ms`
      );
    }
  }
  throw new Error("Max retries exceeded");
};

// 🆕 פונקציה מותאמת לניהול מפתחות
const getStorageKey = (type: "plans" | "workouts" | "quiz", userId: string) => {
  const keyMap = {
    plans: `plans_${userId}`,
    workouts: `workout_history_${userId}`,
    quiz: `quiz_progress_${userId}`,
  };
  return keyMap[type];
};
