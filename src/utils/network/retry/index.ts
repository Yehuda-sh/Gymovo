// src/utils/network/retry/index.ts
// לוגיקת retry וניסיון חוזר

import { RetryOptions } from "../types";
import { enhanceError } from "../errors";
import { checkInternetConnection } from "../connection";
import { createNetworkError } from "../errors";

/**
 * פונקצית עזר לעיכוב
 * @param ms מילישניות להמתנה
 */
export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * מבצע פעולה עם retry logic
 * @param fetchFn הפונקציה לביצוע
 * @param options אפשרויות retry
 */
export const withRetry = async <T>(
  fetchFn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> => {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    backoffMultiplier = 2,
    onRetry,
  } = options;

  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // בדיקת חיבור לפני הבקשה (רק בניסיון הראשון)
      if (attempt === 0) {
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
          throw createNetworkError("אין חיבור לאינטרנט", 0);
        }
      }

      // ביצוע הפעולה
      const result = await fetchFn();
      return result;
    } catch (error: any) {
      lastError = error;

      // אם זה הניסיון האחרון, זרוק את השגיאה
      if (attempt === maxRetries) {
        throw enhanceError(error, () => withRetry(fetchFn, options));
      }

      // קרא ל-callback אם קיים
      if (onRetry) {
        onRetry(attempt + 1);
      }

      // חכה לפני הניסיון הבא (עם exponential backoff)
      const delay = retryDelay * Math.pow(backoffMultiplier, attempt);
      await sleep(delay);
    }
  }

  throw lastError!;
};

/**
 * חוצה פעולה עם retry אינטליגנטי
 * בודק סוג השגיאה ומחליט אם כדאי לנסות שוב
 * @param fetchFn הפונקציה לביצוע
 * @param options אפשרויות retry
 */
export const smartRetry = async <T>(
  fetchFn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> => {
  const shouldRetry = (error: any, attempt: number): boolean => {
    // אל תנסה שוב על שגיאות שלא כדאי
    if (error.statusCode) {
      const nonRetryableStatuses = [400, 401, 403, 404, 422];
      if (nonRetryableStatuses.includes(error.statusCode)) {
        return false;
      }
    }

    // אל תנסה שוב אם זה הניסיון האחרון
    return attempt < (options.maxRetries || 3);
  };

  const {
    maxRetries = 3,
    retryDelay = 1000,
    backoffMultiplier = 2,
    onRetry,
  } = options;

  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await fetchFn();
      return result;
    } catch (error: any) {
      lastError = error;

      // בדוק אם כדאי לנסות שוב
      if (!shouldRetry(error, attempt)) {
        throw enhanceError(error, () => smartRetry(fetchFn, options));
      }

      // קרא ל-callback
      if (onRetry) {
        onRetry(attempt + 1);
      }

      // עיכוב עם jitter (רעש אקראי למניעת thundering herd)
      const baseDelay = retryDelay * Math.pow(backoffMultiplier, attempt);
      const jitter = Math.random() * 0.3 * baseDelay; // 30% jitter
      const delay = baseDelay + jitter;

      await sleep(delay);
    }
  }

  throw lastError!;
};

/**
 * מבצע כמה פעולות במקביל עם retry
 * @param tasks מערך של פונקציות לביצוע
 * @param options אפשרויות retry
 */
export const retryBatch = async <T>(
  tasks: (() => Promise<T>)[],
  options: RetryOptions = {}
): Promise<T[]> => {
  const promises = tasks.map((task) => withRetry(task, options));
  return Promise.all(promises);
};

/**
 * ברירת מחדל לאפשרויות retry
 */
export const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  retryDelay: 1000,
  backoffMultiplier: 2,
  onRetry: () => {},
};
