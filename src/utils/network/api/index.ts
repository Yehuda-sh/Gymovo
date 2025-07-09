// src/utils/network/api/index.ts
// פונקציות API עם retry מובנה

import { ApiCallOptions } from "../types";
import { withRetry } from "../retry";
import { createNetworkError, showNetworkError } from "../errors";

/**
 * מבצע קריאת API עם retry אוטומטי
 * @param url כתובת ה-API
 * @param options אפשרויות הבקשה
 */
export const apiCall = async <T>(
  url: string,
  options: ApiCallOptions = {}
): Promise<T> => {
  const {
    retryOptions = {},
    showErrorDialog = true,
    customErrorMessage,
    ...fetchOptions
  } = options;

  return withRetry(async () => {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
      },
    });

    if (!response.ok) {
      const error = createNetworkError(
        `Request failed with status ${response.status}`,
        response.status
      );

      if (showErrorDialog) {
        showNetworkError(error, customErrorMessage);
      }

      throw error;
    }

    return response.json();
  }, retryOptions);
};

/**
 * GET request עם retry
 * @param url כתובת ה-API
 * @param options אפשרויות הבקשה
 */
export const get = async <T>(
  url: string,
  options: ApiCallOptions = {}
): Promise<T> => {
  return apiCall<T>(url, {
    ...options,
    method: "GET",
  });
};

/**
 * POST request עם retry
 * @param url כתובת ה-API
 * @param data נתונים לשליחה
 * @param options אפשרויות הבקשה
 */
export const post = async <T>(
  url: string,
  data?: any,
  options: ApiCallOptions = {}
): Promise<T> => {
  return apiCall<T>(url, {
    ...options,
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });
};

/**
 * PUT request עם retry
 * @param url כתובת ה-API
 * @param data נתונים לשליחה
 * @param options אפשרויות הבקשה
 */
export const put = async <T>(
  url: string,
  data?: any,
  options: ApiCallOptions = {}
): Promise<T> => {
  return apiCall<T>(url, {
    ...options,
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });
};

/**
 * DELETE request עם retry
 * @param url כתובת ה-API
 * @param options אפשרויות הבקשה
 */
export const del = async <T>(
  url: string,
  options: ApiCallOptions = {}
): Promise<T> => {
  return apiCall<T>(url, {
    ...options,
    method: "DELETE",
  });
};

/**
 * PATCH request עם retry
 * @param url כתובת ה-API
 * @param data נתונים לשליחה
 * @param options אפשרויות הבקשה
 */
export const patch = async <T>(
  url: string,
  data?: any,
  options: ApiCallOptions = {}
): Promise<T> => {
  return apiCall<T>(url, {
    ...options,
    method: "PATCH",
    body: data ? JSON.stringify(data) : undefined,
  });
};

/**
 * בדיקת בריאות של API endpoint
 * @param url כתובת ה-API
 * @param timeout timeout במילישניות
 */
export const healthCheck = async (
  url: string,
  timeout: number = 5000
): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    return false;
  }
};

/**
 * מבצע כמה קריאות API במקביל
 * @param requests מערך של בקשות
 */
export const batchRequests = async <T>(
  requests: Array<() => Promise<T>>
): Promise<T[]> => {
  return Promise.all(requests.map((request) => request()));
};

/**
 * מבצע כמה קריאות API עם throttling
 * @param requests מערך של בקשות
 * @param concurrency מספר בקשות מקבילות מקסימלי
 */
export const throttledRequests = async <T>(
  requests: Array<() => Promise<T>>,
  concurrency: number = 3
): Promise<T[]> => {
  const results: T[] = [];

  for (let i = 0; i < requests.length; i += concurrency) {
    const batch = requests.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map((request) => request()));
    results.push(...batchResults);
  }

  return results;
};
