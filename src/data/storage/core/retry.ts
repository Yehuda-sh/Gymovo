// src/data/storage/core/retry.ts
// 🔄 מנגנון נסיון חוזר מתקדם עם exponential backoff

import { StorageError } from "./errors";
import { updateStorageStats } from "./monitoring";

// 🔧 הגדרות retry וטיפול בשגיאות
export const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 5000,
  backoffFactor: 2,
} as const;

export const STORAGE_CONFIG = {
  timeout: 10000, // 10 שניות timeout
  compressionThreshold: 50000, // דחיסה מעל 50KB
} as const;

/**
 * 🔄 פונקציית retry עם exponential backoff
 * מבצעת פעולה עם ניסיון חוזר במקרה של כשל
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  operationName: string,
  key?: string,
  retryConfig = RETRY_CONFIG
): Promise<T> {
  const startTime = Date.now();
  updateStorageStats("operations", 1);

  for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
    try {
      const result = await Promise.race([
        operation(),
        new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new Error("Storage operation timeout")),
            STORAGE_CONFIG.timeout
          )
        ),
      ]);

      // עדכון סטטיסטיקות בהצלחה
      const responseTime = Date.now() - startTime;
      updateStorageStats("successes", 1);
      updateStorageStats("avgResponseTime", responseTime);

      if (__DEV__ && attempt > 0) {
        console.log(
          `✅ ${operationName} succeeded after ${attempt} retries (${responseTime}ms)`
        );
      }

      return result;
    } catch (error) {
      const isLastAttempt = attempt === retryConfig.maxRetries;
      const { isRetryable } = await import("./errors");
      const isRetryableError = isRetryable(error as Error);

      if (isLastAttempt || !isRetryableError) {
        updateStorageStats("failures", 1);

        if (__DEV__) {
          console.error(`❌ ${operationName} failed permanently:`, error);
          const { getStorageStats } = await import("./monitoring");
          console.log("📊 Storage Stats:", getStorageStats());
        }

        throw new StorageError(
          `${operationName} failed after ${attempt} attempts: ${
            (error as Error).message
          }`,
          operationName,
          key,
          error,
          isRetryableError
        );
      }

      // חישוב זמן המתנה עם exponential backoff + jitter
      const baseDelay = Math.min(
        retryConfig.baseDelayMs * Math.pow(retryConfig.backoffFactor, attempt),
        retryConfig.maxDelayMs
      );
      const jitter = Math.random() * 0.1 * baseDelay; // 10% jitter
      const delay = baseDelay + jitter;

      updateStorageStats("retries", 1);

      if (__DEV__) {
        console.warn(
          `⚠️ ${operationName} attempt ${
            attempt + 1
          } failed, retrying in ${Math.round(delay)}ms:`,
          (error as Error).message
        );
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // לא אמור להגיע לכאן
  throw new StorageError(
    `Unexpected error in ${operationName}`,
    operationName,
    key
  );
}
