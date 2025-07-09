// src/utils/network/cancelable/index.ts
// מערכת ביטול בקשות

import { apiCall } from "../api";
import { ApiCallOptions } from "../types";

/**
 * מחלקה לביטול בקשות
 */
export class CancelableRequest<T> {
  private abortController: AbortController;
  private promise: Promise<T>;
  private _isCancelled = false;

  constructor(fetchFn: (signal: AbortSignal) => Promise<T>) {
    this.abortController = new AbortController();
    this.promise = fetchFn(this.abortController.signal);
  }

  /**
   * מחזיר את ה-Promise של הבקשה
   */
  get request(): Promise<T> {
    return this.promise;
  }

  /**
   * מחזיר האם הבקשה בוטלה
   */
  get isCancelled(): boolean {
    return this._isCancelled;
  }

  /**
   * מבטל את הבקשה
   */
  cancel(): void {
    this._isCancelled = true;
    this.abortController.abort();
  }
}

/**
 * יוצר API call שניתן לביטול
 * @param url כתובת ה-API
 * @param options אפשרויות הבקשה
 */
export const cancelableApiCall = <T>(
  url: string,
  options: ApiCallOptions = {}
): CancelableRequest<T> => {
  return new CancelableRequest((signal) =>
    apiCall<T>(url, { ...options, signal })
  );
};

/**
 * יוצר fetch request שניתן לביטול
 * @param url כתובת ה-API
 * @param options אפשרויות הבקשה
 */
export const cancelableFetch = <T>(
  url: string,
  options: RequestInit = {}
): CancelableRequest<T> => {
  return new CancelableRequest(async (signal) => {
    const response = await fetch(url, {
      ...options,
      signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  });
};

/**
 * מנהל לביטול כמה בקשות
 */
export class RequestManager {
  private requests = new Map<string, CancelableRequest<any>>();

  /**
   * מוסיף בקשה חדשה
   * @param key מפתח הבקשה
   * @param request הבקשה
   */
  add<T>(key: string, request: CancelableRequest<T>): void {
    // בטל בקשה קיימת באותו key
    this.cancel(key);

    this.requests.set(key, request);

    // הסר מהמפה כאשר הבקשה מסתיימת
    request.request.finally(() => {
      this.requests.delete(key);
    });
  }

  /**
   * מבטל בקשה לפי key
   * @param key מפתח הבקשה
   */
  cancel(key: string): void {
    const request = this.requests.get(key);
    if (request) {
      request.cancel();
      this.requests.delete(key);
    }
  }

  /**
   * מבטל את כל הבקשות
   */
  cancelAll(): void {
    // שימוש ב-forEach במקום for...of לתמיכה טובה יותר
    this.requests.forEach((request) => {
      request.cancel();
    });
    this.requests.clear();
  }

  /**
   * מחזיר את מספר הבקשות הפעילות
   */
  get activeCount(): number {
    return this.requests.size;
  }

  /**
   * מחזיר רשימה של keys של בקשות פעילות
   */
  get activeKeys(): string[] {
    return Array.from(this.requests.keys());
  }
}

/**
 * מנהל בקשות גלובלי
 */
export const globalRequestManager = new RequestManager();

/**
 * Utility function לביטול בקשות לפי pattern
 * @param pattern regex pattern לביטול
 */
export const cancelByPattern = (pattern: RegExp): void => {
  const activeKeys = globalRequestManager.activeKeys;
  const keysToCancel = activeKeys.filter((key) => pattern.test(key));

  keysToCancel.forEach((key) => {
    globalRequestManager.cancel(key);
  });
};

/**
 * Timeout wrapper לבקשות
 * @param request הבקשה
 * @param timeout זמן timeout במילישניות
 */
export const withTimeout = <T>(
  request: CancelableRequest<T>,
  timeout: number
): CancelableRequest<T> => {
  const timeoutId = setTimeout(() => {
    request.cancel();
  }, timeout);

  // בטל את הטיימר כאשר הבקשה מסתיימת
  request.request.finally(() => {
    clearTimeout(timeoutId);
  });

  return request;
};
